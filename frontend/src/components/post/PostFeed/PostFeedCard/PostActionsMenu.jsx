import {
  Box,
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
import { Link as RouteLink } from "react-router-dom";
import { isCurrUserPost } from "../../../../utils/postUtils";
import PostDeleteDialog from "./PostDeleteDialog";
import PostViewModal from "./PostViewModal/PostViewModal";

const PostActionsMenu = ({
  isUserAuthenticated = false,
  currUser,
  post,
  updateLoadedPostEntry,
  handleInformUserFeatureRequiresAuth = () => {},
  isModalActionsMenu = false,
  isActionsMenuDisabled = false,
  handleModalClose = () => {},
  onClose,
  menuIcon,
}) => {
  const {
    isOpen: isOpenPostViewModal,
    onOpen: onOpenPostViewModal,
    onClose: onClosePostViewModal,
  } = useDisclosure();
  const {
    isOpen: isOpenPostDeleteDialog,
    onOpen: onOpenPostDeleteDialog,
    onClose: onClosePostDeleteDialog,
  } = useDisclosure();
  const postDeleteDialogCancelRef = useRef();

  const menuLinks = [
    {
      name: !isModalActionsMenu ? "View Details" : "Hide Details",
      path: "",
      isLinkEmpty: true,
      hidden: false,
      color: useColorModeValue("blue.500", "blue.300"),
      handleMenuLinkClick: !isModalActionsMenu
        ? isUserAuthenticated
          ? onOpenPostViewModal
          : handleInformUserFeatureRequiresAuth
        : handleModalClose,
    },
    {
      name: "Delete Post",
      path: "",
      isLinkEmpty: true,
      hidden: !isCurrUserPost(currUser?.id, post?.user?.id),
      color: useColorModeValue("red.600", "red.400"),
      handleMenuLinkClick: isUserAuthenticated
        ? onOpenPostDeleteDialog
        : handleInformUserFeatureRequiresAuth,
    },
    {
      name: "Cancel",
      path: "",
      isLinkEmpty: true,
      hidden: false,
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
          isDisabled={isActionsMenuDisabled}
        />
        <MenuList minW="auto">
          {menuLinks.map((link, index) => (
            <MenuLink key={index} {...link} onClose={onClose} />
          ))}
        </MenuList>
      </Menu>

      {isUserAuthenticated && (
        <>
          <PostViewModal
            currUser={currUser}
            post={post}
            updateLoadedPostEntry={updateLoadedPostEntry}
            isOpen={isOpenPostViewModal}
            onClose={onClosePostViewModal}
          />
          <PostDeleteDialog
            isOpen={isOpenPostDeleteDialog}
            onClose={onClosePostDeleteDialog}
            cancelRef={postDeleteDialogCancelRef}
            postId={post?.id}
          />
        </>
      )}
    </>
  );
};

const MenuLink = ({
  name,
  path,
  isLinkEmpty,
  hidden,
  color,
  handleMenuLinkClick,
}) => {
  return (
    <>
      {!hidden && (
        <Box>
          <Link
            as={isLinkEmpty ? Link : RouteLink}
            to={path}
            _hover={{
              textDecoration: "none",
            }}
            onClick={handleMenuLinkClick}
          >
            <MenuItem>
              <Text px={2} fontSize="sm" fontWeight="semibold" color={color}>
                {name}
              </Text>
            </MenuItem>
          </Link>
        </Box>
      )}
    </>
  );
};

export default PostActionsMenu;
