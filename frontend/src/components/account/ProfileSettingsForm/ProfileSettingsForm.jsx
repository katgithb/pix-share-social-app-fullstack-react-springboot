import { CheckIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  Fade,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  ScaleFade,
  Stack,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  Text,
  useDisclosure,
  useSteps,
  VStack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BiCrop } from "react-icons/bi";
import { BsCheckCircleFill } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  editUserImageAction,
  editUserProfileAction,
  fetchUserProfileAction,
} from "../../../redux/actions/user/userProfileActions";
import CustomTextareaInput from "../../shared/customFormElements/CustomTextareaInput";
import CustomTextInput from "../../shared/customFormElements/CustomTextInput";
import CropUserAvatarModal from "./CropUserAvatarModal";
import UserAvatarDeleteDialog from "./UserAvatarDeleteDialog";
import UserAvatarDropzone from "./UserAvatarDropzone";

const ProfileSettingsForm = ({ currUser }) => {
  const initialValues = {
    name: currUser?.name || "",
    username: currUser?.username || "",
    website: currUser?.website || "",
    bio: currUser?.bio || "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Must be at least 3 characters")
      .max(128, "Must be at most 128 characters")
      .required("Name is required"),
    username: Yup.string()
      .min(5, "Must be at least 5 characters")
      .max(50, "Must be at most 50 characters")
      .required("Username is required"),
    website: Yup.string().matches(
      /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/,
      "The website URL you provided is not valid. It should be in the format 'example.com' or 'www.example.com' or 'https://example.com'."
    ),
  });

  const {
    isOpen: isOpenCropAvatarModal,
    onOpen: onOpenCropAvatarModal,
    onClose: onCloseCropAvatarModal,
  } = useDisclosure();
  const {
    isOpen: isOpenUserAvatarDeleteDialog,
    onOpen: onOpenUserAvatarDeleteDialog,
    onClose: onCloseUserAvatarDeleteDialog,
  } = useDisclosure();
  const userAvatarDeleteDialogCancelRef = useRef();

  const [files, setFiles] = useState([]);
  const [processedImageSrc, setProcessedImageSrc] = useState(null);
  const [processedImageFile, setProcessedImageFile] = useState(null);
  const [isAvatarUpdated, setIsAvatarUpdated] = useState(false);

  const dispatch = useDispatch();
  // const upload = useSelector((store) => store.upload);
  const userProfile = useSelector((store) => store.user.userProfile);
  const token = localStorage.getItem("token");

  // const handleImageUpload = () => {
  //   if (token && processedImageSrc) {
  //     const uploadType = UploadType.AVATAR;
  //     const data = {
  //       token,
  //       image: processedImageSrc,
  //       signatureData: { uploadType },
  //     };
  //     dispatch(cloudinaryImageUploadAction(data));

  //     console.log(
  //       "Processed Image Src and Upload signature: ",
  //       processedImageSrc,
  //       upload.uploadSignature
  //     );
  //     console.log("Media upload id:", upload.mediaUploadId);
  //   }
  // };

  // const handleUserAvatarUpdate = (uploadedImageId, uploadedImageUrl) => {
  //   if (token && uploadedImageId && uploadedImageUrl) {
  //     const data = {
  //       token,
  //       user: {
  //         userImageUploadId: uploadedImageId,
  //         userImage: uploadedImageUrl,
  //       },
  //     };

  //     dispatch(editUserProfileAction(data))
  //       .then(() => {
  //         setIsAvatarUpdated(true);
  //         dispatch(fetchUserProfileAction({ token }));
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // };

  // const handleUserAvatarDelete = useCallback(() => {
  //   if (token) {
  //     const data = {
  //       token,
  //       user: {
  //         userImageUploadId: "",
  //         userImage: "",
  //       },
  //     };

  //     dispatch(editUserProfileAction(data))
  //       .then(() => {
  //         dispatch(fetchUserProfileAction({ token }));
  //         dispatch(clearUpload());
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // }, [dispatch, token]);

  const handleUserAvatarUpdate = () => {
    if (token && processedImageFile) {
      const data = {
        token,
        image: processedImageFile,
      };

      dispatch(editUserImageAction(data))
        .then(() => {
          // setIsAvatarUpdated(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleFormSubmission = (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log("Form Values: ", values);
    if (token) {
      const data = {
        token,
        user: {
          name: values.name,
          username:
            currUser?.username !== values.username ? values.username : null,
          website: values.website,
          bio: values.bio,
        },
      };
      dispatch(editUserProfileAction(data));
    }
    setSubmitting(false);
  };

  const dropzoneAcceptedFileTypes = {
    "image/*": [],
  };
  const dropzoneMaxFiles = 1;
  const dropzoneMaxSizeInMB = 10.1;

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )
    );
    setProcessedImageSrc(null);
    setProcessedImageFile(null);

    console.log("Accepted files: ", acceptedFiles);
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept: dropzoneAcceptedFileTypes,
    onDrop,
    maxFiles: dropzoneMaxFiles,
    maxSize: dropzoneMaxSizeInMB * 1024 * 1024, // maxSize in bytes
  });

  const isFileDropped = () => {
    return files.length !== 0;
  };

  const changeAvatarSteps = [
    {
      stepText: "Step 1",
      title: "Crop Photo",
      description: "Adjust and crop your photo to your liking",
      actionText: "Crop",
      actionIcon: <BiCrop />,
      actionHandler: onOpenCropAvatarModal,
      backHandler: () => {
        setFiles([]);
        setProcessedImageSrc(null);
        setProcessedImageFile(null);
      },
    },
    {
      stepText: "Step 2",
      title: "Upload Photo",
      description: "Upload cropped image to set new profile photo",
      actionText: "Upload",
      actionIcon: <FiUpload />,
      actionHandler: () => {
        // handleImageUpload();
        handleUserAvatarUpdate();
      },
      backHandler: () => {
        setProcessedImageSrc(null);
        setProcessedImageFile(null);
        setActiveStep((prevStep) => prevStep - 1);
      },
    },
  ];

  const avatarUpdatedStepData = {
    title: "Avatar Updated!",
    description: "Updated your profile photo. It's looking great!",
    actionText: "Change",
    actionHandler: () => {
      setFiles([]);
      setProcessedImageSrc(null);
      setProcessedImageFile(null);
      setActiveStep(0);
      // dispatch(clearUpload());
      setIsAvatarUpdated(false);
    },
    backHandler: () => {
      setProcessedImageSrc(null);
      setProcessedImageFile(null);
      setActiveStep(0);
      // dispatch(clearUpload());
      setIsAvatarUpdated(false);
    },
  };

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: changeAvatarSteps.length,
  });

  const activeStepData = changeAvatarSteps[activeStep];

  useEffect(() => {
    if (processedImageSrc && activeStep === 0) {
      setActiveStep(1);
    }
  }, [processedImageSrc, activeStep, setActiveStep]);

  // useEffect(() => {
  //   if (!isAvatarUpdated && upload.isMediaUploaded) {
  //     if (upload.mediaUploadId && upload.mediaSecureUrl) {
  //       handleUserAvatarUpdate(upload.mediaUploadId, upload.mediaSecureUrl);
  //     }
  //   }
  // }, [
  //   isAvatarUpdated,
  //   upload.isMediaUploaded,
  //   upload.mediaSecureUrl,
  //   upload.mediaUploadId,
  // ]);

  // useEffect(() => {
  //   if (upload.isMediaDestroyed) {
  //     handleUserAvatarDelete();
  //   }
  // }, [handleUserAvatarDelete, upload.isMediaDestroyed]);

  useEffect(() => {
    if (
      token &&
      (userProfile.isUserProfileUpdated ||
        userProfile.isUserImageUpdated ||
        userProfile.isUserImageRemoved)
    ) {
      setIsAvatarUpdated(userProfile.isUserImageUpdated);
      dispatch(fetchUserProfileAction({ token }));
    }
  }, [
    dispatch,
    token,
    userProfile.isUserImageRemoved,
    userProfile.isUserImageUpdated,
    userProfile.isUserProfileUpdated,
  ]);

  return (
    <>
      <CropUserAvatarModal
        isOpen={isOpenCropAvatarModal}
        onClose={onCloseCropAvatarModal}
        imageFile={files[0]}
        setProcessedImageSrc={setProcessedImageSrc}
        setProcessedImageFile={setProcessedImageFile}
      />
      <UserAvatarDeleteDialog
        isOpen={isOpenUserAvatarDeleteDialog}
        onClose={onCloseUserAvatarDeleteDialog}
        cancelRef={userAvatarDeleteDialogCancelRef}
        currUser={currUser}
      />

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
            // mx={{ base: 0, md: 6 }}
            justify={"space-between"}
          >
            <VStack spacing={4} w="full">
              <FormControl id="userAvatar">
                <FormLabel>User Avatar</FormLabel>
                <Stack
                  direction={{ base: "column", sm: "row", md: "row" }}
                  spacing={6}
                >
                  <Center>
                    <Box
                      borderWidth={
                        processedImageSrc || files[0]?.preview ? 2 : 0
                      }
                      borderColor={isAvatarUpdated ? "green.400" : "gray.400"}
                      p={processedImageSrc || files[0]?.preview ? 0.5 : 0}
                      rounded="full"
                    >
                      <Avatar
                        size="xl"
                        name={currUser?.name}
                        src={
                          processedImageSrc ||
                          files[0]?.preview ||
                          currUser?.userImage
                        }
                        bg={"gray.400"}
                        _dark={{ bg: "gray.500" }}
                        loading="lazy"
                        position="relative"
                      >
                        {currUser?.userImage &&
                          !(processedImageSrc || files[0]?.preview) && (
                            <AvatarBadge
                              as={IconButton}
                              size="sm"
                              rounded="full"
                              top="-10px"
                              colorScheme="red"
                              aria-label="Remove Profile Photo"
                              icon={<SmallCloseIcon />}
                              onClick={onOpenUserAvatarDeleteDialog}
                            />
                          )}
                        {isAvatarUpdated && (
                          <AvatarBadge
                            as={IconButton}
                            size="sm"
                            rounded="full"
                            top="-10px"
                            colorScheme="green"
                            icon={<CheckIcon />}
                            onClick={avatarUpdatedStepData.actionHandler}
                          />
                        )}
                      </Avatar>
                    </Box>
                  </Center>
                  <Center w="full" overflow={"hidden"}>
                    {!isFileDropped() ? (
                      <UserAvatarDropzone
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        isDragActive={isDragActive}
                        isDragReject={isDragReject}
                        fileRejections={fileRejections}
                        maxFiles={dropzoneMaxFiles}
                        maxSizeInMB={dropzoneMaxSizeInMB}
                      />
                    ) : (
                      <Stack
                        px={2}
                        py={1}
                        gap={0}
                        flex={1}
                        borderWidth={2}
                        borderStyle="dashed"
                        rounded="md"
                        h="full"
                      >
                        {isAvatarUpdated ? (
                          <Fade in>
                            <VStack gap="0" textAlign="center" w="full">
                              <HStack mb={1} align="center">
                                <Box
                                  borderWidth={2}
                                  borderColor="green.400"
                                  p="0.5"
                                  rounded="full"
                                >
                                  <Icon
                                    as={BsCheckCircleFill}
                                    boxSize={9}
                                    color="green.400"
                                  />
                                </Box>
                              </HStack>

                              <Text fontWeight="semibold">
                                {avatarUpdatedStepData.title}
                              </Text>

                              <Text fontSize="sm">
                                {avatarUpdatedStepData.description}
                              </Text>

                              <Stack
                                mt={1}
                                spacing={2}
                                direction={{
                                  base: "column",
                                  sm: "row",
                                  md: "row",
                                }}
                                w="full"
                              >
                                <Button
                                  size="xs"
                                  fontSize="sm"
                                  bg={"red.400"}
                                  color={"white"}
                                  w="full"
                                  _hover={{
                                    bg: "red.500",
                                  }}
                                  onClick={avatarUpdatedStepData.backHandler}
                                >
                                  Back
                                </Button>
                                <Button
                                  size="xs"
                                  fontSize="sm"
                                  bg={"blue.400"}
                                  color={"white"}
                                  w="full"
                                  _hover={{
                                    bg: "blue.500",
                                  }}
                                  onClick={avatarUpdatedStepData.actionHandler}
                                >
                                  {avatarUpdatedStepData.actionText}
                                </Button>
                              </Stack>
                            </VStack>
                          </Fade>
                        ) : (
                          <ScaleFade in>
                            <Stepper index={activeStep} mb={1}>
                              {changeAvatarSteps.map((step, index) => (
                                <Step key={index}>
                                  <StepIndicator>
                                    <StepStatus
                                      complete={<StepIcon />}
                                      incomplete={<StepNumber />}
                                      active={activeStepData.actionIcon}
                                    />
                                  </StepIndicator>

                                  <StepSeparator />
                                </Step>
                              ))}
                            </Stepper>
                            <VStack gap="0" textAlign="center" w="full">
                              <Text fontSize="sm">
                                <b>{activeStepData.stepText}:</b>{" "}
                                {activeStepData.title}
                              </Text>

                              <Text fontSize="sm">
                                {activeStepData.description}
                              </Text>

                              <Stack
                                mt={1}
                                spacing={2}
                                direction={{
                                  base: "column",
                                  sm: "row",
                                  md: "row",
                                }}
                                w="full"
                              >
                                <Button
                                  size="xs"
                                  fontSize="sm"
                                  isDisabled={
                                    userProfile.isUpdatingUserImage ||
                                    userProfile.isLoading
                                  }
                                  bg={"red.400"}
                                  color={"white"}
                                  w="full"
                                  _hover={{
                                    bg: "red.500",
                                  }}
                                  onClick={activeStepData.backHandler}
                                >
                                  Back
                                </Button>
                                <Button
                                  size="xs"
                                  fontSize="sm"
                                  isDisabled={
                                    userProfile.isUpdatingUserImage ||
                                    userProfile.isLoading
                                  }
                                  isLoading={userProfile.isUpdatingUserImage}
                                  bg={"blue.400"}
                                  color={"white"}
                                  w="full"
                                  _hover={{
                                    bg: "blue.500",
                                  }}
                                  onClick={activeStepData.actionHandler}
                                >
                                  {activeStepData.actionText}
                                </Button>
                              </Stack>
                            </VStack>
                          </ScaleFade>
                        )}
                      </Stack>
                    )}
                  </Center>
                </Stack>
              </FormControl>

              <CustomTextInput
                isRequired
                label={"Name"}
                id={"name"}
                name={"name"}
                type={"text"}
                placeholder={"Name"}
              />

              <CustomTextInput
                isRequired
                label={"Username"}
                id={"username"}
                name={"username"}
                type={"text"}
                placeholder={"Username"}
              />

              <CustomTextInput
                label={"Website"}
                id={"website"}
                name={"website"}
                type={"text"}
                placeholder={"www.example.com"}
              />

              <CustomTextareaInput
                label={"Bio"}
                id={"bio"}
                name={"bio"}
                placeholder={"Write a brief description about yourself"}
              />
            </VStack>

            <Stack
              spacing={6}
              direction={{ base: "column", sm: "row", md: "row" }}
            >
              <Button
                isDisabled={userProfile.isUpdatingUserProfile}
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
                isLoading={userProfile.isUpdatingUserProfile}
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
    </>
  );
};

export default ProfileSettingsForm;
