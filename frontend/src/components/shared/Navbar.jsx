import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  FaBookmark,
  FaGear,
  FaRegCommentDots,
  FaRegCompass,
  FaRegHeart,
  FaRegSquarePlus,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";
import { FiMoon, FiSun } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrSearch } from "react-icons/gr";
import { PiHouseBold } from "react-icons/pi";
import { TbLayoutNavbarCollapse, TbLayoutNavbarExpand } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouteLink, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/pixshare_logo.png";
import altLogo from "../../assets/images/pixshare_logo_gray.png";
import { signoutAction } from "../../redux/actions/auth/authActions";
import CreatePostModal from "../post/CreatePostModal/CreatePostModal";
import SearchInputBar from "../search/SearchInputBar";
import SearchResultsListModal from "../search/SearchResultsListModal/SearchResultsListModal";

// const menuLinks = [
//   {
//     name: "Profile",
//     path: `/profile/${userProfile.currUser?.username}`,
//     icon: FaUser,
//   },
//   {
//     name: "Saved",
//     path: "/",
//     icon: FaBookmark,
//   },
//   {
//     name: "Settings",
//     path: "/account/settings",
//     icon: FaGear,
//   },
// ];

const Navbar = () => {
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();
  const {
    isOpen: isOpenNavModal,
    onOpen: onOpenNavModal,
    onClose: onCloseNavModal,
  } = useDisclosure();
  const {
    isOpen: isOpenNewPostModal,
    onOpen: onOpenNewPostModal,
    onClose: onCloseNewPostModal,
  } = useDisclosure();
  const {
    isOpen: isOpenSearchResultsListModal,
    onOpen: onOpenSearchResultsListModal,
    onClose: onCloseSearchResultsListModal,
  } = useDisclosure();
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);
  const [showNavBar, setShowNavBar] = useState(false);
  // const token = localStorage.getItem("token");
  const userProfile = useSelector((store) => store.user.userProfile);

  const menuLinks = [
    {
      name: "Profile",
      path: `/profile/${userProfile.currUser?.username}`,
      icon: FaUser,
    },
    {
      name: "Saved",
      path: "/",
      icon: FaBookmark,
    },
    {
      name: "Settings",
      path: "/account/edit",
      icon: FaGear,
    },
  ];

  const navLinks = [
    {
      name: "Home",
      path: "/",
      isLinkEmpty: false,
      icon: <PiHouseBold />,
      handleNavLinkClick: onCloseNavModal,
    },
    {
      name: "Comments",
      path: "#",
      isLinkEmpty: true,
      icon: <FaRegCommentDots />,
      handleNavLinkClick: onCloseNavModal,
    },
    {
      name: "Create Post",
      path: "#",
      isLinkEmpty: true,
      icon: <FaRegSquarePlus />,
      handleNavLinkClick: onOpenNewPostModal,
    },
    {
      name: "Discover",
      path: "#",
      isLinkEmpty: true,
      icon: <FaRegCompass />,
      handleNavLinkClick: onCloseNavModal,
    },
    {
      name: "Likes",
      path: "#",
      isLinkEmpty: true,
      icon: <FaRegHeart />,
      handleNavLinkClick: onCloseNavModal,
    },
  ];

  const mobileNavLinks = [
    {
      name: "Home",
      path: "/",
      isLinkEmpty: false,
      icon: <PiHouseBold />,
      handleNavLinkClick: onCloseNavModal,
    },
    {
      name: "Search",
      path: "#",
      isLinkEmpty: true,
      icon: <GrSearch />,
      handleNavLinkClick: onOpenSearchResultsListModal,
    },
    {
      name: "Create Post",
      path: "#",
      isLinkEmpty: true,
      icon: <FaRegSquarePlus />,
      handleNavLinkClick: onOpenNewPostModal,
    },
    {
      name: "Discover",
      path: "#",
      isLinkEmpty: true,
      icon: <FaRegCompass />,
      handleNavLinkClick: onCloseNavModal,
    },
    {
      name: "Likes",
      path: "#",
      isLinkEmpty: true,
      icon: <FaRegHeart />,
      handleNavLinkClick: onCloseNavModal,
    },
  ];

  const handleSignOutClick = () => {
    dispatch(signoutAction());
  };

  const handleScroll = () => {
    const isScrollingDown = window.scrollY > 0;

    if (isScrollingDown) {
      setIsNavbarCollapsed(true);
    } else {
      setIsNavbarCollapsed(false);
      setShowNavBar(false);
    }
  };

  const handleToggleNav = () => {
    if (window.scrollY > 0) {
      setShowNavBar(!showNavBar);
      onCloseNavModal();
    }
  };

  window.addEventListener("scroll", handleScroll);

  return (
    <>
      <Box
        as="header"
        px={4}
        boxShadow="lg"
        bg={useColorModeValue("gray.100", "gray.700")}
        width="100%"
        position="sticky"
        top="0"
        zIndex="sticky"
      >
        <CreatePostModal
          isOpen={isOpenNewPostModal}
          onClose={onCloseNewPostModal}
        />

        <Collapse
          startingHeight={20}
          in={!isNavbarCollapsed || showNavBar}
          animateOpacity
        >
          <Flex
            h={16}
            alignItems="center"
            justifyContent="space-between"
            // maxW={1280}
            mx="auto"
            pointerEvents={!isNavbarCollapsed || showNavBar ? "auto" : "none"}
            opacity={!isNavbarCollapsed || showNavBar ? 1 : 0}
            transition="opacity 0.3s ease"
          >
            <IconButton
              size="md"
              icon={isOpenNavModal ? <AiOutlineClose /> : <GiHamburgerMenu />}
              aria-label="Open Menu"
              display={["inherit", "inherit", "none"]}
              onClick={isOpenNavModal ? onCloseNavModal : onOpenNavModal}
            />
            <HStack spacing={8} alignItems="center">
              <Link as={RouteLink} to="/">
                <Image
                  alt="Logo"
                  w={"auto"}
                  h={10}
                  src={useColorModeValue(logo, altLogo)}
                />
              </Link>
              <HStack
                display={{ base: "none", md: "flex" }}
                alignItems="center"
                justify={"center"}
              >
                <SearchResultsListModal
                  isOpen={isOpenSearchResultsListModal}
                  onClose={onCloseSearchResultsListModal}
                />

                <SearchInputBar
                  isNavSearchBar={true}
                  onOpenSearchModal={onOpenSearchResultsListModal}
                />
              </HStack>
            </HStack>

            <HStack alignItems={"center"}>
              <HStack as="nav" display={{ base: "none", md: "block" }}>
                {navLinks.map((link, index) => (
                  <NonMobileNavLink
                    key={index}
                    {...link}
                    onClose={onCloseNavModal}
                  />
                ))}
                <IconButton
                  onClick={toggleColorMode}
                  variant={"ghost"}
                  aria-label="Color Switcher"
                  icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
                  _hover={{
                    bg: useColorModeValue("gray.200", "gray.600"),
                    color: useColorModeValue("blue.500", "blue.200"),
                  }}
                  fontSize="1.5rem"
                />
              </HStack>

              <Menu isLazy>
                <MenuButton as={Button} size="sm" px={0} py={0} rounded="full">
                  <Avatar
                    size="sm"
                    name={userProfile.currUser?.name}
                    src={userProfile.currUser?.userImage}
                  />
                </MenuButton>
                <MenuList
                  zIndex={5}
                  border="2px solid"
                  borderColor={useColorModeValue("gray.700", "gray.100")}
                  // boxShadow="4px 4px 0"
                >
                  <Link
                    as={RouteLink}
                    to={`/profile/${userProfile.currUser?.username}`}
                    _hover={{ textDecoration: "none" }}
                  >
                    <MenuItem justifyContent={"center"} alignItems={"center"}>
                      <VStack>
                        <Avatar
                          size="xl"
                          name={userProfile.currUser?.name}
                          src={userProfile.currUser?.userImage}
                          boxShadow="md"
                        />
                        <Text
                          size="sm"
                          color="gray.400"
                          mt="0 !important"
                          wordBreak={"break-all"}
                        >
                          @{userProfile.currUser?.username}
                        </Text>
                        <Text fontWeight="500" wordBreak={"break-word"}>
                          {userProfile.currUser?.name}
                        </Text>
                      </VStack>
                    </MenuItem>
                  </Link>
                  <MenuDivider />
                  {menuLinks.map((link, index) => (
                    <MenuLink key={index} {...link} onClose={onCloseNavModal} />
                  ))}
                  <MenuDivider />
                  <MenuItem
                    onClick={toggleColorMode}
                    _hover={{
                      color: "blue.400",
                      bg: useColorModeValue("gray.200", "gray.600"),
                    }}
                    display={{ base: "block", md: "none" }}
                  >
                    <HStack>
                      <Icon
                        as={colorMode === "light" ? MoonIcon : SunIcon}
                        size={17}
                      />
                      <Text>
                        {colorMode === "light" ? "Dark Mode" : "Light Mode"}
                      </Text>
                    </HStack>
                  </MenuItem>
                  <Link
                    as={RouteLink}
                    to="/"
                    _hover={{
                      textDecoration: "none",
                    }}
                    onClick={() => handleSignOutClick()}
                  >
                    <MenuItem
                      _hover={{
                        color: "blue.400",
                        bg: useColorModeValue("gray.200", "gray.600"),
                      }}
                    >
                      <HStack>
                        <Icon as={FaRightFromBracket} size={17} />
                        <Text>Sign Out</Text>
                      </HStack>
                    </MenuItem>
                  </Link>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Collapse>

        {/* Mobile Screen Links */}
        {isOpenNavModal ? (
          <Box
            pb={4}
            display={
              !isNavbarCollapsed || showNavBar
                ? ["inherit", "inherit", "none"]
                : "none"
            }
          >
            <Stack as="nav" spacing={2}>
              {mobileNavLinks.map((link, index) => (
                <MobileNavLink
                  key={index}
                  {...link}
                  onClose={onCloseNavModal}
                />
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <IconButton
        size="md"
        icon={
          !isNavbarCollapsed || showNavBar ? (
            <TbLayoutNavbarCollapse />
          ) : (
            <TbLayoutNavbarExpand />
          )
        }
        aria-label="Toggle Menu"
        bg={"transparent"}
        fontSize="24"
        rounded="full"
        boxShadow="md"
        color={useColorModeValue("blue.400", "blue.500")}
        position="fixed"
        left="50%"
        transform={
          !isNavbarCollapsed || showNavBar
            ? "translateX(-50%)"
            : "translateX(-50%) translateY(-110%)"
        }
        top="45"
        zIndex="sticky"
        pointerEvents={window.scrollY > 0 ? "auto" : "none"}
        opacity={window.scrollY > 0 ? 1 : 0}
        transition="all 0.25s ease"
        onClick={handleToggleNav}
      />
    </>
  );
};

const NonMobileNavLink = ({
  path,
  isLinkEmpty,
  icon,
  handleNavLinkClick,
  onClose,
}) => {
  const navLocation = useLocation();
  const isActiveLink = navLocation.pathname === path;

  const link = {
    bg: useColorModeValue("gray.200", "gray.600"),
    color: useColorModeValue("blue.500", "blue.200"),
  };

  const activeLink = {
    bg: useColorModeValue("blue.400", "blue.500"),
    color: useColorModeValue("gray.100", "gray.200"),
  };

  const hoverActiveLink = {
    bg: useColorModeValue("blue.500", "blue.600"),
    color: useColorModeValue("gray.200", "gray.300"),
  };

  return (
    <Link
      as={isLinkEmpty ? Link : NavLink}
      to={path}
      onClick={handleNavLinkClick}
    >
      {isActiveLink ? (
        <IconButton
          variant={"ghost"}
          icon={icon}
          color={activeLink.color}
          bg={activeLink.bg}
          _hover={{
            bg: hoverActiveLink.bg,
            color: hoverActiveLink.color,
          }}
          fontSize={"1.5rem"}
        />
      ) : (
        <IconButton
          variant={"ghost"}
          icon={icon}
          _hover={{
            bg: link.bg,
            color: link.color,
          }}
          fontSize={"1.5rem"}
        />
      )}
    </Link>
  );
};

const MobileNavLink = ({
  name,
  path,
  isLinkEmpty,
  icon,
  handleNavLinkClick,
  onClose,
}) => {
  const navLocation = useLocation();
  const isActiveLink = navLocation.pathname === path;

  const link = {
    bg: useColorModeValue("gray.200", "gray.600"),
    color: useColorModeValue("blue.500", "blue.200"),
  };

  const activeLink = {
    bg: useColorModeValue("blue.400", "blue.500"),
    color: useColorModeValue("gray.100", "gray.200"),
  };

  const hoverActiveLink = {
    bg: useColorModeValue("blue.500", "blue.600"),
    color: useColorModeValue("gray.200", "gray.300"),
  };

  const linkText = {
    color: useColorModeValue("blue.500", "blue.200"),
  };

  return (
    <Link
      as={isLinkEmpty ? Link : NavLink}
      to={path}
      px={3}
      py={1}
      lineHeight="inherit"
      rounded="md"
      _hover={{
        textDecoration: "none",
        bg: link.bg,
        color: link.color,
      }}
      onClick={handleNavLinkClick}
    >
      <HStack role="group">
        {isActiveLink ? (
          <IconButton
            variant={"ghost"}
            icon={icon}
            color={activeLink.color}
            bg={activeLink.bg}
            _hover={{
              bg: hoverActiveLink.bg,
              color: hoverActiveLink.color,
            }}
            fontSize={"1.2rem"}
          />
        ) : (
          <IconButton
            variant={"ghost"}
            icon={icon}
            _hover={{
              bg: link.bg,
              color: link.color,
            }}
            fontSize={"1.2rem"}
          />
        )}
        <Text color={isActiveLink ? linkText.color : ""}>{name}</Text>
      </HStack>
    </Link>
  );
};

const MenuLink = ({ name, path, icon, onClose }) => {
  return (
    <Link
      as={RouteLink}
      to={path}
      _hover={{
        textDecoration: "none",
      }}
      onClick={() => onClose()}
    >
      <MenuItem
        _hover={{
          color: "blue.400",
          bg: useColorModeValue("gray.200", "gray.600"),
        }}
      >
        <HStack>
          <Icon as={icon} size={17} />
          <Text>{name}</Text>
        </HStack>
      </MenuItem>
    </Link>
  );
};

export default Navbar;
