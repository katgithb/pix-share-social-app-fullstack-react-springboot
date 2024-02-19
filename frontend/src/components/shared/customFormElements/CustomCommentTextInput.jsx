import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { useState } from "react";

const CustomCommentTextInput = ({
  label,
  inputLeftElement,
  inputRightElement,
  maxChars,
  ...props
}) => {
  const [field, meta] = useField(props);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <FormControl
      id={props.id}
      isRequired={props.isRequired ? props.isRequired : false}
      isInvalid={meta.error && meta.touched}
    >
      {label && <FormLabel htmlFor={props.id}>{label}</FormLabel>}

      <Tooltip
        label={meta.error ? meta.error : `${field.value.length} / ${maxChars}`}
        hasArrow
        placement="top"
        isOpen={isFocused && (maxChars || meta.error)}
        isDisabled={!maxChars}
        bg={meta.error ? "red.400" : "gray.500"}
        color={"gray.100"}
        rounded="lg"
        closeOnClick={true}
      >
        <InputGroup
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          {inputLeftElement && (
            <InputLeftElement>{inputLeftElement}</InputLeftElement>
          )}

          <Input rounded="md" {...field} {...props} />

          {inputRightElement && (
            <InputRightElement>{inputRightElement}</InputRightElement>
          )}
        </InputGroup>
      </Tooltip>
    </FormControl>
  );
};

export default CustomCommentTextInput;
