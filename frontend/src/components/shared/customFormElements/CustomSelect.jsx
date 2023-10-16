import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

const CustomSelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <FormControl
      id={props.id}
      isRequired={props.isRequired ? props.isRequired : false}
      isInvalid={meta.error && meta.touched}
    >
      <FormLabel htmlFor={props.id}>{label}</FormLabel>
      <Select rounded="md" {...field} {...props}>
        {/* <option value="">Select gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option> */}
      </Select>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomSelect;
