import { useContext, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const context = useContext(AuthContext);
  const location = useLocation 

  if (!context) {
    return <Navigate to="/login" />;
  }

  const { user, loading } = context;

    if (loading) {
        return <span className="loading loading-spinner loading-xl"></span>;
    }

  if (user) {
    return <>{children}</>;
  }

  return <Navigate to="/login" state={{from:location}} replace/>;
};

export default PrivateRoute;
