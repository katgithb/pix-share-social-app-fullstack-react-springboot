import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Link,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { useDispatch } from "react-redux";
import { Link as RouteLink } from "react-router-dom";
import { signoutAction } from "../../redux/actions/auth/authActions";

const BasicProfileCard = ({ user }) => {
  const dispatch = useDispatch();

  const handleSignOutClick = () => {
    dispatch(signoutAction());
  };

  return (
    <Card
      p={3}
      variant={useColorModeValue("outline", "elevated")}
      rounded="lg"
      boxShadow={"md"}
    >
      <Flex overflow="hidden">
        <Flex alignItems="center" overflow="hidden">
          <Link
            as={RouteLink}
            to={`/username`}
            bgGradient={"linear(to-tr, yellow.400, pink.400, purple.600)"}
            p={"1"}
            rounded="full"
          >
            <Box bg="gray.50" p={"0.5"} rounded="full">
              <Avatar
                name={user?.fullname}
                src={user?.dp}
                // size="md"
                boxSize="14"
                alt="User Avatar"
                boxShadow={"md"}
                _hover={{
                  transition: "transform 0.3s ease",
                  transform: "rotate(8deg) scale(1.2)",
                }}
              />
            </Box>
          </Link>

          <Box px="2" mb={-0.5}>
            <Text
              fontSize="sm"
              textAlign="start"
              fontWeight="semibold"
              wordBreak={"break-word"}
              noOfLines={2}
            >
              <Link as={RouteLink} to={`/username`}>
                {user?.username}
              </Link>
            </Text>
            <Text
              fontSize="sm"
              textAlign="start"
              overflow="hidden"
              color="gray.500"
              wordBreak={"break-word"}
              noOfLines={2}
            >
              {user?.fullname}
            </Text>
          </Box>
        </Flex>

        <Flex flex="1" alignItems="center" justifyContent="end">
          <Link
            as={RouteLink}
            href="#"
            fontSize="xs"
            color={useColorModeValue("cyan.500", "cyan.400")}
            fontWeight="bold"
            cursor="pointer"
            onClick={handleSignOutClick}
          >
            <Button
              colorScheme="cyan"
              variant="outline"
              size="xs"
              rounded="full"
            >
              Sign Out
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Card>
  );
};

export default BasicProfileCard;
