import { Flex, Heading, Icon, Input, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { TbPhotoExclamation, TbPhotoPlus } from "react-icons/tb";

const UserAvatarDropzone = ({
  getRootProps,
  getInputProps,
  isDragActive,
  isDragReject,
  fileRejections,
  maxFiles,
  maxSizeInMB,
}) => {
  const [isFilesRejected, setIsFilesRejected] = useState(false);

  useEffect(() => {
    if (isDragActive) {
      setIsFilesRejected(false);
    } else {
      if (fileRejections?.length > 0) {
        setIsFilesRejected(true);
      }
    }
  }, [fileRejections?.length, isDragActive]);

  return (
    <Flex
      {...getRootProps()}
      justify="center"
      px={2}
      pt={1}
      pb={0.5}
      borderWidth={2}
      borderStyle="dashed"
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
      rounded="md"
      w="full"
    >
      <VStack spacing={1} align="center" justify="center" h="full">
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
          boxSize={10}
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
          pt={1}
          color="gray.800"
          _dark={{ color: "gray.50" }}
          fontSize="md"
          fontWeight="light"
          textAlign="center"
        >
          {isDragReject || isFilesRejected
            ? "Invalid file. Please choose another."
            : "Click to choose or Drag and drop"}
        </Heading>
        <Text fontSize="sm" colorScheme="gray" opacity="0.6" textAlign="center">
          Image up to {maxSizeInMB} MB allowed
        </Text>
      </VStack>
    </Flex>
  );
};

export default UserAvatarDropzone;
