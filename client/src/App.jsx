import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

// Donor
import DonorDashboard from './pages/donor/DonorDashboard';
import BrowseRequests from './pages/donor/BrowseRequests';
import DonationHistory from './pages/donor/DonationHistory';

// Receiver
import ReceiverDashboard from './pages/receiver/ReceiverDashboard';
import CreateRequest from './pages/receiver/CreateRequest';
import MyRequests from './pages/receiver/MyRequests';
import OrganRequest from './pages/receiver/OrganRequest';

// Hospital
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import OrganRequests from './pages/hospital/OrganRequests';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import VerifyRequests from './pages/admin/VerifyRequests';
import VerifyDocuments from './pages/admin/VerifyDocuments';
import ManageUsers from './pages/admin/ManageUsers';
import ManageHospitals from './pages/admin/ManageHospitals';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Donor Routes */}
          <Route path="/donor/dashboard" element={
            <ProtectedRoute allowedRoles={['DONOR']}><DonorDashboard /></ProtectedRoute>
          } />
          <Route path="/donor/browse" element={
            <ProtectedRoute allowedRoles={['DONOR']}><BrowseRequests /></ProtectedRoute>
          } />
          <Route path="/donor/history" element={
            <ProtectedRoute allowedRoles={['DONOR']}><DonationHistory /></ProtectedRoute>
          } />

          {/* Receiver Routes */}
          <Route path="/receiver/dashboard" element={
            <ProtectedRoute allowedRoles={['RECEIVER']}><ReceiverDashboard /></ProtectedRoute>
          } />
          <Route path="/receiver/create-request" element={
            <ProtectedRoute allowedRoles={['RECEIVER']}><CreateRequest /></ProtectedRoute>
          } />
          <Route path="/receiver/requests" element={
            <ProtectedRoute allowedRoles={['RECEIVER']}><MyRequests /></ProtectedRoute>
          } />
          <Route path="/receiver/organ-request" element={
            <ProtectedRoute allowedRoles={['RECEIVER']}><OrganRequest /></ProtectedRoute>
          } />

          {/* Hospital Routes */}
          <Route path="/hospital/dashboard" element={
            <ProtectedRoute allowedRoles={['HOSPITAL']}><HospitalDashboard /></ProtectedRoute>
          } />
          <Route path="/hospital/organ-requests" element={
            <ProtectedRoute allowedRoles={['HOSPITAL']}><OrganRequests /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/verify-requests" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><VerifyRequests /></ProtectedRoute>
          } />
          <Route path="/admin/verify-documents" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><VerifyDocuments /></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><ManageUsers /></ProtectedRoute>
          } />
          <Route path="/admin/hospitals" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><ManageHospitals /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
