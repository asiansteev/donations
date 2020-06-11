import React from 'react';
import PropTypes from 'prop-types';
import { Box, PseudoBox } from '@chakra-ui/core';
import { IsDesktop } from '../utils/mediaQueries';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';

const Layout = ({ children, title, subtitle }) => (
  <Box
    backgroundColor='dark'
    minHeight='100vh'
  >
    <Hero 
      title={title} 
      subtitle={subtitle}
      padding={['24px', null, null, '17%', '20%']}
    />
    <PseudoBox px={['24px', null, null, '17%', '20%']}>
      { children }
    </PseudoBox>
    <Footer padding={['24px', null, null, '17%', '20%']}/>
  </Box>
)

export default Layout;