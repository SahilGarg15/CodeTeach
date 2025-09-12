import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  if (user.isAdmin && window.location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminRoute;

