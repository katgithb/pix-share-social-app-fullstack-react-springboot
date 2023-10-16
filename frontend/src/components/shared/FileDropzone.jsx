import {
  Button,
  Flex,
  Heading,
  Input,
  Icon,
  VStack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { TbPhotoPlus } from "react-icons/tb";

const FileDropzone = ({
  getRootProps,
  getInputProps,
  isDragActive,
  maxFiles,
  maxSizeInMB,
}) => {
  return (
    <Flex {...getRootProps()} h="60vh" justify="center" mt={-4}>
      <VStack align="center" justify="center" h="full">
        <Input
          {...getInputProps()}
          type="file"
          name="file-upload"
          id="file-upload"
        />
        <Icon
          as={TbPhotoPlus}
          fontSize="7xl"
          color={isDragActive ? "blue.500" : {}}
          transition="transform 0.3s ease-in-out"
          transform={isDragActive ? "scale(1.2)" : "scale(1)"}
        />
        <Heading pt={2} fontSize="2xl" fontWeight="light" textAlign="center">
          Drag and drop, or click to select files
        </Heading>
        <Text fontSize="sm" colorScheme="gray" opacity="0.6" textAlign="center">
          Images up to {maxSizeInMB} MB (max{" "}
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
          Select files
        </Button>
      </VStack>
    </Flex>
  );
};

export default FileDropzone;
