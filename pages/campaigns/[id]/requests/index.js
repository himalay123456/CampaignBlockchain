import React, { useState } from 'react'
import Layout from '../../../../layout';
import { Box, Flex, Button, Table, TableCaption, Thead, Tr, Th, Td, Tfoot, Tbody, Alert, AlertIcon } from '@chakra-ui/react';
import campaign from '../../../../campaign';
import web3 from '../../../../web3';
import { useRouter } from 'next/router';

function Requests({ address, requests, approversCount }) {
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false);
    const [error, setError] = useState(''); 
    const router = useRouter();
    const approveRequest = async(index) => {
        try{
            setLoading(true);
            setError('');
            const Campaign = campaign(address);
            const accounts = await web3.eth.getAccounts();
            const requestCount = await Campaign.methods.approveRequest(index).send({
                from: accounts[0]
            });
            setLoading(false);
            router.replace(`/campaigns/${address}/requests`);
        }catch(err){
            console.log(err);
            setLoading(false);
            setError(err.message);
        }
    }

    const finalizeRequest = async(index) => {
        try{
            setLoading1(true);
            setError('');
            const Campaign = campaign(address);
            const accounts = await web3.eth.getAccounts();
            const requestCount = await Campaign.methods.finalizeRequest(index).send({
                from: accounts[0]
            });
            setLoading1(false);
            router.replace(`/campaigns/${address}/requests`);
        }catch(err){
            console.log(err);
            setLoading1(false);
            setError(err.message);
        }
    }

    return (
        <Box p="5">
            <Flex justifyContent="flex-end">
                <Box>
                <Button
                    as={'a'}
                    href={`/campaigns/${address}/requests/new`}
                    colorScheme='teal'
                    mt="5"
                    w="100%"
                    variant='solid'
                >
                    Create Request
                </Button>
                </Box>
            </Flex>
            <Box mt="5">
            { error.length >  0 && <Alert status='error' w="100%" mb="3">
                <AlertIcon />
                    {error}
                </Alert>
            }
            <Table variant='striped' colorScheme='orange'>
                <TableCaption textAlign="left">{requests.length} Requests Found!</TableCaption>
                <Thead>
                    <Tr>
                    <Th>Id</Th>
                    <Th>Description</Th>
                    <Th>Amount (Ether)</Th>
                    <Th>Recipient</Th>
                    <Th>Approval count</Th>
                    <Th>Approve</Th>
                    <Th>Finalize</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {requests.map((request, index) => (
                        <Tr key={index}>
                            <Td>{index+1}</Td>
                            <Td>{request.description}</Td>
                            <Td>{web3.utils.fromWei(request.value, 'ether')}</Td>
                            <Td>{request.recipient}</Td>
                            <Td>{request.approvalCount}/{approversCount}</Td>
                            <Td>
                                {!request.complete ? (
                                <Button isLoading={loading} onClick={() => approveRequest(index)} colorScheme='teal' variant='outline'>
                                    Approve
                                </Button>
                                ) : (
                                <Button colorScheme='green' variant='outline'>
                                    Closed
                                </Button>  
                                )}
                            </Td>
                            <Td>
                                { request.approvalCount >= approversCount/2 ? (
                                <Button isLoading={loading1} onClick={() => finalizeRequest(index)} colorScheme='orange' variant='outline'>
                                    Finalize
                                </Button>
                                ) : (
                                <Button fontSize="xs" colorScheme='orange' variant='outline'>
                                    Not Ready To Finalize
                                </Button> 
                                )}
                            </Td>
                        </Tr>
                    ))}
                    
                </Tbody>
                </Table>
            </Box>
        </Box>
    )
}

export default Requests;

Requests.getInitialProps = async (ctx) => {
    const Campaign = campaign(ctx.query.id);
    console.log(ctx.query.id);
    const requestCount = await Campaign.methods.getRequestsCount().call();
    console.log(requestCount)
    const requests = await Promise.all(
        Array(parseInt(requestCount)).fill().map((element, index) => {
            return Campaign.methods.requests(index).call();
        })
    )
    console.log(requests)
    const approversCount = await Campaign.methods.approversCount().call();

    return { address: ctx.query.id, requests:requests, approversCount:approversCount }
  }
  


Requests.getLayout = (page) => (
    <Layout>{page}</Layout>
  );