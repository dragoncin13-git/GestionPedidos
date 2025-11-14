import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
  role?: string;
}

export default function PrivateRoute({ children, role }: PrivateRouteProps) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // Si no hay token, ir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si no requiere rol específico, permitir acceso
  if (!role) {
    return <>{children}</>;
  }

  // Si requiere rol específico, verificar user data
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userData);
    
    // Intentar diferentes nombres de campo para el rol
    const userRole = user.role || user.rol || user.roleType;
    
    if (userRole === role) {
      return <>{children}</>;
    } else {
      // Redirigir según el rol actual del usuario
      if (userRole === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/client/home" replace />;
      }
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    return <Navigate to="/login" replace />;
  }
}