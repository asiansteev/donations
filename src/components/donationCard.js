import React from "react"
import { Box, Image, Text, PseudoBox, Tooltip } from "@chakra-ui/core"
import { graphql } from "gatsby"
import Img from "gatsby-image"

const DonationCard = ({
  image,
  name,
  amount,
  donationCurrency,
  profits,
  percent,
  locale,
}) => {
  amount = parseInt(amount)
  profits = parseFloat(profits)
  return (
    <PseudoBox
      padding={["12px", null, "16px", "24px", "30px"]}
      backgroundColor="darkless"
      color="snow"
      borderRadius="10px"
      boxShadow="rgba(0, 0, 0, 0.125) 0px 4px 8px;"
      transition="all .2s ease-in-out"
      _hover={{ transform: "scale(1.05)" }}
      key={name + "Donation Stats"}
    >
      <Box display="flex" flexDirection="row" alignItems="center">
        <PseudoBox
          w={["45px", null, "60px", "70px", "80px"]}
          h={["45px", null, "60px", "70px", "80px"]}
          overflow="hidden"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Img fixed={image} className="card-image" />
        </PseudoBox>
        <Box ml={("8px", null, null, null, "16px")}>
          <Text
            mb={["2px", null, null, "4px", "8px"]}
            mt="2px"
            fontWeight="900"
            fontSize={["18px", "20px", "24px", "28px", "32px"]}
            lineHeight={["20px", null, "24px", "28px", "32px"]}
            isTruncated
            maxWidth={["300px", null, null, null, "390px"]}
          >
            {name}
          </Text>
          <Text
            fontWeight="600"
            color="smoke"
            fontSize={["14px", "16px", "20px", "22px", "24px"]}
            lineHeight={["16px", null, "20px", "22px", "24px"]}
          >
            <Tooltip label="Lorem ipsum" placement="bottom" backgroundColor="dark" color="smoke" px="16px" py="8px" borderRadius="6px" fontSize="16px">
              <PseudoBox as="span" borderBottom="1px solid #6C6C72">
                ${(amount * 1000).toLocaleString("en-us")}
              </PseudoBox>
            </Tooltip>
            {" "}
            <Box as="span" fontSize={["12px", null, "14px", "15px", "16px"]}>
              {donationCurrency}
            </Box>
          </Text>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        mt={["24px", null, null, null, "32px"]}
      >
        <Box mr={["32px", "32px", null, "24px", "32px"]}>
          <Text
            fontWeight="900"
            fontSize={["20px", null, "24px", "28px", "32px"]}
            lineHeight={["20px", null, "24px", "28px", "32px"]}
          >
            {(percent * 100).toFixed(3)}%
          </Text>
          <Text
            color="smoke"
            fontSize={["12px", null, "14px", "15px", "16px"]}
            fontWeight="600"
          >
            of{" "}
            <Tooltip label="Lorem ipsum" placement="bottom" backgroundColor="dark" color="smoke" px="16px" py="8px" borderRadius="6px" fontSize="16px">
              <PseudoBox as="span" borderBottom="1px solid #6C6C72">
                profits
              </PseudoBox>
            </Tooltip>
            {" "}
            donated
          </Text>
        </Box>
        <Box>
          <Text
            fontWeight="900"
            fontSize={["20px", null, "24px", "28px", "32px"]}
            lineHeight={["20px", null, "24px", "28px", "32px"]}
          >
            {(locale.Median_Household_Income * percent).toLocaleString(locale, {
              style: "currency",
              currency: locale.Currency ? locale.Currency : "USD",
            })}
          </Text>
          <Text
            color="smoke"
            fontSize={["12px", null, "14px", "15px", "16px"]}
            fontWeight="600"
          >
            adjusted to{" "}
            <Tooltip label="Lorem ipsum" placement="bottom" backgroundColor="dark" color="smoke" px="16px" py="8px" borderRadius="6px" fontSize="16px">
              <PseudoBox as="span" borderBottom="1px solid #6C6C72">
                avg. income
              </PseudoBox>
            </Tooltip>
          </Text>
        </Box>
      </Box>
    </PseudoBox>
  )
}

export default DonationCard
