import {
  Button,
  HStack,
  Image,
  Link,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import _ from "lodash";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import logo from "../../../assets/images/pixshare_logo.png";
import altLogo from "../../../assets/images/pixshare_logo_gray.png";
import { checkAuthState } from "../../../redux/actions/auth/authActions";
import { resetUserPasswordAction } from "../../../redux/actions/user/userPasswordResetActions";
import { fetchUserProfileAction } from "../../../redux/actions/user/userProfileActions";
import { clearUserPasswordReset } from "../../../redux/reducers/user/userPasswordResetSlice";
import { getAuthToken } from "../../../utils/authUtils";
import CustomPasswordInput from "../../shared/customFormElements/CustomPasswordInput";

const PasswordResetForm = ({ initialValues, validationSchema }) => {
  const formLogo = useColorModeValue(logo, altLogo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = getAuthToken();

  const { isAuthenticated, isLoading } = useSelector((store) => store.auth);
  const selectUserProfile = useSelector((store) => store.user.userProfile);
  const userProfile = useMemo(() => selectUserProfile, [selectUserProfile]);
  const {
    passwordResetToken,
    isValidatingPasswordResetToken,
    isResettingUserPassword,
    isUserPasswordReset,
  } = useSelector((store) => store.user.userPasswordReset);

  const handleFormSubmission = (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log("Form Values: ", values);

    if (!_.isEmpty(passwordResetToken) && passwordResetToken["token"]) {
      const data = {
        token: passwordResetToken["token"],
        newPassword: values.newPassword,
      };
      dispatch(resetUserPasswordAction(data));
    }

    setSubmitting(false);
  };

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && token) {
      dispatch(fetchUserProfileAction({ token }));
    }
  }, [dispatch, isAuthenticated, token]);

  useEffect(() => {
    if (isUserPasswordReset) {
      dispatch(clearUserPasswordReset());
      navigate("/login");
    }
    if (userProfile.currUser) {
      navigate("/");
    }
  }, [dispatch, isUserPasswordReset, navigate, userProfile.currUser]);

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
              <CustomPasswordInput
                isRequired
                label={"New Password"}
                id={"newPassword"}
                name={"newPassword"}
                placeholder={"New Password"}
              />

              <CustomPasswordInput
                isRequired
                label={"Confirm Password"}
                id={"confirmPassword"}
                name={"confirmPassword"}
                placeholder={"Confirm Password"}
              />
            </VStack>
            <VStack w="full">
              <Button
                type={"submit"}
                isDisabled={
                  !isValid ||
                  isSubmitting ||
                  !passwordResetToken ||
                  _.isEmpty(passwordResetToken)
                }
                isLoading={
                  isLoading ||
                  userProfile.isLoading ||
                  isValidatingPasswordResetToken ||
                  isResettingUserPassword
                }
                loadingText={isResettingUserPassword ? "Resetting..." : ""}
                bg="blue.400"
                color="white"
                _hover={{
                  bg: "blue.500",
                }}
                rounded="md"
                w="full"
              >
                Reset Password
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
              Don't want to reset? Return to
              <Link as={RouteLink} to="/login">
                <Text
                  as="span"
                  pl={1}
                  color={"blue.500"}
                  _dark={{ color: "blue.300" }}
                >
                  Login
                </Text>
              </Link>
            </Text>
          </HStack>
        </VStack>
      )}
    </Formik>
  );
};

export default PasswordResetForm;
