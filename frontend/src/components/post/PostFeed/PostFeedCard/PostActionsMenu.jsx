import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link as RouteLink } from "react-router-dom";

const PostActionsMenu = ({ isOpen, onClose, menuIcon }) => {
  const {
    isOpen: isOpenPostDeleteDialog,
    onOpen: onOpenPostDeleteDialog,
    onClose: onClosePostDeleteDialog,
  } = useDisclosure();
  const postDeleteDialogCancelRef = useRef();

  const menuLinks = [
    {
      name: "Follow",
      path: "",
      isLinkEmpty: true,
      color: useColorModeValue("blue.500", "blue.300"),
      handleMenuLinkClick: onClose,
    },
    {
      name: "Delete Post",
      path: "",
      isLinkEmpty: true,
      color: useColorModeValue("red.600", "red.400"),
      handleMenuLinkClick: onOpenPostDeleteDialog,
    },
    {
      name: "Cancel",
      path: "",
      isLinkEmpty: true,
      color: "",
      handleMenuLinkClick: onClose,
    },
  ];

  return (
    <>
      <Menu isLazy>
        <MenuButton
          as={IconButton}
          variant="ghost"
          colorScheme="gray"
          aria-label="See menu"
          icon={menuIcon}
        />
        <MenuList minW="auto">
          {menuLinks.map((link, index) => (
            <MenuLink key={index} {...link} onClose={onClose} />
          ))}
        </MenuList>
      </Menu>
      <PostDeleteDialog
        isOpen={isOpenPostDeleteDialog}
        onClose={onClosePostDeleteDialog}
        cancelRef={postDeleteDialogCancelRef}
      />
    </>
  );
};

const MenuLink = ({ name, path, isLinkEmpty, color, handleMenuLinkClick }) => {
  return (
    <Box>
      <Link
        as={isLinkEmpty ? Link : RouteLink}
        to={path}
        _hover={{
          textDecoration: "none",
        }}
        onClick={handleMenuLinkClick}
      >
        <MenuItem
        // border="1px"

        // justifyContent="center"
        // _hover={{
        //   color: "blue.400",
        //   bg: useColorModeValue("gray.200", "gray.600"),
        // }}
        >
          <Text px={2} fontSize="sm" fontWeight="semibold" color={color}>
            {name}
          </Text>
        </MenuItem>
      </Link>
    </Box>
  );
};

const PostDeleteDialog = ({ isOpen, onClose, cancelRef }) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      motionPreset="slideInBottom"
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Post
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure you want to delete this post? You cannot undo this
            action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onClose} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default PostActionsMenu;
