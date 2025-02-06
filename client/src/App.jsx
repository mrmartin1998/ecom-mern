import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import './index.css'
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ROUTES } from '@/config/routes';
import MainLayout from '@/components/layout/MainLayout';
import LoadingSpinner from '@/components/common/ui/LoadingSpinner';
import ProtectedRoute from '@/components/common/ProtectedRoute';

// Lazy load pages
const HomePage = lazy(() => import('@/pages/home/page'));
const AboutPage = lazy(() => import('@/pages/about/page'));
const LoginPage = lazy(() => import('@/pages/auth/login/page'));
const RegisterPage = lazy(() => import('@/pages/auth/register/page'));
const ProductsPage = lazy(() => import('@/pages/products/page'));
const ProductDetailPage = lazy(() => import('@/pages/products/[id]/page'));

function App() {
  return (
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

            {/* Remove Protected Routes for now since ProfilePage isn't ready */}
            
            {/* Remove 404 Route for now since NotFoundPage isn't ready */}
          </Routes>
        </main>
      </Suspense>
      <Footer />
    </div>
  )
}

export default App;
