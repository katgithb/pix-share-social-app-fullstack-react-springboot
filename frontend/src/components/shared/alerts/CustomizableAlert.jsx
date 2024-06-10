import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
} from "@chakra-ui/react";
import React from "react";

const CustomizableAlert = ({
  isOpen,
  onClose,
  alertStatus,
  alertTitle,
  alertDescription,
}) => {
  return (
    <>
      <Alert
        status={alertStatus}
        opacity={isOpen ? 1 : 0}
        scaleY={isOpen ? 1 : 0}
        transition="0.3s ease-in-out"
      >
        <AlertIcon />
        <Box>
          <AlertTitle>{alertTitle}</AlertTitle>
          <AlertDescription>{alertDescription}</AlertDescription>
        </Box>
        <CloseButton
          alignSelf="flex-start"
          position="absolute"
          right={-1}
          top={-1}
          onClick={onClose}
        />
      </Alert>
    </>
  );
};

export default CustomizableAlert;
