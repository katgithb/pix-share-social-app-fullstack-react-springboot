import {
  Button,
  Checkbox,
  HStack,
  Image,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/pixshare_logo.png";
import altLogo from "../../../assets/images/pixshare_logo_gray.png";
import {
  checkAuthState,
  signinAction,
} from "../../../redux/actions/auth/authActions";
import CustomPasswordInput from "../../shared/customFormElements/CustomPasswordInput";
import CustomTextInput from "../../shared/customFormElements/CustomTextInput";

const SigninForm = ({ initialValues, validationSchema }) => {
  const formLogo = useColorModeValue(logo, altLogo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  // const token = localStorage.getItem("token");

  const handleFormSubmission = (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log("Form Values: ", values);
    dispatch(signinAction(values));
    setSubmitting(false);
  };

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmission}
      validateOnMount={true}
    >
      {({ isValid, isSubmitting }) => (
        <VStack
          as={Form}
          spacing={8}
          boxSize={{ base: "xs", sm: "sm", md: "md" }}
          h="max-content !important"
          bg={"white"}
          _dark={{ bg: "gray.700" }}
          rounded="lg"
          boxShadow="lg"
          p={{ base: 5, sm: 10 }}
        >
          <HStack my={-6} py={2} justify="center" w="full">
            <Image
              src={formLogo}
              alt="Logo"
              w={"auto"}
              h={{ base: 8, sm: 10 }}
            />
          </HStack>

          <VStack spacing={5} w="full">
            <VStack spacing={4} w="full">
              <CustomTextInput
                label={"Email"}
                id={"username"}
                name={"username"}
                type={"email"}
                placeholder={"johndoe@example.com"}
              />

              <CustomPasswordInput
                label={"Password"}
                id={"password"}
                name={"password"}
                placeholder={"Type your password"}
              />
            </VStack>
            <VStack w="full">
              <Stack direction="row" justify="space-between" w="full">
                <Checkbox colorScheme="blue" size="md">
                  Remember me
                </Checkbox>
                <Link
                  as={RouteLink}
                  fontSize={{ base: "md", sm: "md" }}
                  color={"blue.500"}
                  _dark={{ color: "blue.300" }}
                  style={{ textDecoration: "none" }}
                >
                  Forgot password?
                </Link>
              </Stack>
              <Button
                type={"submit"}
                isDisabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
                loadingText="Submitting"
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
                  color={"blue.500"}
                  _dark={{ color: "blue.300" }}
                >
                  Sign Up
                </Text>
              </Link>
            </Text>
          </HStack>
        </VStack>
      )}
    </Formik>
  );
};

export default SigninForm;
