import { createBrowserRouter } from "react-router-dom";
import PasswordReset from "../components/account/PasswordReset/PasswordReset";
import PasswordResetRequest from "../components/account/PasswordReset/PasswordResetRequest/PasswordResetRequest";
import PasswordResetTokenVerification from "../components/account/PasswordReset/PasswordResetTokenVerification";
import UserProfileDetailsEdit from "../components/account/UserProfileDetailsEdit";
import Signin from "../components/auth/Signin/Signin";
import Signup from "../components/auth/Signup/Signup";
import Footer from "../components/shared/Footer";
import MainLayout from "../layouts/MainLayout";
import Discover from "../pages/Discover";
import Home from "../pages/Home";
import PageNotFound from "../pages/PageNotFound";
import Profile from "../pages/Profile";
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
    path: "/reset-password/new",
    element: <PasswordResetRequest />,
  },
  {
    path: "/reset-password/confirm",
    element: <PasswordResetTokenVerification />,
  },
  {
    path: "/reset-password",
    element: <PasswordReset />,
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
            path: "/discover",
            element: <Discover />,
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
      // {
      //   path: "/story/:userId",
      //   element: <Story />,
      // },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

export default router;
