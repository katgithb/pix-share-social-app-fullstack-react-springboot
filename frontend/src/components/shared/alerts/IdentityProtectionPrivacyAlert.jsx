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

const IdentityProtectionPrivacyAlert = () => {
  const {
    isOpen: isOpenIdentityProtectionPrivacyAlert,
    onOpen: onOpenIdentityProtectionPrivacyAlert,
    onClose: onCloseIdentityProtectionPrivacyAlert,
  } = useDisclosure({ defaultIsOpen: true });

  return (
    <>
      {isOpenIdentityProtectionPrivacyAlert && (
        <Alert status="info" fontSize="">
          <AlertIcon />
          <Box>
            <AlertTitle>Stay Incognito! Strengthen your privacy</AlertTitle>
            <AlertDescription>
              You're in control of your privacy! 🔒 Use a made-up username and
              name that doesn't reveal your real identity. 😎 This helps protect
              your privacy. 🛡️
            </AlertDescription>
          </Box>
          <CloseButton
            alignSelf="flex-start"
            position="absolute"
            right={-1}
            top={-1}
            onClick={onCloseIdentityProtectionPrivacyAlert}
          />
        </Alert>
      )}
    </>
  );
};

export default IdentityProtectionPrivacyAlert;
