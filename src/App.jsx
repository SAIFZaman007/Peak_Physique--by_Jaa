import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PortalLayout from "./pages/portal/PortalLayout.jsx";
import ChatWidget from "./components/ChatWidget.jsx";
import CartDrawer from "./components/CartDrawer.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Overview from "./pages/portal/Overview.jsx";
import Progress from "./pages/portal/Progress.jsx";
import Bookings from "./pages/portal/Bookings.jsx";
import Payments from "./pages/portal/Payments.jsx";
import Messages from "./pages/portal/Messages.jsx";

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/portal"
          element={
            <ProtectedRoute>
              <PortalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="progress" element={<Progress />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="payments" element={<Payments />} />
          <Route path="messages" element={<Messages />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <ChatWidget />
      <CartDrawer />
    </CartProvider>
  );
}