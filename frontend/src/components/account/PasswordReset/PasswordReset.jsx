import {
  Flex,
  Heading,
  Image,
  Stack,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import signinBg from "../../../assets/images/pixshare_signin_signup_bg.png";
import {
  clearFailureMessage,
  clearSuccessMessage,
} from "../../../redux/reducers/user/userPasswordResetSlice";
import CustomizableAlert from "../../shared/alerts/CustomizableAlert";
import PasswordResetForm from "./PasswordResetForm";

const initialValues = {
  newPassword: "",
  confirmPassword: "",
};

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .matches(
      /^[A-Za-z\d!@#$%&*\-_=./]+$/,
      "Password can only include alphabets, digits, and the specified special characters (!@#$%&*-_=./)"
    )
    .min(8, "Must be at least 8 characters")
    .max(128, "Must be at most 128 characters")
    .matches(
      /(?=.*[a-zA-Z])/,
      "Password must include at least one alphabet (a-z A-Z)"
    )
    .matches(/(?=.*\d)/, "Password must include at least one digit (0-9)")
    .matches(
      /(?=.*[!@#$%&*\-_=./])/,
      "Password must include at least one special character (!@#$%&*-_=./)"
    )
    .required("New Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const PasswordReset = () => {
  const {
    isOpen: isOpenSuccessAlert,
    onOpen: onOpenSuccessAlert,
    onClose: onCloseSuccessAlert,
  } = useDisclosure();
  const {
    isOpen: isOpenFailureAlert,
    onOpen: onOpenFailureAlert,
    onClose: onCloseFailureAlert,
  } = useDisclosure();

  const dispatch = useDispatch();
  const { successMessage, failureMessage } = useSelector(
    (store) => store.user.userPasswordReset
  );

  const statusMsgKeys = ["title", "description"];
  const showSuccessAlert =
    successMessage &&
    !_.isEmpty(successMessage) &&
    statusMsgKeys.every((key) => key in successMessage);
  const showFailureAlert =
    failureMessage &&
    !_.isEmpty(failureMessage) &&
    statusMsgKeys.every((key) => key in failureMessage);

  const handleSuccessAlertClose = () => {
    dispatch(clearSuccessMessage());
    onCloseSuccessAlert();
  };

  const handleFailureAlertClose = () => {
    dispatch(clearFailureMessage());
    onCloseFailureAlert();
  };

  useEffect(() => {
    if (showSuccessAlert) {
      onOpenSuccessAlert();
    }
    if (showFailureAlert) {
      onOpenFailureAlert();
    }
  }, [
    onOpenFailureAlert,
    onOpenSuccessAlert,
    showFailureAlert,
    showSuccessAlert,
  ]);

  return (
    <>
      {showSuccessAlert && (
        <CustomizableAlert
          isOpen={isOpenSuccessAlert}
          onClose={handleSuccessAlertClose}
          alertStatus="success"
          alertTitle={successMessage.title}
          alertDescription={successMessage.description}
        />
      )}
      {showFailureAlert && (
        <CustomizableAlert
          isOpen={isOpenFailureAlert}
          onClose={handleFailureAlertClose}
          alertStatus="error"
          alertTitle={failureMessage.title}
          alertDescription={failureMessage.description}
        />
      )}

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
              <Heading fontSize="2xl">Reset your password</Heading>
            </Stack>

            <PasswordResetForm
              initialValues={initialValues}
              validationSchema={validationSchema}
            />
          </Stack>
        </Flex>
      </Stack>
    </>
  );
};

export default PasswordReset;
