// Sample card from Airbnb
import { Box, Badge, Button, Heading } from '@chakra-ui/react';
import Link from 'next/link'

const Card = ({ property, index }) => {
  
    return (
      <Box maxW='xs' my="2" borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Box p="5">
          <Heading fontSize="20px">Campaign {index+1}</Heading>
        </Box>
        <Box p='6'>
          <Box display='flex' alignItems='baseline'>
            <Badge borderRadius='full' px='2' colorScheme='teal'>
              New
            </Badge>
          </Box>
  
          <Box
            mt='1'
            fontWeight='semibold'
            as='h4'
            lineHeight='tight'
            isTruncated
          >
            {property.title}
          </Box>
          <Box>
          <Button
            as={'a'}
            href={`/campaigns/${property.title}`}
            colorScheme='teal'
            mt="5"
            variant='outline'
          >
            View Campaign
          </Button>
          </Box>
  
          {/* <Box>
            {property.formattedPrice}
            <Box as='span' color='gray.600' fontSize='sm'>
              / wk
            </Box>
          </Box> */}
  
          {/* <Box display='flex' mt='2' alignItems='center'>
            {Array(5)
              .fill('')
              .map((_, i) => (
                <StarIcon
                  key={i}
                  color={i < property.rating ? 'teal.500' : 'gray.300'}
                />
              ))}
            <Box as='span' ml='2' color='gray.600' fontSize='sm'>
              {property.reviewCount} reviews
            </Box>
          </Box> */}
        </Box>
      </Box>
    )
  }

export default Card;