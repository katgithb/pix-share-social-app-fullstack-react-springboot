import altLogo from "../../assets/images/pixshare_logo_gray.png";
import logo from "../../assets/images/pixshare_logo.png";
import signinBg from "../../assets/images/pixshare_signin_signup_bg.png";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link as RouteLink } from "react-router-dom";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  return (
    <Stack
      minH="100vh"
      direction={{ base: "column-reverse", md: "row" }}
      gap={0}
    >
      <Flex flex={1} display={{ base: "none", md: "inherit" }}>
        <Image src={signinBg} alt="Cover Image" objectFit="cover" />
      </Flex>
      <Flex
        p={4}
        flex={1}
        align="center"
        justify="center"
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={4}>
          <Stack align="center">
            <Heading fontSize="2xl">Sign in to your account</Heading>
          </Stack>
          <VStack
            as="form"
            spacing={8}
            boxSize={{ base: "xs", sm: "sm", md: "md" }}
            h="max-content !important"
            bg={useColorModeValue("white", "gray.700")}
            rounded="lg"
            boxShadow="lg"
            p={{ base: 5, sm: 10 }}
          >
            <HStack my={-6} py={2} justify="center" w="full">
              <Image
                src={useColorModeValue(logo, altLogo)}
                alt="Logo"
                w={"auto"}
                h={{ base: 8, sm: 10 }}
              />
            </HStack>
            <VStack spacing={4} w="full">
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <Input rounded="md" type="email" />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    rounded="md"
                    type={showPassword ? "text" : "password"}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      fontSize="xl"
                      variant={"ghost"}
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? (
                        <Icon as={PiEyeBold} />
                      ) : (
                        <Icon as={PiEyeClosedBold} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </VStack>
            <VStack w="full">
              <Stack direction="row" justify="space-between" w="full">
                <Checkbox colorScheme="blue" size="md">
                  Remember me
                </Checkbox>
                <Link
                  as={RouteLink}
                  fontSize={{ base: "md", sm: "md" }}
                  color={useColorModeValue("blue.500", "blue.300")}
                  style={{ textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
              </Stack>
              <Button
                bg="blue.400"
                color="white"
                _hover={{
                  bg: "blue.500",
                }}
                rounded="md"
                w="full"
              >
                Sign In
              </Button>
            </VStack>
            <HStack
              my={{ base: -4, md: -6 }}
              pb={2}
              justify="center"
              textAlign="center"
              w="full"
            >
              <Text fontSize="md">
                Don't have an account?
                <Link as={RouteLink} to="/signup">
                  <Text
                    as="span"
                    pl={1}
                    color={useColorModeValue("blue.500", "blue.300")}
                  >
                    Sign Up
                  </Text>
                </Link>
              </Text>
            </HStack>
          </VStack>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default Signin;
