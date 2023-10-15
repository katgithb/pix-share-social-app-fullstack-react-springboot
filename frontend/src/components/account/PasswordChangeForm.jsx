import { Button, Stack, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { editUserPasswordAction } from "../../redux/actions/user/userProfileActions";
import CustomPasswordInput from "../shared/customFormElements/CustomPasswordInput";

const PasswordChangeForm = () => {
  const initialValues = {
    currPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    currPassword: Yup.string().required("Current Password is required"),
    newPassword: Yup.string()
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
      .required("New Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const dispatch = useDispatch();
  const userProfile = useSelector((store) => store.user.userProfile);
  const token = localStorage.getItem("token");

  const handleFormSubmission = (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log("Form Values: ", values);
    if (token) {
      const data = {
        token,
        passwordData: {
          currPassword: values.currPassword,
          newPassword: values.newPassword,
        },
      };
      dispatch(editUserPasswordAction(data));
    }
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
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
            <CustomPasswordInput
              isRequired
              label={"Current Password"}
              id={"currPassword"}
              name={"currPassword"}
              placeholder={"Current Password"}
            />

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

          <Stack
            spacing={6}
            direction={{ base: "column", sm: "row", md: "row" }}
          >
            <Button
              // type="reset"
              isDisabled={userProfile.isUpdatingUserPassword}
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
              isLoading={userProfile.isUpdatingUserPassword}
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

export default PasswordChangeForm;
