// import altLogo from "../../assets/images/pixshare_logo_gray.png";
// import logo from "../../assets/images/pixshare_logo.png";
import {
  Flex,
  Heading,
  Image,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import * as Yup from "yup";
import signinBg from "../../../assets/images/pixshare_signin_signup_bg.png";
import SafeSharingPrivacyAlert from "../../shared/alerts/SafeSharingPrivacyAlert";
import SigninForm from "./SigninForm";

const initialValues = {
  username: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Must be at least 8 characters")
    .max(128, "Must be at most 128 characters")
    .required("Password is required"),
});

const Signin = () => {
  return (
    <>
      <SafeSharingPrivacyAlert />
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

            <SigninForm
              initialValues={initialValues}
              validationSchema={validationSchema}
            />
          </Stack>
        </Flex>
      </Stack>
    </>
  );
};

export default Signin;
