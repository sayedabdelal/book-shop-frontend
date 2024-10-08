import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import LI from "./Header/LI";
import "./Header/Header.css";
import Footer from "../components/Footer";

import { authActions } from '../store/auth';
import { logoutUser, fetchCarts } from "../util/http";

import { useSelector, useDispatch } from 'react-redux';
import { useMutation, useQueries } from "@tanstack/react-query";
import { fetchCartItems, clearCart } from '../store/cartSlice';
import { useEffect } from "react";
import { clearUserId } from "../store/userSlice";
import { fetchWishlist, clearWishList } from "../store/wishlistSlice";
import DarkModeToggle from "../UI/DarkModeToggle";


function RootPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const isAuth = useSelector(state => state.auth.isAuthenticated);
    const isAdmin = useSelector(state => state.auth.isAdmin);
    // Access the cart state from Redux
    const cartItems = useSelector(state => state.cart.items);
    // Calculate the total number of items in the cart
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // Access the wishlist state from Redux
    const wishlistItems = useSelector(state => state.wishlist.items);
    // Calculate the total number of items in the wishlist
    const totalWishlistItems = wishlistItems.length;

    const darkMode = useSelector((state) => state.theme.darkMode);
    
    

    useEffect(() => {
      // Set a timeout to change the loading state after 5 seconds
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000); // 5000 ms = 5 seconds
  
      // Cleanup the timeout on component unmount
      return () => clearTimeout(timeout);
    }, []);


    
    const checkSession = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${apiUrl}/check-session`, {
                credentials: 'include', // Send cookies along with request
            });
            
            if (response.ok) {
                const data = await response.json();
               

                if (data.isAuthenticated) {
                    // If authentic  if(isAdmin){ 
                    dispatch(authActions.login());
                    
                } else {
                    // If not authenticated, dispatch logout
                    dispatch(clearCart());
                    dispatch(clearWishList());
                    dispatch(clearUserId());
                    dispatch(authActions.logout());

                    console.log('Session expired or not authenticated');
                }
            } else {
                // If the response isn't OK (e.g., 401), dispatch logout
                dispatch(authActions.logout());
                console.log('Session expired or not authenticated');
            }
        } catch (error) {
            console.error('Error checking session:', error);
            dispatch(authActions.logout()); // Log out on error
        }
    };

    useEffect(() => {
        // Check session immediately on load
        checkSession();

        // Set interval to check session every 10 minutes
        const intervalId = setInterval(checkSession, 600000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [dispatch]);





    useEffect(() => {
        // Apply or remove the 'dark-theme' class based on darkMode state
        if (darkMode) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }, [darkMode]);


    useEffect(() => {
        if (isAuth) {
            dispatch(fetchCartItems());
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuth, location])



    const handleLoginClick = () => {
        navigate("/login");
    };

    // Use React Query's useMutation to handle logout
    const mutation = useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            dispatch(clearCart());
            dispatch(clearWishList());
            dispatch(authActions.logout());
            localStorage.removeItem('isAuthenticated');
            dispatch(clearUserId());
            navigate('/login');
        },
        onError: (error) => {
            console.error('Logout failed:', error);
            alert('Failed to log out. Please try again.');
        }
    });

    function handleLogot() {
        // dispatch(authActions.logout());
        // // Remove the isAuth value from local storage
        // localStorage.removeItem('isAuthenticated');
        // dispatch(authActions.logout());
        mutation.mutate();
    }



    return (
        <>

            <header className="header" id="header">
                <nav className="nav container">
                    <Link to="/" className="nav__logo">
                        <i className="ri-book-3-line" />
                        E-Shop
                    </Link>

                    <div className="nav__menu">

                        <ul className="nav__list">
                        <LI to="/" iconClass="ri-home-3-fill" text="Home" /> 
                          <LI to="shop" iconClass="ri-shopping-bag-fill" text="Shop" /> 
                            <LI
                                to="discount"
                                iconClass="ri-price-tag-3-line"
                                text="Discount"
                            />

                            <LI
                                to="testimonial"
                                iconClass="ri-message-3-line"
                                text="Testimonial"
                            />
                        </ul>
                    </div>

                    <div className="nav__actions">
                    {!isAdmin && (
                        <Link to='shop/cart' className="icon-wrapper">
                            <i className="ri-shopping-cart-line cart-icon" />
                            <span className="icon-number" id="cart-number">
                                {totalItems}
                            </span>
                        </Link>
                        )}

                        {/* Wishlist Icon */}
                        {!isAdmin && (
                        <Link to='shop/wishlist' className="icon-wrapper">
                            <i className="ri-heart-line wishlist-icon" />
                            <span className="icon-number wish" id="wishlist-number">
                                {totalWishlistItems}
                            </span>
                        </Link>
                        )}


                        {/* login button */}
                        {!isAuth && !isAdmin && (
                            <i
                                className="ri-user-3-line login-button"
                                id="login-btn"
                                onClick={handleLoginClick}
                            />
                        )}

                        {/* dashboard Admin */}
                        {isAdmin && (
                            <Link to='dashboard' className="icon-wrapper">
                                <i className="ri-dashboard-line" />
                            </Link>
                        )}

                        {/* logout button */}



                        {(isAuth || isAdmin) && (
                            <i
                                className="ri-logout-box-line"
                                id="logout-btn"
                                onClick={handleLogot}
                            />
                        )}



                        {/* theme button */}
                        <DarkModeToggle />
                    </div>
                </nav>
            </header>

            <main className="main">
                <Outlet />

            </main>
            <Footer />

        </>
    );
}

export default RootPage;
