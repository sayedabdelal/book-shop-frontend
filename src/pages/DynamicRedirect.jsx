import { Navigate, useLocation } from 'react-router-dom';

const DynamicRedirect = () => {
  const location = useLocation();

  console.log(location);

  // Check the path and redirect or render a component accordingly
  if (location.pathname === '/shop') {
    return <Navigate to="/shop" />;  // Redirect to the shop route
  }

  
  return <Navigate to="/" />;
};

export default DynamicRedirect;
