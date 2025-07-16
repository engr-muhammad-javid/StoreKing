import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow all roles except "customer"
  if (user?.roleName?.toLowerCase() === "customer") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
