import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
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
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import Layout from "./pages/dashboard/Layout.jsx";
import Users from "./pages/dashboard/users/Users.jsx";
import Products from "./pages/dashboard/products/Products.jsx";
import ErrorRoute from "./UI/ErrorRoute.jsx";

const basename = "/bookshop"; // Update this to your repository's base path

function App() {
  // const darkMode = useSelector((state) => state.theme.darkMode);
  // console.log('darkModeAppppp:', darkMode);

  return (
    // <div className={darkMode ? 'dark-theme' : ''}>
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Router basename={basename}>
        <Routes>
          <Route path="/" element={<RootPage />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="discount" element={<DiscountPage />} />
            <Route path="testimonial" element={<TestimonialPage />} />
            <Route path="shop" element={<ShopPage />}>
              <Route index element={<ShopPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path=":id" element={<ShopDesPage />} loader={shopLoader} />
            </Route>
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="*" element={<ErrorRoute />} />
          </Route>
          <Route path="dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="products" element={<PrivateRoute><Products /></PrivateRoute>} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
    // </div>
  );
}

export default App;
