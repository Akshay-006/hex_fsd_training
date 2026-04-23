import { createRoot } from "react-dom/client";
//import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import UserList from "./components/user-list.jsx";
import AddUser from "./components/add-user.jsx";

const routes = createBrowserRouter([
  {
    path: "",
    element: <App />,
  },
  {
    path: "/user-list",
    element: <UserList />,
  },
  {
    path: "/add-user",
    element: <AddUser />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={routes}>
    <App />
  </RouterProvider>,
);
