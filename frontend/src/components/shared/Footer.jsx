import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box as="footer" py={5} textAlign="center">
      <Flex
        flexWrap="wrap"
        justifyContent="center"
        alignItems="center"
        color="gray.400"
      >
        <Text as="li" listStyleType="none" mx={2}>
          <Link href="#">About</Link>
        </Text>
        <Text as="li" listStyleType="none" mx={2}>
          <Link href="#">Privacy</Link>
        </Text>
        <Text as="li" listStyleType="none" mx={2}>
          <Link href="#">Terms</Link>
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
