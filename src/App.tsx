import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Root from "@/pages/Root";
import HomePage from "@/pages/Home";
import AboutPage from "@/pages/About";
import ErrorPage from "@/pages/Error";

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
