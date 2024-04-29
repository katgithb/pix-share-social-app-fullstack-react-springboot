import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const SafeSharingPrivacyAlert = () => {
  const {
    isOpen: isOpenSafeSharingPrivacyAlert,
    onOpen: onOpenSafeSharingPrivacyAlert,
    onClose: onCloseSafeSharingPrivacyAlert,
  } = useDisclosure({ defaultIsOpen: true });

  return (
    <>
      {isOpenSafeSharingPrivacyAlert && (
        <Alert status="info" fontSize="">
          <AlertIcon />
          <Box>
            <AlertTitle>Privacy First! Protect your personal info</AlertTitle>
            <AlertDescription>
              This is a public platform - please do not share personal
              information here. 🚫 Instead, share your interests, passions and
              thoughts! 💡❤️📝
            </AlertDescription>
          </Box>
          <CloseButton
            alignSelf="flex-start"
            position="absolute"
            right={-1}
            top={-1}
            onClick={onCloseSafeSharingPrivacyAlert}
          />
        </Alert>
      )}
    </>
  );
};

export default SafeSharingPrivacyAlert;
