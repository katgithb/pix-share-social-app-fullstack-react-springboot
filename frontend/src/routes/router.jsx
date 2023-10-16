import { createBrowserRouter } from "react-router-dom";
import UserProfileDetailsEdit from "../components/account/UserProfileDetailsEdit";
import Signin from "../components/auth/Signin/Signin";
import Signup from "../components/auth/Signup/Signup";
import Footer from "../components/shared/Footer";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import PageNotFound from "../pages/PageNotFound";
import Profile from "../pages/Profile";
import Story from "../pages/Story";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/profile/:username",
            element: (
              <>
                <Profile />
                <Footer />
              </>
            ),
          },
          {
            path: "/account/edit",
            element: (
              <>
                <UserProfileDetailsEdit />
                <Footer />
              </>
            ),
          },
        ],
      },
      {
        path: "/story/:userId",
        element: <Story />,
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
