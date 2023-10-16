import { Button, Stack, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import parsePhoneNumberFromString, {
  isPossiblePhoneNumber,
} from "libphonenumber-js";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  editUserPersonalInfoAction,
  fetchUserProfileAction,
} from "../../redux/actions/user/userProfileActions";
import CustomSelect from "../shared/customFormElements/CustomSelect";
import CustomTextInput from "../shared/customFormElements/CustomTextInput";

const PersonalDetailsSettingsForm = ({ currUser }) => {
  const initialValues = {
    email: currUser?.email || "",
    mobile: currUser?.mobile || "",
    gender: currUser?.gender || "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    mobile: Yup.string()
      .max(15, "Must be at most 15 characters")
      .test(
        "mobile",
        "Please enter a valid international phone number starting with '+' sign and the country code, without spaces or special characters. For example, '+1 1234567890'.",
        (value) => {
          if (!value) return true; // Allow empty value
          return isPossiblePhoneNumber(value);
        }
      ),
    gender: Yup.string()
      .oneOf(["MALE", "FEMALE", "OTHER", "UNSPECIFIED"], "Invalid Gender")
      .required("Gender is required"),
  });

  const dispatch = useDispatch();
  const userProfile = useSelector((store) => store.user.userProfile);
  const token = localStorage.getItem("token");

  const handleFormSubmission = (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log("Form Values: ", values);
    if (token) {
      // Extract and format the phone number
      const phoneNumber = parsePhoneNumberFromString(values.mobile);
      const intlPhoneNumber = phoneNumber ? phoneNumber.number : null;

      const data = {
        token,
        user: {
          email: currUser?.email !== values.email ? values.email : null,
          mobile: values.mobile ? intlPhoneNumber : "",
          gender: values.gender,
        },
      };

      dispatch(editUserPersonalInfoAction(data));
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (token && userProfile.isUserPersonalInfoUpdated) {
      dispatch(fetchUserProfileAction({ token }));
    }
  }, [dispatch, token, userProfile.isUserPersonalInfoUpdated]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmission}
      validateOnMount={true}
    >
      {({ isValid, isSubmitting, resetForm }) => (
        <Stack
          as={Form}
          spacing={4}
          flex={1}
          w={"full"}
          maxW={"xl"}
          bg={"white"}
          _dark={{ bg: "gray.700" }}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          justify={"space-between"}
        >
          <VStack spacing={4} w="full">
            <CustomTextInput
              isRequired
              label={"Email"}
              id={"email"}
              name={"email"}
              type={"email"}
              placeholder={"your-email@example.com"}
            />

            <CustomTextInput
              label={"Phone number"}
              id={"mobile"}
              name={"mobile"}
              type={"tel"}
              placeholder={"Phone number"}
            />

            <CustomSelect isRequired label="Gender" id="gender" name="gender">
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
              <option value="UNSPECIFIED">Prefer not to say</option>
            </CustomSelect>
          </VStack>

          <Stack
            spacing={6}
            direction={{ base: "column", sm: "row", md: "row" }}
          >
            <Button
              isDisabled={userProfile.isUpdatingUserPersonalInfo}
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button
              type={"submit"}
              isDisabled={!isValid || isSubmitting}
              isLoading={userProfile.isUpdatingUserPersonalInfo}
              loadingText="Saving..."
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
            >
              Save changes
            </Button>
          </Stack>
        </Stack>
      )}
    </Formik>
  );
};

export default PersonalDetailsSettingsForm;
