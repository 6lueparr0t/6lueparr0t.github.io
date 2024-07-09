import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Root from "@/pages/Root";
import ErrorPage from "@/pages/Error";

import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import SpacePage from "@/pages/Space";

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
        path: ":category",
        id: "space",
        element: <SpacePage />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
