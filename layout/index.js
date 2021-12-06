import React from 'react';
import { Box } from '@chakra-ui/react';
import Header from '../components/header';
import { ChakraProvider } from '@chakra-ui/react';


const Layout = ({ children }) => {
    return (
        <ChakraProvider>
            <Box>
            <Header />
            { children }
            </Box>
        </ChakraProvider>
    )
}

export default Layout;
