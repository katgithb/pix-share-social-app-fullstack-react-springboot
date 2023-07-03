import altLogo from "../assets/images/pixshare_logo_gray.png";
import logo from "../assets/images/pixshare_logo.png";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Stack,
  Icon,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Image,
  VStack,
  MenuDivider,
  useColorMode,
  Input,
  Link,
  Center,
  chakra,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { FiMoon, FiSun } from "react-icons/fi";
import {
  FaBookmark,
  FaGear,
  FaMagnifyingGlass,
  FaRegCommentDots,
  FaRegCompass,
  FaRegHeart,
  FaRegSquarePlus,
  FaRightFromBracket,
  FaUser,
} from "react-icons/fa6";
import { PiHouseBold } from "react-icons/pi";
import { Link as RouteLink, NavLink, useLocation } from "react-router-dom";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const menuLinks = [
  {
    name: "Profile",
    path: "/username",
    icon: FaUser,
  },
  {
    name: "Saved",
    path: "/",
    icon: FaBookmark,
  },
  {
    name: "Settings",
    path: "/account/settings",
    icon: FaGear,
  },
];

const navLinks = [
  {
    name: "Home",
    path: "/",
    icon: <PiHouseBold />,
  },
  {
    name: "Comments",
    path: "#",
    icon: <FaRegCommentDots />,
  },
  {
    name: "Create Post",
    path: "#",
    icon: <FaRegSquarePlus />,
  },
  {
    name: "Discover",
    path: "#",
    icon: <FaRegCompass />,
  },
  {
    name: "Likes",
    path: "#",
    icon: <FaRegHeart />,
  },
];

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  return (
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
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        // maxW={1280}
        mx="auto"
      >
        <IconButton
          size="md"
          icon={isOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
          aria-label="Open Menu"
          display={["inherit", "inherit", "none"]}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems="center">
          <Link as={RouteLink} to="/">
            <Image
              alt="Logo"
              w={"auto"}
              h={10}
              src={colorMode === "light" ? logo : altLogo}
            />
          </Link>
          <HStack
            spacing={1}
            display={{ base: "none", md: "flex" }}
            alignItems="center"
            justify={"center"}
          >
            <HStack
              alignItems={"center"}
              borderColor={useColorModeValue("gray.300", "white")}
              borderRadius="5px"
            >
              <Icon
                as={FaMagnifyingGlass}
                pos={"absolute"}
                fontSize="lg"
                ml={3}
                color={"gray.400"}
              />
              <Input maxW="26rem" placeholder="Search..." pl={9} />
            </HStack>
          </HStack>
        </HStack>

        <HStack alignItems={"center"}>
          <HStack as="nav" display={{ base: "none", md: "block" }}>
            {navLinks.map((link, index) => (
              <NonMobileNavLink key={index} {...link} onClose={onClose} />
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
                src={
                  "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Sam&backgroundColor=c0aede"
                }
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
                to="/username"
                _hover={{ textDecoration: "none" }}
              >
                <MenuItem justifyContent={"center"} alignItems={"center"}>
                  <VStack>
                    <Avatar
                      size="xl"
                      src={
                        "https://api.dicebear.com/6.x/adventurer-neutral/svg?seed=Sam&backgroundColor=c0aede"
                      }
                    />
                    <Text size="sm" color="gray.400" mt="0 !important">
                      @darren_criss
                    </Text>
                    <Text fontWeight="500">Darren Criss</Text>
                  </VStack>
                </MenuItem>
              </Link>
              <MenuDivider />
              {menuLinks.map((link, index) => (
                <MenuLink key={index} {...link} onClose={onClose} />
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
                onClick={() => onClose()}
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

      {/* Mobile Screen Links */}
      {isOpen ? (
        <Box pb={4} display={["inherit", "inherit", "none"]}>
          <Stack as="nav" spacing={2}>
            {navLinks.map((link, index) => (
              <MobileNavLink key={index} {...link} onClose={onClose} />
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}

const NonMobileNavLink = ({ path, icon, onClose }) => {
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
    <Link as={NavLink} to={path} onClick={() => onClose()}>
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

const MobileNavLink = ({ name, path, icon, onClose }) => {
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
      as={RouteLink}
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
      onClick={() => onClose()}
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
