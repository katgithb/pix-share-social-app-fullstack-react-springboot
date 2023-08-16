import {
  Avatar,
  Box,
  Button,
  Divider,
  Fade,
  Flex,
  Heading,
  Icon,
  Image,
  Input,
  Link,
  ScaleFade,
  Text,
  Textarea,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  useTheme,
  VStack,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaRegFaceSmile } from "react-icons/fa6";
import { TbPhotoPlus } from "react-icons/tb";
import { Link as RouteLink } from "react-router-dom";
import CustomizableModal from "../../shared/CustomizableModal";
import { Cities, Countries, States } from "countries-states-cities-service";
import { AsyncPaginate } from "react-select-async-paginate";
import unidecode from "unidecode";
import FileDropzone from "../../shared/FileDropzone";
import PostDraft from "./PostDraft/PostDraft";

const CreatePostModal = ({ isOpen, onClose }) => {
  const userIdList = [
    20, 72, 58, 29, 89, 17, 94, 69, 11, 23, 10, 90, 18, 81, 79,
  ];
  const id = Math.floor(Math.random() * userIdList.length);
  const gender = id % 2 === 0 ? "men" : "women";
  const userDetails = {
    dp: `https://randomuser.me/api/portraits/${gender}/${Math.round(id)}.jpg`,
    username: generateUsernameFromName(generateRandomName()),
  };

  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  // const [location, setLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const dropzoneAcceptedFileTypes = {
    "image/*": [],
  };
  const dropzoneMaxFiles = 1;
  const dropzoneMaxSizeInMB = 10;

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );

      console.log("Accepted files: ", files);
    },
    [files]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: dropzoneAcceptedFileTypes,
    onDrop,
    maxFiles: dropzoneMaxFiles,
    maxSize: dropzoneMaxSizeInMB * 1024 * 1024, // maxSize in bytes
  });

  function generateRandomName() {
    const names = [
      "John Doe",
      "Jane Smith",
      "Alex Johnson Hades Kate Wilber Robert",
      "Sarah Thompson",
    ];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  }

  function generateUsernameFromName(fullname) {
    const username = fullname.replace(/\s+/g, "_").toLowerCase();

    return username;
  }

  const handleModalClose = () => {
    setFiles([]);
    setCaption("");
    setSelectedLocation("");
    onClose();
  };

  const isFileDropped = () => {
    return files.length !== 0;
  };

  const handleCaptionInputChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 250) {
      setCaption(inputValue);
    }
  };

  // const handleLocationInputChange = (e) => {
  //   setLocation(e.target.value);
  // };

  console.log("selected item: ", selectedLocation);

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
            maxFiles={dropzoneMaxFiles}
            maxSizeInMB={dropzoneMaxSizeInMB}
          />
        </Fade>
      ) : (
        <ScaleFade in initialScale={0.9}>
          <PostDraft
            user={userDetails}
            files={files}
            caption={caption}
            location={selectedLocation}
            setLocation={setSelectedLocation}
            handleCaptionChange={handleCaptionInputChange}
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

// const FooterContent = () => {
//   return <div>This is the footer content</div>;
// };

export default CreatePostModal;
