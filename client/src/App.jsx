import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import FarmerLayout from './layouts/FarmerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Farmer Pages
import DashboardPage from './pages/farmer/DashboardPage';
import FarmsPage from './pages/farmer/FarmsPage';
import FarmDetailPage from './pages/farmer/FarmDetailPage';
import CropsPage from './pages/farmer/CropsPage';
import CropDetailPage from './pages/farmer/CropDetailPage';
import WeatherPage from './pages/farmer/WeatherPage';
import SoilAnalysisPage from './pages/farmer/SoilAnalysisPage';
import PestDiseasePage from './pages/farmer/PestDiseasePage';
import MarketplacePage from './pages/farmer/MarketplacePage';
import ProductDetailPage from './pages/farmer/ProductDetailPage';
import CartPage from './pages/farmer/CartPage';
import OrdersPage from './pages/farmer/OrdersPage';
import ExpertConsultationPage from './pages/farmer/ExpertConsultationPage';
import CommunityPage from './pages/farmer/CommunityPage';
import NotificationsPage from './pages/farmer/NotificationsPage';
import ProfilePage from './pages/farmer/ProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import ProductManagementPage from './pages/admin/ProductManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import ConsultationManagementPage from './pages/admin/ConsultationManagementPage';
import ContentModerationPage from './pages/admin/ContentModerationPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <ErrorBoundary>
              <Routes>
                {/* ── Auth routes (no navbar/footer, redirect if already logged in) */}
                <Route element={<AuthLayout />}>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* ── Public routes with Navbar + Footer */}
                <Route element={<PublicLayout />}>
                  <Route path="/homePage" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                </Route>

                {/* ── Farmer routes (JWT protected) */}
                <Route element={<ProtectedRoute><FarmerLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/farms" element={<FarmsPage />} />
                  <Route path="/farms/:id" element={<FarmDetailPage />} />
                  <Route path="/crops" element={<CropsPage />} />
                  <Route path="/crops/:id" element={<CropDetailPage />} />
                  <Route path="/weather" element={<WeatherPage />} />
                  <Route path="/soil-analysis" element={<SoilAnalysisPage />} />
                  <Route path="/pest-disease" element={<PestDiseasePage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/marketplace/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/expert-advice" element={<ExpertConsultationPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                {/* ── Admin routes (JWT + admin role protected) */}
                <Route element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}>
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/admin/users" element={<UserManagementPage />} />
                  <Route path="/admin/products" element={<ProductManagementPage />} />
                  <Route path="/admin/orders" element={<OrderManagementPage />} />
                  <Route path="/admin/consultations" element={<ConsultationManagementPage />} />
                  <Route path="/admin/moderation" element={<ContentModerationPage />} />
                </Route>

                {/* ── Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
