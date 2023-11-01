import {
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TbPhotoExclamation, TbPhotoPlus } from "react-icons/tb";

const FileDropzone = ({
  getRootProps,
  getInputProps,
  isDragActive,
  isDragReject,
  rejectedFiles,
  maxFiles,
  maxSizeInMB,
}) => {
  const [isFilesRejected, setIsFilesRejected] = useState(false);

  useEffect(() => {
    if (isDragActive) {
      setIsFilesRejected(false);
    } else {
      if (rejectedFiles?.length > 0) {
        setIsFilesRejected(true);
      }
    }
  }, [rejectedFiles?.length, isDragActive]);

  return (
    <Flex
      {...getRootProps()}
      h="60vh"
      justify="center"
      mt={-4}
      borderWidth={2}
      borderStyle="dashed"
      rounded="md"
      borderColor={
        isDragReject || isFilesRejected
          ? "red.500"
          : isDragActive
          ? "blue.500"
          : ""
      }
      _dark={{
        borderColor:
          isDragReject || isFilesRejected
            ? "red.300"
            : isDragActive
            ? "blue.300"
            : "",
      }}
    >
      <VStack align="center" justify="center" h="full">
        <Input
          {...getInputProps()}
          type="file"
          name="file-upload"
          id="file-upload"
        />
        <Icon
          as={
            isDragReject || isFilesRejected ? TbPhotoExclamation : TbPhotoPlus
          }
          fontSize="7xl"
          color={
            isDragReject || isFilesRejected
              ? "red.500"
              : isDragActive
              ? "blue.500"
              : "gray.400"
          }
          _dark={{
            color:
              isDragReject || isFilesRejected
                ? "red.300"
                : isDragActive
                ? "blue.300"
                : "gray.500",
          }}
          transition="transform 0.3s ease-in-out"
          transform={isDragReject || isDragActive ? "scale(1.2)" : "scale(1)"}
        />
        <Heading
          pt={2}
          fontSize="2xl"
          fontWeight="light"
          textAlign="center"
          color="gray.800"
          _dark={{ color: "gray.50" }}
        >
          {isDragReject || isFilesRejected
            ? "Invalid file or size limit exceeded. Please choose another."
            : `Drag and drop, or click to select ${
                maxFiles > 1 ? "files" : "file"
              }`}
        </Heading>
        <Text fontSize="sm" colorScheme="gray" opacity="0.6" textAlign="center">
          {maxFiles > 1 ? "Images" : "Image"} up to {maxSizeInMB} MB (max{" "}
          {maxFiles > 1 ? `${maxFiles} files` : `${maxFiles} file`})
        </Text>
        <Button
          bg="blue.500"
          _hover={{ bg: "blue.600" }}
          color="white"
          size="sm"
          fontWeight="bold"
          py={2}
          px={4}
          rounded="lg"
          mt={2}
        >
          Select {maxFiles > 1 ? "files" : "file"}
        </Button>
      </VStack>
    </Flex>
  );
};

export default FileDropzone;
