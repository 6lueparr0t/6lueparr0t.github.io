import { createBrowserRouter, RouterProvider } from "react-router";

import AboutPage from "@/pages/About";
import BlogPage from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ErrorPage from "@/pages/Error";
import GuestPage from "@/pages/Guest";
import HomePage from "@/pages/Home";
import Root from "@/pages/Root";
import SpacePage, { loader as SpaceLoader } from "@/pages/Space";
import SpaceViewPage, { loader as SpaceViewLoader } from "@/pages/SpaceView";

// BlogPage import 추가

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, path: "", element: <HomePage /> },
      {
        path: "about",
        id: "about",
        element: <AboutPage />,
      },
      {
        path: "space",
        id: "space",
        element: <SpacePage />,
        loader: SpaceLoader,
      },
      {
        path: "space/:issueNumber",
        id: "space-view",
        element: <SpaceViewPage />,
        loader: SpaceViewLoader,
      },
      {
        path: "guest",
        id: "guest",
        element: <GuestPage />,
      },
      {
        // Blog 라우트 추가
        path: "blog",
        id: "blog",
        element: <BlogPage />,
      },
      {
        path: "blog/:slug",
        id: "blog-post",
        element: <BlogPost />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
