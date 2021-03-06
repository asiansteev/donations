import React, { useState, useEffect, useRef } from "react"
import {
  Slider,
  SliderFilledTrack,
  SliderTrack,
  SliderThumb,
  PseudoBox,
  MenuItem,
  Menu,
  MenuList,
  MenuButton,
  Text,
  Icon,
} from "@chakra-ui/core"
import { useMediaQuery } from "react-responsive"
import CustomButton from "./Button"

const logScale = (min, max, x) => {
  const n = 1.0 - Math.log(min) / Math.log(max)
  return min * Math.pow(max, (n * x) / 100)
}
const invLogScale = (min, max, x) => {
  return 1.0 - Math.log(x / max) / Math.log(min / max)
}
const fakeLog = x => {
  if (x >= 0 && x <= 25) return x
  if (x > 25 && x <= 75) return 1.5 * x - 12.5
  return 20 * x - 1400
}

const causes = {
  blm: {
    name: "Black Lives Matter",
    url:
      "https://secure.actblue.com/donate/ms_blm_homepage_2019?amount=%s&ref=donations.exposed",
  },
  coc: {
    name: "Color of Change",
    url:
      "https://secure.actblue.com/contribute/page/support-us?amount=%s&ref=donations.exposed",
  },
  eji: {
    name: "the Equal Justice Initiative",
    url:
      "https://support.eji.org/give/153413/#!/donation/checkout?amount=%s&ref=donations.exposed",
  },
  naacpLdf: {
    name: "the NAACP Legal Defense Fund",
    url:
      "https://org2.salsalabs.com/o/6857/p/salsa/donation/common/public/?donate_page_KEY=15780&amount=%s&ref=donations.exposed",
  },
}

