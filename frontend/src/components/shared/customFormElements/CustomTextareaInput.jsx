import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";
import { FaRegFaceSmile } from "react-icons/fa6";

const CustomTextareaInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const maxChars = props.maxChars ? props.maxChars : Number.MAX_SAFE_INTEGER;

  const handleCaptionChange = (e, field) => {
    // Limit the caption to maxChars
    if (e.target.value.length <= maxChars) {
      field.onChange(e); // Update the Formik field value
    }
  };

  return (
    <FormControl
      id={props.id}
      isRequired={props.isRequired ? props.isRequired : false}
      isInvalid={meta.error && meta.touched}
    >
      {label && <FormLabel htmlFor={props.id}>{label}</FormLabel>}
      <Textarea
        rounded="md"
        {...field}
        onChange={(e) => handleCaptionChange(e, field)}
        {...props}
      />

      <Flex w="full" justify="space-between" pt={1}>
        <Icon as={FaRegFaceSmile} fontSize="md" color="gray.400" />
        <Text fontSize="sm" color="gray.400">
          {field.value?.length < maxChars ? field.value?.length : maxChars}/
          {maxChars}
        </Text>
      </Flex>

      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomTextareaInput;
