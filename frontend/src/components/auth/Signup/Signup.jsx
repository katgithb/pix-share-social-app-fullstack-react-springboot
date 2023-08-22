import {
  Flex,
  Heading,
  Image,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import * as Yup from "yup";
import signupBg from "../../../assets/images/pixshare_signin_signup_bg.png";
import SignupForm from "./SignupForm";

const initialValues = {
  firstName: "",
  lastName: "",
  username: "",
  gender: "",
  email: "",
  password: "",
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "Must be at least 3 characters")
    .max(100, "Must be at most 100 characters")
    .required("First Name is required"),
  lastName: Yup.string().max(100, "Must be at most 100 characters"),
  username: Yup.string()
    .min(5, "Must be at least 5 characters")
    .max(50, "Must be at most 50 characters")
    .required("Username is required"),
  gender: Yup.string()
    .oneOf(["MALE", "FEMALE", "OTHER"], "Invalid Gender")
    .required("Gender is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .matches(
      /^[A-Za-z\d!@#$%&*?-_]+$/,
      "Password can only include alphabets, digits, and the specified special characters (!@#$%&*?-_)"
    )
    .min(8, "Must be at least 8 characters")
    .max(128, "Must be at most 128 characters")
    .matches(
      /(?=.*[a-zA-Z])/,
      "Password must include at least one alphabet (a-z A-Z)"
    )
    .matches(/(?=.*\d)/, "Password must include at least one digit (0-9)")
    .matches(
      /(?=.*[!@#$%&*?-_])/,
      "Password must include at least one special character (!@#$%&*?-_)"
    )
    .required("Password is required"),
});

const Signup = () => {
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

          <SignupForm
            initialValues={initialValues}
            validationSchema={validationSchema}
          />
        </Stack>
      </Flex>
    </Stack>
  );
};

export default Signup;
