import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

const CustomTextareaInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <FormControl
      id={props.id}
      isRequired={props.isRequired ? props.isRequired : false}
      isInvalid={meta.error && meta.touched}
    >
      <FormLabel htmlFor={props.id}>{label}</FormLabel>
      <Textarea rounded="md" {...field} {...props} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomTextareaInput;
