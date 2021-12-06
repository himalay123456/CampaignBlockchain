import React, {useState} from 'react';
import { Stack, Heading, Flex, Text, Input,
    InputGroup, Box,  Button, Alert, AlertIcon  } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from 'next/router';
import { InputControl, SubmitButton } from "formik-chakra-ui";
import Layout from '../../../layout';
import campaign from '../../../campaign';
import web3 from '../../../web3';

const CampaignDetails = ({ minimumContribution, balance, requestsCount, approversCount, manager, address }) => {
    const [loading, setLoading ] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    return (
        <Box p="5" pl="10">
            <Heading fontSize="25">Campaign Details</Heading>
            <Flex>
                <Box w="63%" py="5">
                    <Flex mt="5" flexWrap="wrap">
                        <Box w="3xl" mr="4" my="2" borderWidth='1px' borderRadius='lg' overflow='hidden'>
                            <Box p="5">
                            <Heading fontSize="20px" color="black" textAlign="right">Campaign Manager Address</Heading>
                            <Heading fontSize="12px" color="darkgrey" fontWeight="semibold" textAlign="right" mt="2" >This Campaign is created by this address. The Manager can create requests to withdraw money.</Heading>
                            <Heading fontSize="17px" color="grey" textAlign="right" mt="2">{manager}</Heading>
                            </Box>
                        </Box>
                        <Box w="sm" mr="2" my="2" borderWidth='1px' borderRadius='lg' overflow='hidden'>
                            <Box p="5">
                            <Heading fontSize="20px" color="black" textAlign="right">Campaign Balance</Heading>
                            <Heading fontSize="12px" color="darkgrey" fontWeight="semibold" textAlign="right" mt="2" >This balance lets the contributer knows how much balance is left to spend.</Heading>
                            <Heading fontSize="17px" color="grey" textAlign="right" mt="2">{ web3.utils.fromWei(balance, 'ether')} Ether</Heading>
                            </Box>
                        </Box>
                        <Box w="sm" mr="2" my="2" borderWidth='1px' borderRadius='lg' overflow='hidden'>
                            <Box p="5">
                            <Heading fontSize="20px" color="black" textAlign="right">Minimum Contribution</Heading>
                            <Heading fontSize="12px" color="darkgrey" fontWeight="semibold" textAlign="right" mt="2" >You must contribute this minimum amount to be a approver.</Heading>
                            <Heading fontSize="17px" color="grey" textAlign="right" mt="2">{minimumContribution} WEI ( { web3.utils.fromWei(minimumContribution, 'ether') } Ether )</Heading>
                            </Box>
                        </Box>
                        <Box w="sm" mr="2" my="2" borderWidth='1px' borderRadius='lg' overflow='hidden'>
                            <Box p="5">
                                <Heading fontSize="20px" color="black" textAlign="right">Requests</Heading>
                                <Heading fontSize="12px" color="darkgrey" fontWeight="semibold" textAlign="right" mt="2" >Requests are created when the manager has to withdraw amount.</Heading>
                                <Heading fontSize="17px" color="grey" textAlign="right" mt="2">{requestsCount}</Heading>
                            </Box>
                        </Box>
                        <Box w="sm" mr="2" my="2" borderWidth='1px' borderRadius='lg' overflow='hidden'>
                            <Box p="5">
                                <Heading fontSize="20px" color="black" textAlign="right">Contributors</Heading>
                                <Heading fontSize="12px" color="darkgrey" fontWeight="semibold" textAlign="right" mt="2" >Number of people who have donated to this campaign so far.</Heading>
                                <Heading fontSize="17px" color="grey" textAlign="right" mt="2">{approversCount}</Heading>
                            </Box>
                        </Box>
                    </Flex>
                    <Box textAlign="right" pr="5%">
                        <Button
                            as={'a'}
                            href={`/campaigns/${address}/requests`}
                            colorScheme='teal'
                            mt="5"
                            w="50%"
                            variant='solid'
                        >
                            View Requests
                        </Button>
                        </Box>
                </Box>
                <Box w="37%" pl="50px">
                <Formik
                    initialValues={{ value: 0,  }}
                    onSubmit={async(values) => {
                        try{
                            console.log(values);
                            setLoading(true);
                            setSuccess(false);
                            setError('');
                            const accounts = await web3.eth.getAccounts();
                            const Campaign = campaign(address);
                            await Campaign.methods.contribute().send({ from:accounts[0], value: web3.utils.toWei(values.value, 'ether') });
                            setLoading(false);
                            setSuccess(true);
                            router.replace(`/campaigns/${address}`);
                        }catch(err){
                        console.log(err)
                        setError(err.message);
                        setLoading(false);
                        }
                    }}
                >
                    {({ setFieldValue }) => (
                    <Form>
                    <Stack spacing={4}>
                    { success && <Alert status='success'>
                        <AlertIcon />
                            Amount Contributed Successfully!
                        </Alert>
                    }
                    { error.length >  0 && <Alert status='error'>
                        <AlertIcon />
                        {error}
                        </Alert>
                    }
                    { loading && <Alert status='info'>
                        <AlertIcon />
                            Please hold still. The contribution process may take maybe 10-15 sec.
                        </Alert>
                    }
                        <Heading fontSize="20">Contribute the money to campaign</Heading>
                    <InputGroup>
                        <Input
                            type="text"
                            width="90%"
                            name="value"
                            placeholder="Enter the amount to contribute (In Ether) "
                            onChange={(e) => setFieldValue("value", e.target.value)}
                            id="value"
                        />
                        </InputGroup>
                        <SubmitButton isLoading={loading} width="110px" colorScheme="orange">Contribute</SubmitButton>
                    </Stack>
                    </Form>
                    )}
                </Formik>
                </Box>
            </Flex>
        </Box>
    )
}

CampaignDetails.getInitialProps = async (ctx) => {
    const Campaign = campaign(ctx.query.id);
    const details = await Campaign.methods.getSummary().call();
    return { 
        minimumContribution: details[0],
        balance: details[1],
        requestsCount: details[2],
        approversCount: details[3],
        manager: details[4],
        address: ctx.query.id,
     }
  }
  

export default CampaignDetails;

CampaignDetails.getLayout = (page) => (
    <Layout text={"Admin Dashboard"}>{page}</Layout>
  );