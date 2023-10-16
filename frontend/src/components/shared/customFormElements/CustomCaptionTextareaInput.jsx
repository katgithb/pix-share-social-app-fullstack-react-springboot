import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

const CustomCaptionTextareaInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const handleCaptionChange = (e, field) => {
    const maxChars = props.maxChars ? props.maxChars : Number.MAX_SAFE_INTEGER;
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
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomCaptionTextareaInput;
