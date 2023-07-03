import { Container, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Container as="main" maxW="1280px" px={4} mx="auto">
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

export default MainLayout;
