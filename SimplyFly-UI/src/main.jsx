import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminDashboard from "./components/admin/admin-dashboard.jsx";

import Login from "./components/auth/login.jsx";
import PassengerSignup from "./components/auth/passenger-signup.jsx";
import SimplyFlySearch from "./components/search-flights/search-flights.jsx";

import MyBookings from "./components/passenger/my-bookings.jsx";

import SeatBookingTest from "./components/passenger/seat-test.jsx";
import FlightOwnerDashboard from "./components/flight-owner/flight-owner-dashboard.jsx";
import { Provider } from "react-redux";
import { store } from "./store.js";

const routes = createBrowserRouter([
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },

  {
    path: "",
    element: <Login />,
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/signup",
    element: <PassengerSignup />,
  },
  {
    path: "/search-flights",
    element: <SimplyFlySearch />,
  },
  {
    path: "/seats/:flightId",
    element: <SeatBookingTest />,
  },
  {
    path: "/bookings",
    element: <MyBookings />,
  },
  {
    path: "/owner/dashboard",
    element: <FlightOwnerDashboard />,
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={routes}>
      <App />
    </RouterProvider>
    ,
  </Provider>,
);
