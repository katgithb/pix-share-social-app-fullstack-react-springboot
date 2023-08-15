import altLogo from "../../assets/images/pixshare_logo_gray.png";
import logo from "../../assets/images/pixshare_logo.png";
import signupBg from "../../assets/images/pixshare_signin_signup_bg.png";
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
  Select,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link as RouteLink } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { BiHide, BiShow } from "react-icons/bi";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";

const Signup = () => {
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
        <Image src={signupBg} alt="Cover Image" objectFit="cover" />
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
            <Heading fontSize="2xl">Register an account</Heading>
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
              <Stack
                w="full"
                spacing={3}
                direction={{ base: "column", md: "row" }}
              >
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input rounded="md" type="text" />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input rounded="md" type="text" />
                  </FormControl>
                </Box>
              </Stack>

              <Stack
                w="full"
                spacing={3}
                direction={{ base: "column", md: "row" }}
              >
                <Box flex={1}>
                  <FormControl id="username" isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input rounded="md" type="text" />
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl id="gender" isRequired>
                    <FormLabel>Gender</FormLabel>
                    <Select rounded="md">
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  </FormControl>
                </Box>
              </Stack>

              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input rounded="md" type="email" />
              </FormControl>

              <Stack
                w="full"
                spacing={3}
                direction={{ base: "column", md: "row" }}
              >
                <FormControl id="password" isRequired>
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
              </Stack>
            </VStack>
            <VStack w="full">
              <Button
                bg="blue.400"
                color="white"
                _hover={{
                  bg: "blue.500",
                }}
                rounded="md"
                w="full"
              >
                Sign Up
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
                Already a user?
                <Link as={RouteLink} to="/login">
                  <Text
                    as="span"
                    pl={1}
                    color={useColorModeValue("blue.500", "blue.300")}
                  >
                    Sign In
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

export default Signup;
