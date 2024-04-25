import { Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import useIsUserAuthenticated from "../hooks/useIsUserAuthenticated";

const MainLayout = ({ children }) => {
  const isUserAuthenticated = useIsUserAuthenticated();

  return (
    <>
      <Navbar />
      <Container as="main" maxW="7xl" px={4} pt={8} mx="auto">
        {/* Conditional rendering based on authentication */}
        {isUserAuthenticated ? <Outlet /> : children}
      </Container>
    </>
  );
};

export default MainLayout;
