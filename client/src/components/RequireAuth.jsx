import { Navigate, Outlet } from "react-router"
import { useLocation } from "react-router-dom";

const RequireAuth = () => {
    let auth = localStorage.getItem("jwt_token");
    let location = useLocation();

    if (!auth) {
        return <Navigate replate to="/" state={{ from: location }} />;
    }

    return <Outlet />
};

export default RequireAuth;