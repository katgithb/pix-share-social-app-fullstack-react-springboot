import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  VStack,
} from "@chakra-ui/react";
import React from "react";

const PostFeedCardSkeleton = ({ height, width, index }) => (
  <Flex key={index} h={height} justifyContent="center" overflow="hidden">
    <Card
      flex={1}
      mb={5}
      variant={"outline"}
      maxW="xl"
      rounded="lg"
      boxShadow={"md"}
      _dark={{ variant: "elevated" }}
    >
      <CardHeader>
        <HStack align="center" mb="5px">
          <SkeletonCircle size="3em" />
          <VStack align="start" width="80%">
            <Skeleton height="14px" width="30%" />
            <Skeleton height="12px" width="60%" />
          </VStack>
        </HStack>
      </CardHeader>

      <CardBody as={Flex} flexDir="column" pt={0} px={3}>
        <Box flex={1} mb={3} minH="15rem">
          <Skeleton h="full" width="100%" rounded="lg" />
        </Box>

        <Stack spacing={3} mb={2}>
          <HStack spacing={3} width="80%">
            <Skeleton height="16px" width="45%" rounded="full" />
            <Skeleton height="16px" width="45%" rounded="full" />
          </HStack>
          <SkeletonText noOfLines={2} spacing="2" skeletonHeight="2.5" />
        </Stack>

        <Stack width="100%" spacing={2} pt={2} mb={2} overflow="hidden">
          <HStack align="center">
            <SkeletonCircle size="2em" />
            <Skeleton height="12px" width="30%" />
          </HStack>
          <Box pl="2.5em">
            <SkeletonText noOfLines={2} spacing="2" skeletonHeight="2.5" />
          </Box>
        </Stack>
      </CardBody>

      <CardFooter pt={0} px={3}>
        <HStack align="center" width="100%">
          <Skeleton height="20px" width="100%" rounded="full" />
        </HStack>
      </CardFooter>
    </Card>
  </Flex>
);

export default PostFeedCardSkeleton;
