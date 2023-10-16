import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import Animation from "../assets/animations/404Animation.json";

const PageNotFound = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <Container as="main" maxW="7xl" px={2} mx="auto">
      <Box>
        <Flex
          minH="100vh"
          px={6}
          py={12}
          mx="auto"
          display={{ lg: "flex" }}
          alignItems={{ lg: "center" }}
          gap={12}
        >
          <VStack alignItems="start" w={{ lg: "50%" }}>
            <Heading
              fontSize="7xl"
              fontWeight="bold"
              letterSpacing="widest"
              color={useColorModeValue("blue.400", "blue.600")}
              mt={0}
            >
              404
            </Heading>
            <Text
              fontSize="4xl"
              fontWeight="bold"
              letterSpacing="widest"
              color={useColorModeValue("gray.400", "gray.300")}
            >
              Oops! Page Not Found
            </Text>
            <Text mt={4} color="gray.400">
              Sorry, the page you are looking for doesn't exist. Here are some
              helpful links:
            </Text>

            <HStack mt={6} alignItems="center" gap={3}>
              <Button
                px={5}
                py={2}
                leftIcon={<ArrowBackIcon w={5} h={5} />}
                fontSize="sm"
                color="gray.700"
                transition="color 200ms"
                bg="white"
                border="1px"
                rounded="lg"
                _hover={{ bg: "gray.100" }}
                onClick={goBack}
              >
                Go back
              </Button>

              <Button
                px={5}
                py={2}
                fontSize="sm"
                letterSpacing="wide"
                color={useColorModeValue("white", "gray.100")}
                transition="color 200ms"
                bg={useColorModeValue("blue.400", "blue.600")}
                rounded="lg"
                shrink={0}
                _hover={{ bg: "blue.600" }}
                onClick={goHome}
              >
                Take me home
              </Button>
            </HStack>
          </VStack>

          <Box
            pos="relative"
            w={{ base: "100%", lg: "50%" }}
            maxW="xl"
            mt={12}
            mx="auto"
          >
            <Lottie animationData={Animation} loop={true} />
          </Box>
        </Flex>
      </Box>
    </Container>
  );
};

export default PageNotFound;
