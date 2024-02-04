import {
  Card,
  CardBody,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import React from "react";

const ProfileHeaderSkeleton = () => {
  const { colorMode } = useColorMode();

  return (
    <Card
      mb={8}
      variant={colorMode === "dark" ? "elevated" : "outline"}
      rounded="lg"
      boxShadow={"md"}
    >
      <CardBody>
        <Flex overflow="hidden">
          <Flex
            flex="1"
            flexDirection="column"
            align="center"
            justify="center"
            gap={2}
          >
            <VStack mt={1} spacing={2} w="full">
              <SkeletonCircle size="6.75em" />

              <VStack
                align="center"
                w={{ base: "80%", md: "full" }}
                mt={1}
                mb={2}
                gap={2}
              >
                <Skeleton
                  height="14px"
                  width={{ base: "30%", md: "60%" }}
                  rounded="full"
                />
                <Skeleton
                  height="16px"
                  width={{ base: "60%", md: "90%" }}
                  rounded="full"
                />
              </VStack>

              <SkeletonText
                mt={2}
                noOfLines={{ base: 3, md: 5 }}
                spacing="2"
                skeletonHeight="2"
                w={{ base: "80%", md: "full" }}
              />

              <Stack
                direction={{ base: "row", md: "column" }}
                w="full"
                spacing={4}
                pt="2"
                mt={{
                  base: "1",
                  md: "3",
                }}
              >
                <Flex flex="1" justify="center">
                  <Skeleton height="2em" w="full" rounded="2xl" />
                </Flex>
                <Flex flex="1" justify="center">
                  <Skeleton height="2em" w="full" rounded="2xl" />
                </Flex>
              </Stack>
            </VStack>
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default ProfileHeaderSkeleton;
