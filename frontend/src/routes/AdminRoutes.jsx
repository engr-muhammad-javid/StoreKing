import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user); // assuming user object is stored
  const location = useLocation();

  if (!accessToken) {
    // Not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user || user.role !== 'admin') {
    // Logged in but not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
