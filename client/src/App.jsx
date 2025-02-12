import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './index.css'
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ROUTES } from '@/config/routes';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/ui/LoadingSpinner';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './components/features/auth/ResetPassword';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/home/page'));
const AboutPage = lazy(() => import('@/pages/about/page'));
const LoginPage = lazy(() => import('@/pages/auth/login/page'));
const RegisterPage = lazy(() => import('@/pages/auth/register/page'));
const ProductsPage = lazy(() => import('@/pages/products/page'));
const ProductDetailPage = lazy(() => import('@/pages/products/[id]/page'));
const CartPage = lazy(() => import('@/pages/cart/page'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/verify-email.page'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/forgot-password/page'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/reset-password/page'));
const ProfilePage = lazy(() => import('@/pages/profile/page'));

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <main className="container mx-auto px-4 py-8 flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.ABOUT} element={<AboutPage />} />
              <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
              <Route path={`${ROUTES.PRODUCTS}/:id`} element={<ProductDetailPage />} />

              {/* Auth Routes */}
              <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
              <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
              

              {/* Add Cart Route */}
              <Route 
                path={ROUTES.CART} 
                element={
                  
                    <CartPage />
                  
                } 
              />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
              </Route>

              {/* Remove 404 Route for now since NotFoundPage isn't ready */}
              <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
          </main>
        </Suspense>
        <Footer />
        <ToastContainer />
      </div>
    </AuthProvider>
  )
}

export default App;
