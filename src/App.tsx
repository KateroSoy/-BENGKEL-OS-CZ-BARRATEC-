/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Portal from "./pages/public/Portal";
import Landing from "./pages/public/Landing";
import BookingForm from "./pages/public/BookingForm";
import BookingSuccess from "./pages/public/BookingSuccess";
import Login from "./pages/admin/Login";
import AdminLayout from "./pages/admin/Layout";
import Dashboard from "./pages/admin/Dashboard";
import BookingsToday from "./pages/admin/BookingsToday";
import BookingDetail from "./pages/admin/BookingDetail";
import ManualBooking from "./pages/admin/ManualBooking";
import Calendar from "./pages/admin/Calendar";
import Services from "./pages/admin/Services";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Promotions from "./pages/admin/Promotions";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/home" element={<Landing />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings/today" element={<BookingsToday />} />
          <Route path="bookings/new" element={<ManualBooking />} />
          <Route path="bookings/:id" element={<BookingDetail />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="services" element={<Services />} />
          <Route path="reports" element={<Reports />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
