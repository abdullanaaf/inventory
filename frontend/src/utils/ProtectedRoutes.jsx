import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoutes = ({ children, requireRole }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  console.log(user);
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (requireRole && user.role !== requireRole) {
      navigate('/unauthorized');
    }
  }, [user, navigate, requireRole]);

  if (!user || (requireRole && user.role !== requireRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;