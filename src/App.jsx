import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./util/http.js";
import RootPage from "./pages/RootPage.jsx";
import ErrorPage from "./UI/ErrorPage.jsx";
import LoginPage from "./pages/AuthenticationPages/LoginPage.jsx";
import SignupPage from "./pages/AuthenticationPages/SignupPage.jsx";
import PrivateRoute from "./pages/AuthenticationPages/PrivateRoute.jsx";
import UserPage from "./pages/UserPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import DiscountPage from "./pages/DiscountPage.jsx";
import TestimonialPage from "./pages/TestimonialPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import ShopDesPage, { loader as shopLoader } from "./pages/ShopDesPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import Wishlist from "./components/wishlist/Wishlist.jsx";
import ErrorBoundary from "./pages/ErrorBoundary.jsx";
import { ToastContainer } from "react-toastify";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import Layout from "./pages/dashboard/Layout.jsx";
import Users from "./pages/dashboard/users/Users.jsx";
import Products from "./pages/dashboard/products/Products.jsx";
import ErrorRoute from "./UI/ErrorRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "discount", element: <DiscountPage /> },
      { path: "testimonial", element: <TestimonialPage /> },
      {
        path: "shop",
        children: [
          { index: true, element: <ShopPage /> },
          { path: "cart", element: <CartPage /> },
          { path: "wishlist", element: <Wishlist /> },
          {
            path: ":id", // Dynamic segment for shop description
            id: "shop-details",
            element: <ShopDesPage />,
            loader: shopLoader,
          },
        ],
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        ),
      },
      {
        path: "products",
        element: (
          <PrivateRoute>
            <Products />
          </PrivateRoute>
        ),
      },
    ],
  },
  { path: "forgot-password", element: <ForgotPasswordPage /> },
  { path: "*", element: <ErrorRoute /> },
]);

function App() {
  // You can uncomment this once darkMode is needed.
  // const darkMode = useSelector((state) => state.theme.darkMode);
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
