import { Container, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Container as="main" maxW="7xl" px={4} pt={8} mx="auto">
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
