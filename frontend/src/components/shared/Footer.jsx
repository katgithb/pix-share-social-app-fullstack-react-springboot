import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { BsCameraFill, BsPersonWorkspace } from "react-icons/bs";
import useIsUserAuthenticated from "../../hooks/useIsUserAuthenticated";

const Footer = () => {
  const isUserAuthenticated = useIsUserAuthenticated();

  return (
    <Box as="footer" py={5} textAlign="center">
      <Flex
        flexDir={"column"}
        // flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        color="gray.400"
      >
        <Text>Made with ❤️ and a sprinkle of 💡 by A.K.</Text>
        {!isUserAuthenticated && (
          <Text>
            Join the community and start sharing <Icon as={BsCameraFill} /> in a
            vibrant online space <Icon as={BsPersonWorkspace} />
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default Footer;
