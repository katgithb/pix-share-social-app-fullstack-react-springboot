import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Link,
  Icon,
  ScaleFade,
  Text,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  MenuButton,
  MenuList,
  MenuItem,
  Menu,
  VStack,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import {
  BiCommentDetail,
  BiExpand,
  BiExpandAlt,
  BiLocationPlus,
  BiSend,
  BiSolidBookmark,
  BiTimer,
} from "react-icons/bi";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { FaHeart, FaRegComment, FaRegFaceSmile } from "react-icons/fa6";
import { PiPaperPlaneTiltBold } from "react-icons/pi";
import { IoTimerOutline } from "react-icons/io5";
import { ImShrink2 } from "react-icons/im";
import { LuShrink } from "react-icons/lu";
import {
  MdExpandCircleDown,
  MdOutlineExpandCircleDown,
  MdOutlineTimer,
  MdOutlineZoomInMap,
  MdZoomInMap,
} from "react-icons/md";
import { RxTimer } from "react-icons/rx";
import { GoLocation } from "react-icons/go";
import {
  AiOutlineExpand,
  AiOutlineExpandAlt,
  AiOutlineSend,
  AiOutlineShrink,
} from "react-icons/ai";
import { Link as RouteLink } from "react-router-dom";
import CustomizableModal from "../../../../shared/CustomizableModal";
import PostCommentCard from "../../../../comment/PostCommentCard";
import { CloseIcon } from "@chakra-ui/icons";
import PostActionsMenu from "../PostActionsMenu";
import PostExpandedView from "./PostExpandedView";
import PostImageExpandedView from "./PostImageExpandedView";

const PostViewModal = ({ currUser, user, post, isOpen, onClose }) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  function generateRandomName() {
    const names = [
      "John Doe",
      "Jane Smith",
      "Alex Johnson Hades Kate Wilber Robert",
      "Sarah Thompson",
    ];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  }

  function generateUsernameFromName(fullname) {
    const username = fullname.replace(/\s+/g, "_").toLowerCase();

    return username;
  }

  function generateRandomCaption() {
    const captions = [
      "Laborum nemo error odio. Ratione explicabo et odio.",
      "Vel aperiam doloribus mollitia et et. Fuga autem omnis voluptates nihil in fugit totam adipisci. Voluptatum voluptatem exercitationem rerum molestiae cum et hic. Molestias dolores ex et molestiae. Quaerat qui et voluptate adipisci autem.",
      "Est asperiores dignissimos fuga. Voluptas id at voluptatum. Ea facere magni necessitatibus et praesentium aut.",
      "Porro et nulla nulla quo rem rerum exercitationem. Facilis quia dolorem beatae sed eos exercitationem voluptas reprehenderit et. Cum voluptate repudiandae laborum ut tempore. Laborum maxime nihil ab veniam in. In distinctio laboriosam.",
      "Et est in est rerum est. Vel labore veniam repellat fugit eum distinctio quia eaque consequatur. Est eos deserunt in.",
      "Delectus sit cupiditate est. Quod maxime consequatur consequatur.",
      "Ipsa ratione harum consectetur quas repudiandae quibusdam sint amet ducimus.",
      "Enim rem odio eos est repudiandae eveniet distinctio voluptatum reprehenderit.",
    ];
    const randomIndex = Math.floor(Math.random() * captions.length);
    return captions[randomIndex];
  }

  function generateRandomComments() {
    const randomComments = [];
    const comments = [
      "Laborum nemo error odio. Ratione explicabo et odio.",
      "Vel aperiam doloribus mollitia et et. Fuga autem omnis voluptates nihil in fugit totam adipisci. Voluptatum voluptatem exercitationem rerum molestiae cum et hic. Molestias dolores ex et molestiae. Quaerat qui et voluptate adipisci autem.",
      "Est asperiores dignissimos fuga. Voluptas id at voluptatum. Ea facere magni necessitatibus et praesentium aut.",
      "Delectus sit cupiditate est. Quod maxime consequatur consequatur.",
      "Ipsa ratione harum consectetur quas repudiandae quibusdam sint amet ducimus.",
      "Enim rem odio eos est repudiandae eveniet distinctio voluptatum reprehenderit.",
      "Porro et nulla nulla quo rem rerum exercitationem. Facilis quia dolorem beatae sed eos exercitationem voluptas reprehenderit et. Cum voluptate repudiandae laborum ut tempore. Laborum maxime nihil ab veniam in. In distinctio laboriosam.",
      "Et est in est rerum est. Vel labore veniam repellat fugit eum distinctio quia eaque consequatur. Est eos deserunt in.",
      "Delectus sit cupiditate est. Quod maxime consequatur consequatur.",
      "Ipsa ratione harum consectetur quas repudiandae quibusdam sint amet ducimus.",
      "Enim rem odio eos est repudiandae eveniet distinctio voluptatum reprehenderit.",
    ];

    const randomIndex = Math.floor(Math.random() * comments.length);
    for (let i = 0; i < randomIndex; i++) {
      const comment = comments[i];
      randomComments.push(comment);
    }

    return randomComments;
  }

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
        !isImageExpanded ? (
          <HeaderContent
            title="View Post"
            user={{
              ...user,
            }}
          />
        ) : (
          ""
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
            user={{
              ...user,
            }}
            post={post}
            setIsImageExpanded={setIsImageExpanded}
            onClose={handleModalClose}
          />
        </ScaleFade>
      )}
    </CustomizableModal>
  );
};

const HeaderContent = ({ user }) => {
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
            alignItems="center"
            flexWrap="wrap"
            overflow="hidden"
          >
            <Avatar
              name={user?.fullname}
              src={user?.dp}
              boxSize="10"
              loading="lazy"
            />

            <Flex flexDirection="column" mb={-1.5} justify="center">
              <Heading size="xs" wordBreak={"break-word"}>
                {user?.username}
              </Heading>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={useColorModeValue("gray.500", "gray.400")}
                letterSpacing="wide"
                wordBreak={"break-word"}
              >
                {user?.fullname}
              </Text>
            </Flex>
          </Flex>

          <PostActionsMenu
            isOpen={isOpenPostActionsMenu}
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
