import { Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import LoadingSpinner from '../common/ui/LoadingSpinner';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 