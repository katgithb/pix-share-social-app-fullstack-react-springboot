import {
  Box,
  Button,
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
  signupAction,
} from "../../../redux/actions/auth/authActions";
import CustomPasswordInput from "../../shared/customFormElements/CustomPasswordInput";
import CustomSelect from "../../shared/customFormElements/CustomSelect";
import CustomTextInput from "../../shared/customFormElements/CustomTextInput";

const SignupForm = ({ initialValues, validationSchema }) => {
  const formLogo = useColorModeValue(logo, altLogo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.auth);
  // const token = localStorage.getItem("token");

  const handleFormSubmission = (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log("Form Values: ", values);
    const newUser = {
      name: `${values.firstName} ${values.lastName}`,
      username: values.username,
      gender: values.gender,
      email: values.email,
      password: values.password,
    };
    dispatch(signupAction(newUser));
    setSubmitting(false);
  };

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  useEffect(() => {
    console.log(auth.signup?.username);
    if (auth.signup?.username) {
      navigate("/login");
    }
    if (auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isAuthenticated, auth.signup, navigate]);

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
              <Stack
                w="full"
                spacing={3}
                direction={{ base: "column", md: "row" }}
              >
                <Box>
                  <CustomTextInput
                    isRequired
                    label={"First Name"}
                    id={"firstName"}
                    name={"firstName"}
                    type={"text"}
                    placeholder={"John"}
                  />
                </Box>
                <Box>
                  <CustomTextInput
                    label={"Last Name"}
                    id={"lastName"}
                    name={"lastName"}
                    type={"text"}
                    placeholder={"Doe"}
                  />
                </Box>
              </Stack>

              <Stack
                w="full"
                spacing={3}
                direction={{ base: "column", md: "row" }}
              >
                <Box flex={1}>
                  <CustomTextInput
                    isRequired
                    label={"Username"}
                    id={"username"}
                    name={"username"}
                    type={"text"}
                    placeholder={"johndoe"}
                  />
                </Box>
                <Box flex={1}>
                  <CustomSelect
                    isRequired
                    label="Gender"
                    id="gender"
                    name="gender"
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </CustomSelect>
                </Box>
              </Stack>

              <CustomTextInput
                isRequired
                label={"Email"}
                id={"email"}
                name={"email"}
                type={"email"}
                placeholder={"johndoe@example.com"}
              />

              <CustomPasswordInput
                isRequired
                label={"Password"}
                id={"password"}
                name={"password"}
                placeholder={"Type your password"}
              />
            </VStack>
            <VStack w="full">
              <Button
                type={"submit"}
                isDisabled={!isValid || isSubmitting}
                isLoading={auth.isLoading}
                loadingText="Signing Up..."
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
                  color={"blue.500"}
                  _dark={{ color: "blue.300" }}
                >
                  Sign In
                </Text>
              </Link>
            </Text>
          </HStack>
        </VStack>
      )}
    </Formik>
  );
};

export default SignupForm;
