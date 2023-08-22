import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import MainLayout from "./layouts/MainLayout";
import Footer from "./components/shared/Footer";
import Signin from "./components/auth/Signin/Signin";
import Story from "./pages/Story";
import Signup from "./components/auth/Signup/Signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/username",
        element: (
          <>
            <Profile />
            <Footer />
          </>
        ),
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
  {
    path: "/login",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/story/:userId",
    element: <Story />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
