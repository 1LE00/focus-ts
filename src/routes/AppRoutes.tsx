import { Routes, Route } from "react-router-dom"
import Layout from "../layouts/Layout"
import Home from "../pages/Home"
import AuthPage from "../pages/Auth"
import AuthLayout from "../layouts/AuthLayout"
import ResetPassword from "../pages/ResetPassword"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
            </Route>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<AuthPage />} />
                <Route path="/signup" element={<AuthPage />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
        </Routes>
    )
}
export default AppRoutes