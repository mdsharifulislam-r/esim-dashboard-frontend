import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Auth
import LoginPage from '@/pages/auth/LoginPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import OtpVerificationPage from '@/pages/auth/OtpVerificationPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import ChangePasswordPage from '@/pages/auth/ChangePasswordPage';
import ProfilePage from '@/pages/auth/ProfilePage';
import NotificationsPage from '@/pages/auth/NotificationsPage';

// Dashboard
import DashboardPage from '@/pages/dashboard/DashboardPage';

// Main pages
import UsersPage from '@/pages/users/UsersPage';
import InfluencersPage from '@/pages/influencers/InfluencersPage';
import BlogsPage from '@/pages/blogs/BlogsPage';
import BlogFormPage from '@/pages/blogs/BlogFormPage';
import CouponsPage from '@/pages/coupons/CouponsPage';
import FaqsPage from '@/pages/faqs/FaqsPage';
import ReviewsPage from '@/pages/reviews/ReviewsPage';
import SupportPage from '@/pages/support/SupportPage';
import DisclaimerPage from '@/pages/disclaimer/DisclaimerPage';
import DiscountPage from '@/pages/discount/DiscountPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OtpVerificationPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/influencers" element={<InfluencersPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/blogs/new" element={<BlogFormPage />} />
            <Route path="/blogs/edit/:id" element={<BlogFormPage />} />
            <Route path="/coupons" element={<CouponsPage />} />
            <Route path="/faqs" element={<FaqsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/discount" element={<DiscountPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
