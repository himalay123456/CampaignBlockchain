import React, {useState} from 'react';
import Layout from '../../../../layout';
import { Stack, Heading, Flex, Text, Input,
    InputGroup, Box,  Button, Alert, AlertIcon  } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from 'next/router';
import { InputControl, SubmitButton } from "formik-chakra-ui";
import campaign from '../../../../campaign';
import web3 from '../../../../web3';

const NewRequest = ({ address }) => {
    const [loading, setLoading ] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    return (
        <Box p="5">
            <Flex>
                <Box w="40%">
                <Formik
                    initialValues={{ description: '', value: '', recipient: ''  }}
                    onSubmit={async(values) => {
                        try{
                            console.log(values);
                            setLoading(true);
                            setSuccess(false);
                            setError('');
                            const accounts = await web3.eth.getAccounts();
                            const Campaign = campaign(address);
                            await Campaign.methods.createRequest(values.description, values.recipient, web3.utils.toWei(values.value, 'ether')).send({ from:accounts[0] });
                            setLoading(false);
                            setSuccess(true);
                            router.replace(`/campaigns/${address}/requests`);
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
                            Request Created Successfully!
                        </Alert>
                    }
                    { error.length >  0 && <Alert status='error'>
                        <AlertIcon />
                        {error}
                        </Alert>
                    }
                    { loading && <Alert status='info'>
                        <AlertIcon />
                            Please hold still. The request creation process may take maybe 10-15 sec.
                        </Alert>
                    }
                        <Heading fontSize="20">Create Request</Heading>
                    <InputGroup>
                        <Input
                            type="text"
                            width="100%"
                            name="description"
                            placeholder="Enter the description of the request "
                            onChange={(e) => setFieldValue("description", e.target.value)}
                            id="description"
                        />
                        </InputGroup>
                        <InputGroup>
                        <Input
                            type="text"
                            width="100%"
                            name="value"
                            placeholder="Enter the spending request amount (In Ether) "
                            onChange={(e) => setFieldValue("value", e.target.value)}
                            id="value"
                        />
                        </InputGroup><InputGroup>
                        <Input
                            type="text"
                            width="100%"
                            name="recipient"
                            placeholder="Enter the recipient address "
                            onChange={(e) => setFieldValue("recipient", e.target.value)}
                            id="recipient"
                        />
                        </InputGroup>
                        <SubmitButton isLoading={loading} width="110px" colorScheme="orange">Create</SubmitButton>
                    </Stack>
                    </Form>
                    )}
                </Formik>
                </Box>
            </Flex>
        </Box>
    )
}

export default NewRequest;

NewRequest.getInitialProps = async (ctx) => {
    return { address: ctx.query.id}
  }
  
NewRequest.getLayout = (page) => (
    <Layout>{page}</Layout>
  );