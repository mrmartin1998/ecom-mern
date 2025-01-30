import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomePage from '@/pages/home/page';
import AboutPage from '@/pages/about/page';
import UsersPage from '@/pages/users/page';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
