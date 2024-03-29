import {
  Box,
  Divider,
  Flex,
  Heading,
  Link,
  ScaleFade,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { Link as RouteLink } from "react-router-dom";
import AvatarWithLoader from "../../../../shared/AvatarWithLoader";
import CustomizableModal from "../../../../shared/CustomizableModal";
import PostActionsMenu from "../PostActionsMenu";
import PostExpandedView from "./PostExpandedView";
import PostImageExpandedView from "./PostImageExpandedView";

const PostViewModal = ({
  currUser,
  post,
  updateLoadedPostEntry,
  isOpen,
  onClose,
}) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const handleModalClose = () => {
    setIsImageExpanded(false);
    onClose();
  };

  return (
    <CustomizableModal
      isOpen={isOpen}
      onClose={handleModalClose}
      size={isImageExpanded ? "full" : "5xl"}
      header={
        isImageExpanded ? null : (
          <HeaderContent currUser={currUser} post={post} />
        )
      }
      showModalCloseButton={false}
      scrollBehavior={"outside"}
    >
      {isImageExpanded ? (
        <ScaleFade in initialScale={0.9}>
          <PostImageExpandedView
            post={post}
            setIsImageExpanded={setIsImageExpanded}
            onClose={handleModalClose}
          />
        </ScaleFade>
      ) : (
        <ScaleFade in initialScale={0.9}>
          <PostExpandedView
            currUser={currUser}
            post={post}
            updateLoadedPostEntry={updateLoadedPostEntry}
            setIsImageExpanded={setIsImageExpanded}
            onClose={handleModalClose}
          />
        </ScaleFade>
      )}
    </CustomizableModal>
  );
};

const HeaderContent = ({ currUser, post }) => {
  const {
    isOpen: isOpenPostActionsMenu,
    onOpen: onOpenPostActionsMenu,
    onClose: onClosePostActionsMenu,
  } = useDisclosure();

  return (
    <Box>
      <Box mx={-2} mt={-2} overflow="hidden">
        <Flex pb={1} overflow="hidden">
          <Flex
            flex="1"
            gap="3"
            align="center"
            flexWrap="wrap"
            overflow="hidden"
          >
            <Link
              as={RouteLink}
              to={`/profile/${post?.user?.username}`}
              rounded="full"
            >
              <AvatarWithLoader
                loaderSize={10}
                name={post?.user?.name}
                src={post?.user?.userImage ? post?.user?.userImage : {}}
                boxSize="10"
              />
            </Link>

            <Flex flexDirection="column" mb={-1.5} justify="center">
              <Heading size="xs" wordBreak={"break-word"}>
                <Link as={RouteLink} to={`/profile/${post?.user?.username}`}>
                  {post?.user?.username}
                </Link>
              </Heading>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={useColorModeValue("gray.500", "gray.400")}
                letterSpacing="wide"
                wordBreak={"break-word"}
              >
                {post?.user?.name}
              </Text>
            </Flex>
          </Flex>

          <PostActionsMenu
            currUser={currUser}
            post={post}
            onClose={onClosePostActionsMenu}
            menuIcon={<BsThreeDots />}
          />
        </Flex>
      </Box>

      <Box mx={-6}>
        <Divider />
      </Box>
    </Box>
  );
};

export default PostViewModal;
