import {
  Avatar,
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import AccountDeletionDialog from "./AccountDeletionDialog";

const AccountDeletionForm = ({ currUser }) => {
  const {
    isOpen: isOpenAccountDeletionDialog,
    onOpen: onOpenAccountDeletionDialog,
    onClose: onCloseAccountDeletionDialog,
  } = useDisclosure();
  const accountDeletionDialogCancelRef = useRef();
  const [isDeletionConfirmed, setIsDeletionConfirmed] = useState(false);

  const handleConfirmationCheckboxChange = (event) => {
    setIsDeletionConfirmed(event.target.checked);
  };

  const handleKeepAccountClick = () => {
    setIsDeletionConfirmed(false);
  };

  console.log("isDeletionConfirmed: ", isDeletionConfirmed);

  const initialValues = {
    currPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
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
      .required("Password is required"),
  });

  const handleFormSubmission = (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log("Form Values: ", values);
    setSubmitting(false);
  };

  return (
    <>
      <AccountDeletionDialog
        isOpen={isOpenAccountDeletionDialog}
        onClose={onCloseAccountDeletionDialog}
        cancelRef={accountDeletionDialogCancelRef}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmission}
        validateOnMount={true}
      >
        {({ isValid, isSubmitting }) => (
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
            // mx={{ base: 0, md: 6 }}
            justify={"space-between"}
          >
            <VStack spacing={4} w="full">
              <FormControl id="userAccountDeletion">
                <FormLabel>Account Deletion</FormLabel>

                <Stack
                  direction={{ base: "column", sm: "column", md: "column" }}
                  spacing={4}
                  p={3}
                  bg={"gray.100"}
                  _dark={{ bg: "gray.600" }}
                  rounded="md"
                  boxShadow={"md"}
                >
                  <Center>
                    <Avatar
                      size="xl"
                      name={currUser?.name}
                      src={currUser?.userImage}
                      loading="lazy"
                    ></Avatar>
                  </Center>
                  <VStack spacing={1} w="full">
                    <Text
                      fontSize={"sm"}
                      fontWeight="semibold"
                      color="gray.500"
                      _dark={{ color: "gray.400" }}
                      textAlign="center"
                      noOfLines={2}
                      wordBreak={"break-all"}
                    >
                      {currUser?.username}
                    </Text>

                    <Heading
                      size="sm"
                      textAlign="center"
                      noOfLines={2}
                      wordBreak="break-word"
                    >
                      {currUser?.name}
                    </Heading>

                    <Text
                      fontSize={"sm"}
                      fontWeight="semibold"
                      color="blue.500"
                      _dark={{ color: "blue.300" }}
                      letterSpacing="wide"
                      textAlign="center"
                      noOfLines={2}
                      wordBreak={"break-all"}
                    >
                      {currUser?.email}
                    </Text>
                  </VStack>
                </Stack>

                <Stack mt={4} spacing={4}>
                  <Flex alignItems="start">
                    <Flex alignItems="center" h={5}>
                      <Checkbox
                        isChecked={isDeletionConfirmed}
                        colorScheme="blue"
                        size="md"
                        onChange={handleConfirmationCheckboxChange}
                      />
                    </Flex>
                    <Box ml={3} fontSize="sm">
                      <Text
                        htmlFor="comments"
                        fontWeight="md"
                        color="gray.700"
                        _dark={{ color: "gray.50" }}
                      >
                        Permanently delete this account
                      </Text>
                      <Text color="gray.500" _dark={{ color: "gray.400" }}>
                        This account will no longer be available, and all data
                        in the account will be permanently deleted.
                      </Text>
                    </Box>
                  </Flex>
                </Stack>
              </FormControl>
            </VStack>

            <Stack
              spacing={6}
              direction={{ base: "column", sm: "row", md: "row" }}
            >
              <Button
                isDisabled={!isDeletionConfirmed}
                bg={"red.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "red.500",
                }}
                onClick={onOpenAccountDeletionDialog}
              >
                Delete account
              </Button>
              <Button
                bg={"gray.400"}
                color={"white"}
                w="full"
                _hover={{
                  bg: "gray.500",
                }}
                onClick={handleKeepAccountClick}
              >
                Keep account
              </Button>
            </Stack>
          </Stack>
        )}
      </Formik>
    </>
  );
};

export default AccountDeletionForm;
