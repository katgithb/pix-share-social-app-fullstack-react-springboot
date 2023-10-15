import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { GiCancel } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { deleteUserProfileAction } from "../../../redux/actions/user/userProfileActions";
import CustomPasswordInput from "../../shared/customFormElements/CustomPasswordInput";

const AccountDeletionDialog = ({ isOpen, onClose, cancelRef }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector((store) => store.user.userProfile);
  const token = localStorage.getItem("token");

  const initialValues = {
    currPassword: "",
  };

  const validationSchema = Yup.object().shape({
    currPassword: Yup.string().required("Current Password is required"),
  });

  const handleFormSubmission = (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log("Form Values: ", values);
    if (token) {
      const data = {
        token,
        passwordData: {
          currPassword: values.currPassword,
        },
      };
      dispatch(deleteUserProfileAction(data));
    }
    setSubmitting(false);
  };

  return (
    <AlertDialog
      isCentered
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      motionPreset="slideInBottom"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Account
          </AlertDialogHeader>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleFormSubmission}
            validateOnMount={true}
          >
            {({ isValid, isSubmitting }) => (
              <Box as={Form}>
                <AlertDialogBody>
                  <Stack direction={"column"} spacing={4} w="full">
                    <Text>
                      Are you sure you want to delete this account? Before
                      proceeding, please be sure to review the effects below.
                    </Text>

                    <Stack
                      direction={"column"}
                      p={3}
                      bg={"gray.100"}
                      _dark={{ bg: "gray.600" }}
                      rounded="md"
                    >
                      <Text fontWeight="semibold">
                        Deleting account will do the following:
                      </Text>
                      <List fontSize="sm" spacing={1}>
                        <ListItem>
                          <ListIcon
                            as={GiCancel}
                            fontSize="md"
                            color="red.400"
                          />
                          Log you out.
                        </ListItem>
                        <ListItem>
                          <ListIcon
                            as={GiCancel}
                            fontSize="md"
                            color="red.400"
                          />
                          Delete your account permanently.
                        </ListItem>
                        <ListItem>
                          <ListIcon
                            as={GiCancel}
                            fontSize="md"
                            color="red.400"
                          />
                          Once your account is deleted, all connections, posts
                          and comments, as well as associated data will be
                          removed forever.
                        </ListItem>
                      </List>
                    </Stack>

                    <VStack flex={1} spacing={1} fontSize="sm">
                      <Text>
                        This action <b>cannot be undone.</b> All your account
                        data will be permanently lost.
                      </Text>

                      <Text>
                        Deleting your account requires your current password as
                        confirmation.
                      </Text>
                    </VStack>

                    <Stack spacing={4} flex={1} w={"full"}>
                      <VStack spacing={4} w="full">
                        <CustomPasswordInput
                          isRequired
                          label={"Current Password"}
                          id={"currPassword"}
                          name={"currPassword"}
                          placeholder={"Type password to continue"}
                        />
                      </VStack>
                    </Stack>
                  </Stack>
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type={"submit"}
                    isDisabled={!isValid || isSubmitting}
                    isLoading={userProfile.isLoading}
                    loadingText="Deleting account..."
                    colorScheme="red"
                    ml={3}
                  >
                    Yes, Delete account
                  </Button>
                </AlertDialogFooter>
              </Box>
            )}
          </Formik>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AccountDeletionDialog;
