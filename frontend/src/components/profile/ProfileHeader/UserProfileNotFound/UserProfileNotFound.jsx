import {
  Avatar,
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import UserProfileStatsNotFound from "./UserProfileStatsNotFound";

const UserProfileNotFound = () => {
  const { colorMode } = useColorMode();
  const profileNotFoundNoticeText = (
    <>
      Sorry, the profile you are looking for doesn't exist or is not available.
      <br />
      Please check the username or try again later.
    </>
  );

  const handleRefreshProfile = () => {
    // Reload the page
    window.location.reload();
  };

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
              <Box
                bgGradient={"linear(to-tr, yellow.400, pink.400, purple.600)"}
                p={"1"}
                rounded="full"
              >
                <Box bg="gray.50" p={"0.5"} rounded="full">
                  <Avatar
                    size="xl"
                    boxShadow={"md"}
                    _hover={{
                      transition: "transform 0.3s ease",
                      transform: "rotate(8deg) scale(1.2)",
                    }}
                  />
                </Box>
              </Box>

              <Heading
                size="sm"
                pt={1}
                pb={2}
                alignSelf="center"
                textAlign="center"
                wordBreak="break-word"
              >
                Oops! User Not Found
              </Heading>

              <Box alignSelf="center" textAlign="center">
                <Text
                  fontSize={"sm"}
                  color={useColorModeValue("gray.500", "gray.400")}
                  letterSpacing="wide"
                  whiteSpace="pre-line" // Preserves line breaks
                  lineHeight="1.5"
                >
                  {profileNotFoundNoticeText}
                </Text>
              </Box>
            </VStack>

            <UserProfileStatsNotFound
              handleRefreshProfile={handleRefreshProfile}
            />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};

export default UserProfileNotFound;
