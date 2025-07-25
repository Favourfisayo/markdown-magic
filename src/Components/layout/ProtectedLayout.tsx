import { Outlet } from "react-router";
import ProtectedRoute from "../../Routes/ProtectedRoute";
import Navbar from "./Navbar";

const ProtectedLayout = () => {
    return (
        <>
        <ProtectedRoute>
            <Navbar/>
            <Outlet/>
        </ProtectedRoute>
        </>
    )
}

export default ProtectedLayout