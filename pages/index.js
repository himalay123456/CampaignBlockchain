import React from 'react';
import { Box, Flex } from '@chakra-ui/layout';
import { Button, Heading } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import CardComponent from '../components/card';
import factory from '../factory';
import Layout from '../layout';
// import web3 from '../web3';

const Home = ({ contracts }) => {
    return (
    <>
      <Flex justifyContent="center" alignItems="center">
        <Box py="5" px="10" w="85%">
        <Heading fontSize="25px" my="5">Open Campaigns</Heading>
        <Flex
          justifyContent="space-between"
          flexWrap="wrap"
          // align='stretch'
        >
          {
            contracts.map((contract, index) => {
              const property = {
                imageUrl: require('../public/campaign.jpg'),
                imageAlt: 'Rear view of modern home with pool',
                beds: 3,
                baths: 2,
                title: contract,
                formattedPrice: '$1,900.00',
                reviewCount: 34,
                rating: 4,
              }

            return <CardComponent key={contract} index={index} property={property} />

            })
          }
        </Flex>
        </Box>
        <Box w="15%">
          <Button
            leftIcon={<AddIcon />}
            as={'a'}
            // variant={'link'}
            href={'/campaigns/new'}
            colorScheme='orange'
          >
            Create Campaign
          </Button>
        </Box>
        </Flex>
    </>
  )
}

Home.getInitialProps = async (ctx) => {
  const contracts = await factory.methods.getDeployedCampaigns().call();
  return { contracts }
}


export default Home;

Home.getLayout = (page) => (
  <Layout text={"Admin Dashboard"}>{page}</Layout>
);


