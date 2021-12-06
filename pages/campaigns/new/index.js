import React, { useState } from 'react';
import Layout from '../../../layout';
import { Stack, Heading, Flex, Text, Input,
    InputGroup, Box, Alert, AlertIcon  } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { InputControl, SubmitButton } from "formik-chakra-ui";
import { useRouter } from 'next/router';

import factory from '../../../factory';
import web3 from '../../../web3';


const NewCampaign = () => {
    const [loading, setLoading ] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    return (
        <Box width="100%" p="10">
           <Formik
            initialValues={{ minimum: 0,  }}
            onSubmit={async(values) => {
                try{
                    console.log(values);
                    setLoading(true);
                    setSuccess(false);
                    setError('');
                    const accounts = await web3.eth.getAccounts();
                    await factory.methods.createCampaign(values.minimum).send({ from:accounts[0] });
                    setLoading(false);
                    setSuccess(true);
                    router.push('/');
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
                Campaign Created Successfully!
            </Alert>
          }
          { error.length >  0 && <Alert status='error'>
            <AlertIcon />
               {error}
            </Alert>
          }
          { loading && <Alert status='info'>
            <AlertIcon />
                Please hold still. The creation process may take maybe 10-15 sec.
            </Alert>
          }
            <Heading fontSize="20">Create A Campaign</Heading>
          <InputGroup>
              <Input
                type="number"
                width="30%"
                name="minimum"
                placeholder="Minimum Amount (In Wei) "
                onChange={(e) => setFieldValue("minimum", e.target.value)}
                id="minimum"
              />
            </InputGroup>
            <SubmitButton isLoading={loading} width="110px" colorScheme="orange">Create</SubmitButton>
          </Stack>
        </Form>
        )}
      </Formik>
        </Box>
    )
}

export default NewCampaign;

NewCampaign.getLayout = (page) => (
    <Layout text={"Admin Dashboard"}>{page}</Layout>
  );
