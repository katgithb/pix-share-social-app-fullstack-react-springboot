import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Icon,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { useState } from "react";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";

const CustomPasswordInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  return (
    <FormControl
      id={props.id}
      isRequired={props.isRequired ? props.isRequired : false}
      isInvalid={meta.error && meta.touched}
    >
      <FormLabel htmlFor={props.id}>{label}</FormLabel>
      <InputGroup>
        <Input
          rounded="md"
          type={showPassword ? "text" : "password"}
          {...field}
          {...props}
        />
        <InputRightElement h={"full"}>
          <Button fontSize="xl" variant={"ghost"} onClick={toggleShowPassword}>
            {showPassword ? (
              <Icon as={PiEyeBold} />
            ) : (
              <Icon as={PiEyeClosedBold} />
            )}
          </Button>
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default CustomPasswordInput;
