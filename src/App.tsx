import { RouterProvider, createBrowserRouter } from "react-router";

import Root from "@/pages/Root";
import ErrorPage from "@/pages/Error";

import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import SpacePage, { loader as SpaceLoader } from "@/pages/Space";
import GuestPage from "@/pages/Guest";
import SpaceViewPage, { loader as SpaceViewLoader } from "@/pages/SpaceView";


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
