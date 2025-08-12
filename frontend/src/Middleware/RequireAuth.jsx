import { Navigate } from "react-router-dom";

export const RequireAuth = ({ children }) => {
    const token = JSON.parse(localStorage.getItem("userData"))?.token;
    return token ? children : <Navigate to="/" />;
};
