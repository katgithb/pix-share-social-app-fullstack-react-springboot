import { Box, Divider, Fade, Flex, ScaleFade, Text } from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import CustomizableModal from "../../shared/CustomizableModal";
import FileDropzone from "../../shared/FileDropzone";
import PostDraft from "./PostDraft/PostDraft";

const CreatePostModal = ({ isOpen, onClose }) => {
  const [files, setFiles] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [unacceptedFiles, setUnacceptedFiles] = useState([]);
  const userProfile = useSelector((store) => store.user.userProfile);

  const dropzoneAcceptedFileTypes = {
    "image/*": [],
  };
  const dropzoneMaxFiles = 1;
  const dropzoneMaxSizeInMB = 10;

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )
    );

    setUnacceptedFiles(rejectedFiles.map((rejectedFile) => rejectedFile));

    console.log("Accepted files: ", acceptedFiles);
    console.log("Rejected files: ", rejectedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: dropzoneAcceptedFileTypes,
      onDrop,
      maxFiles: dropzoneMaxFiles,
      maxSize: dropzoneMaxSizeInMB * 1024 * 1024, // maxSize in bytes
    });

  const handleModalClose = () => {
    setFiles([]);
    setSelectedLocation("");
    setUnacceptedFiles([]);
    onClose();
  };

  const isFileDropped = () => {
    return files.length !== 0;
  };

  return (
    <CustomizableModal
      isOpen={isOpen}
      onClose={handleModalClose}
      size={isFileDropped() ? "4xl" : "3xl"}
      header={<HeaderContent title="Create New Post" />}
      showModalCloseButton={true}
    >
      {!isFileDropped() ? (
        <Fade in>
          <FileDropzone
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            isDragReject={isDragReject}
            rejectedFiles={unacceptedFiles}
            maxFiles={dropzoneMaxFiles}
            maxSizeInMB={dropzoneMaxSizeInMB}
          />
        </Fade>
      ) : (
        <ScaleFade in initialScale={0.9}>
          <PostDraft
            currUser={userProfile.currUser}
            files={files}
            setFiles={setFiles}
            location={selectedLocation}
            setLocation={setSelectedLocation}
            handleModalClose={handleModalClose}
          />
        </ScaleFade>
      )}
    </CustomizableModal>
  );
};

const HeaderContent = ({ title }) => {
  return (
    <Box>
      <Flex justify="start" align="center">
        <Text fontSize="md">{title}</Text>
      </Flex>
      <Box mx={-6}>
        <Divider />
      </Box>
    </Box>
  );
};

export default CreatePostModal;
