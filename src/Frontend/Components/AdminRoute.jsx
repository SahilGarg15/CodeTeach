import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  // Check if user is admin by role field
  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;
  
  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default AdminRoute;

