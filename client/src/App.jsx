import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
// const LoginPage = lazy(() => import('@/pages/auth/login/page'));
// const RegisterPage = lazy(() => import('@/pages/auth/register/page'));
//const ProfilePage = lazy(() => import('@/pages/profile/page'));
//const NotFoundPage = lazy(() => import('@/pages/404/page'));

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Suspense fallback={<LoadingSpinner />}>
          <main className="container mx-auto px-4 py-8 flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.ABOUT} element={<AboutPage />} />

              {/* Auth Routes */}
              {/* <Route path={ROUTES.LOGIN} element={<LoginPage />} />
              <Route path={ROUTES.REGISTER} element={<RegisterPage />} /> */}

              {/* Protected Routes */}
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </Suspense>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