const DonationSlider = ({ locale, corporations, overrideValue }) => {
  const [rawValue, setRawValue] = useState(0)
  const [causeValue, setCauseValue] = useState(Object.keys(causes)[0])
  // it breaks for some reason if this isn't stored in state AND I DONT KNOW WHY
  const [corps] = useState(corporations)
  const mobile = useMediaQuery({ maxWidth: 650 })

  const [min, setMin] = useState(0)
  const [max, setMax] = useState(0)
  const value = logScale(min, max, rawValue)

  const headerRef = useRef()
  useEffect(() => {
    if (overrideValue > 0) {
      setRawValue(invLogScale(min, max, overrideValue) * 100)
      window.scrollTo({
        left: 0,
        top: headerRef.current.offsetTop,
        behavior: "smooth",
      })
    }
  }, [overrideValue])

  const [formatter, setFormatter] = useState(new Intl.NumberFormat())
  const [intFormatter, setIntFormatter] = useState(new Intl.NumberFormat())
  useEffect(() => {
    const currency = locale.Currency || "USD"
    setMin(
      Number(
        (locale.Income * corps[corps.length - 1].Percent_Profits).toPrecision(1)
      )
    )
    setMax(Number((locale.Income * corps[0].Percent_Profits).toPrecision(1)))
    setFormatter(
      new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      })
    )
    setIntFormatter(
      new Intl.NumberFormat(undefined, {
        style: "currency",
        minimumFractionDigits: 0,
        currency,
      })
    )
  }, [locale])
  const formattedValue = formatter.format(value || 0)

  const notches = []
  for (let i = 0; ; i++) {
    const notch = !mobile
      ? Math.pow(2, (i - 1) % 2) * 5 * Math.pow(10, Math.floor((i - 1) / 2)) // OEIS A268100 (1/5/10...)
      : // ? (Math.pow(i % 3, 2) + 1) * Math.pow(10, Math.floor(i / 3)) // OEIS A051109 (1/2/5/10...)
        Math.pow(10, i)
    if (notch >= max) break
    if (notch > min) notches.push(notch)
  }
  const corp = corps.find(_ => value > _.Percent_Profits * locale.Income)

  const makeDonation = async () => {
    let USD = value
    if (locale.Currency !== "USD") {
      const api = await fetch("https://api.exchangeratesapi.io/latest?base=USD")
      const { rates } = await api.json()
      USD = value / rates[locale.Currency]
    }
    // open new tab + log plausible event
    fetch("https://us-central1-donations-exposed.cloudfunctions.net/donate", {
      method: "POST",
      body: JSON.stringify({
        id: causes[causeValue].name,
        amount: parseFloat(USD.toFixed(2)),
      }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      credentials: "same-origin",
    }).catch(err => console.error(err))
    window.plausible("Donation")
    const target = causes[causeValue].url.replace("%s", USD.toFixed(2))
    window.open(target, "_blank")
  }

  return (
    <>
      <Text
        color="primary.red"
        fontWeight="900"
        fontSize={["24px", "26px", "28px", "30px", "32px"]}
        ref={headerRef}
        as="h2"
      >
        Make a Donation
      </Text>
      <Menu>
        <Text
          color="snow"
          mb={["24px !important", "24px", "24px", "24px", "30px !important"]}
          mt={["12px !important", "10px !important", "8px !important", "8px"]}
          fontSize={["16px", "16px", "16px", "18px", "20px"]}
          maxW="1024px"
          margin="auto"
        >
          Every dollar counts. We're not trying to shame companies for donating
          pennies on the dollar. <wbr />
          If you haven't donated yet, donate some pennies on yours to{" "}
          <MenuButton
            lineHeight="initial"
            pb="3px"
            px="4px"
            ml={["6px", null, "4px"]}
            borderBottom="2.5px solid #F9FAFC"
            color="snow"
            fontWeight="600"
            fontSize={["16px", "16px", "16px", "18px", "20px"]}
            whiteSpace="nowrap"
            display="inline"
          >
            {causes[causeValue].name}
            <Icon ml="6px" name="chevron_down" h={["10px"]} display="inline" />
          </MenuButton>
        </Text>
        <MenuList
          className="flag-menu"
          border="none"
          backgroundColor="dark"
          overflowY="scroll"
          maxHeight={["180px", null, null, "300px"]}
          minWidth={0}
          width="fit-content"
          zIndex="2"
        >
          {Object.entries(causes).map(([id, cause]) => (
            <MenuItem
              key={id}
              py="4px"
              marginBottom="4px"
              fontSize={["14px", "16px", "16px", "16px", "18px"]}
              color="snow"
              onClick={() => {
                setCauseValue(id)
              }}
            >
              {cause.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Slider
        value={rawValue}
        onChange={setRawValue}
        name="donation"
        datalist="notches"
        step={0.1}
        min={0}
        max={100}
        mb={["36px", null, "44px"]}
      >
        <SliderTrack bg="darkless" height="10px" borderRadius="30px" />
        <SliderFilledTrack
          height="10px"
          borderRadius="30px"
          backgroundColor="snow"
        />
        <SliderThumb
          size="16px"
          bg="primary.green"
          aria-label="Donations Slider Thumb"
        />
        <PseudoBox width="100%" position="absolute">
          {notches.map((notch, i) => {
            const percent = invLogScale(min, max, notch)
            return (
              <PseudoBox
                key={i}
                as="span"
                position="absolute"
                top="10px"
                left={`${percent * 100}%`}
                transform="translate(-50%, 0)"
                // ramp from 0.7rem to 1rem
                fontSize={`${Math.abs(rawValue / 100 - percent) * -0.3 + 1}rem`}
                transition="all 250ms"
                color={value >= notch ? "snow" : "slate"}
                // six significant figures for accuracy with KRW/JPY
                onClick={() =>
                  setRawValue(Math.ceil(percent * 1000000) / 10000)
                }
              >
                {intFormatter.format(notch)}
              </PseudoBox>
            )
          })}
        </PseudoBox>
      </Slider>
      <PseudoBox fontSize={["16px", "16px", "16px", "18px", "20px"]}>
        <CustomButton
          display="inline-block"
          onClick={makeDonation}
          fontSize={["16px", "16px", "16px", "18px", "18px"]}
          borderRadius="4px"
          px="16px"
        >
          Donate {formattedValue}
        </CustomButton>
        {corp && (
          <PseudoBox mt="4px">
            <PseudoBox
              fontSize={["14px", null, null, "14px", "16px"]}
              color="smoke"
              as="small"
            >
              That's more than {corp.Name}!
            </PseudoBox>
          </PseudoBox>
        )}
      </PseudoBox>
    </>
  )
}

export default DonationSlider
