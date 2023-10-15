import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";

const CustomizableModal = ({
  isOpen,
  onClose,
  size,
  header,
  footer,
  showModalCloseButton,
  isCentered = true,
  scrollBehavior,
  closeOnEsc,
  closeOnOverlayClick,
  children,
}) => {
  return (
    <Modal
      size={size}
      isOpen={isOpen}
      onClose={onClose}
      scrollBehavior={scrollBehavior}
      isCentered={isCentered}
      closeOnEsc={closeOnEsc}
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <ModalOverlay />
      <ModalContent>
        {header && <ModalHeader>{header}</ModalHeader>}
        {showModalCloseButton && <ModalCloseButton mr={1} />}
        <ModalBody>{children}</ModalBody>
        {footer && <ModalFooter>{footer}</ModalFooter>}
      </ModalContent>
    </Modal>
  );
};

export default CustomizableModal;
