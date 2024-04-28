import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouteLink } from "react-router-dom";
import * as Yup from "yup";
import { createPostAction } from "../../../../redux/actions/post/postManagementActions";
import { clearPostManagement } from "../../../../redux/reducers/post/postManagementSlice";
import { getAuthToken } from "../../../../utils/authUtils";
import {
  compressAndResizeImage,
  getImageDimensionsFromImageFile,
} from "../../../../utils/imageUtils";
import CustomTextareaInput from "../../../shared/customFormElements/CustomTextareaInput";
import CustomAsyncPaginateSelect from "./CustomAsyncPaginateSelect";

const PostDraft = ({
  currUser,
  files,
  setFiles,
  location,
  setLocation,
  handleModalClose,
}) => {
  const CAPTION_MAX_CHARS = 500;
  const initialValues = {
    caption: "",
    location: "",
  };

  const validationSchema = Yup.object().shape({
    caption: Yup.string().max(
      CAPTION_MAX_CHARS,
      `Must be at most ${CAPTION_MAX_CHARS} characters`
    ),
  });

  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const dispatch = useDispatch();
  const postManagement = useSelector((store) => store.post.postManagement);
  const token = getAuthToken();

  const handleCreatePost = async (caption, location) => {
    const processedImageFile = await compressAndResizeSelectedImage();
    console.log("processed ImageFile: ", processedImageFile);

    if (token && processedImageFile) {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", processedImageFile);
      formData.append("location", location);

      const data = {
        token,
        post: formData,
      };

      dispatch(createPostAction(data));
    }
  };

  const handleFormSubmission = (values, { setSubmitting }) => {
    setSubmitting(true);
    console.log("Form Values: ", values);

    handleCreatePost(values.caption, values.location);

    setSubmitting(false);
  };

  const compressAndResizeSelectedImage = useCallback(async () => {
    try {
      setIsProcessingImage(true);
      const MAX_WIDTH = 1280;
      const MAX_HEIGHT = 850;
      const imageFile = files[0];
      const imageDimensions = await getImageDimensionsFromImageFile(imageFile);

      const maxWidth =
        imageDimensions.height >= imageDimensions.width
          ? MAX_HEIGHT
          : MAX_WIDTH;
      const maxHeight =
        imageDimensions.height >= imageDimensions.width
          ? MAX_HEIGHT
          : MAX_WIDTH;
      console.log("Max Image width:", maxWidth, "Max Image height:", maxHeight);

      const processedImage = await compressAndResizeImage(
        imageFile,
        maxWidth,
        maxHeight
      );
      console.log("Processed ImageDataUrl: ", processedImage.imageDataUrl);

      setIsProcessingImage(false);
      return processedImage.imageFile;
    } catch (error) {
      setIsProcessingImage(false);
      console.log(error);
      return null;
    }
  }, [files]);

  const clearSelectedImageAndLocation = () => {
    setFiles([]);
    setLocation("");
  };

  useEffect(() => {
    if (token && postManagement.isPostCreated) {
      dispatch(clearPostManagement());
      handleModalClose();
    }
  }, [dispatch, handleModalClose, postManagement.isPostCreated, token]);

  return (
    <Flex
      h="85vh"
      flexDir={{ base: "column", md: "inherit" }}
      justify="center"
      mt={-4}
      gap={2}
    >
      <Flex flex={3} overflow="hidden" mb={{ base: "3", md: "inherit" }}>
        <Flex justify="center" align="center" flex={1} h="full">
          <Image
            src={files[0]?.preview}
            key={files[0]?.name}
            maxH="full"
            objectFit="contain"
            alt="Post Image Preview"
            rounded="lg"
          />
        </Flex>
      </Flex>

      <Box my={-2}>
        <Divider orientation="vertical" />
      </Box>

      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmission}
        validateOnMount={true}
      >
        {({ isValid, isSubmitting, resetForm, setFieldValue }) => (
          <Flex as={Form} flexDir="column" flex={1}>
            <Box boxShadow="md" rounded="lg">
              <Flex align="center" gap={1.5} px={2} py={1} flexWrap="wrap">
                <Link
                  as={RouteLink}
                  to={`/profile/${currUser?.username}`}
                  p="1"
                  rounded="full"
                  bgGradient={"linear(to-tr, blackAlpha.500, blackAlpha.300)"}
                  _dark={{
                    bgGradient: "linear(to-tr, whiteAlpha.600, whiteAlpha.800)",
                  }}
                  onClick={handleModalClose}
                >
                  <Avatar
                    size="sm"
                    name={currUser?.name}
                    src={currUser?.userImage}
                    alt="User Avatar"
                    loading="lazy"
                  />
                </Link>
                <Box justifyContent={"start"} wordBreak="break-word">
                  <Link
                    as={RouteLink}
                    to={`/profile/${currUser?.username}`}
                    style={{ textDecoration: "none" }}
                    onClick={handleModalClose}
                  >
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      opacity="0.7"
                      colorScheme="gray"
                      wordBreak={"break-word"}
                      noOfLines={2}
                    >
                      {currUser?.username}
                    </Text>
                  </Link>
                </Box>
              </Flex>
              <Box px={2} mt={2}>
                <CustomTextareaInput
                  id={"caption"}
                  name={"caption"}
                  placeholder={"Write a caption..."}
                  py={1}
                  px={1}
                  w="full"
                  outline="none"
                  borderColor="transparent"
                  rows={6}
                  maxChars={CAPTION_MAX_CHARS}
                />
              </Box>
            </Box>

            <Divider />

            <Flex
              justify="center"
              align="center"
              // px={2}
              mt={3}
              boxShadow="md"
              rounded="lg"
            >
              <Box w="full" maxW={{ base: {}, md: "350px" }}>
                <Box w="full">
                  <CustomAsyncPaginateSelect
                    location={location}
                    setLocation={(selectedLocation) => {
                      // Update the value of the 'location' field in Formik
                      const selectedLocationValue = selectedLocation
                        ? selectedLocation?.value
                        : "";
                      setFieldValue("location", selectedLocationValue);
                      setLocation(selectedLocation);
                    }}
                  />
                  <Field name="location">
                    {({ field }) => (
                      <Input
                        id="location"
                        name="location"
                        type="hidden"
                        {...field}
                      />
                    )}
                  </Field>
                </Box>
              </Box>
            </Flex>

            <Divider />

            <Stack
              flex={1}
              mt={3}
              mb={1}
              align={{ base: "end", md: "center" }}
              justify={{ base: "center", md: "end" }}
              spacing={{ base: "4", md: "3" }}
              direction={{ base: "row", md: "column" }}
            >
              <Button
                isDisabled={isProcessingImage || postManagement.isCreatingPost}
                size="md"
                w="full"
                rounded="2xl"
                fontSize={"md"}
                bg={"red.400"}
                color={"white"}
                _hover={{
                  bg: "red.500",
                }}
                onClick={() => {
                  clearSelectedImageAndLocation();
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isDisabled={!isValid || isSubmitting}
                isLoading={isProcessingImage || postManagement.isCreatingPost}
                loadingText="Saving..."
                size="md"
                w="full"
                rounded="2xl"
                fontSize={"md"}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                Share
              </Button>
            </Stack>
          </Flex>
        )}
      </Formik>
    </Flex>
  );
};

export default PostDraft;
