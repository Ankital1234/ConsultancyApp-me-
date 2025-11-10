import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Consultants from './pages/Consultants';
import ConsultantRegistration from './pages/ConsultantRegistration';
import CompleteProfile from './pages/CompleteProfile';
import Profile from './pages/Profile';
import ConsultantProfile from './pages/ConsultantProfile';
import CompanyRegistration from './pages/CompanyRegistration';
import ConsultantDashboard from './pages/ConsultantDashboard';
import AboutPage from './pages/AboutPage';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import UserSignup from './pages/UserSignup';
import UserDashboard from './pages/UserDashboard';
import UserReviews from './pages/UserReviews';
import UserProfile from './pages/UserProfile';

function App() {
  const location = useLocation();
  const hideFooter = location.pathname === '/login';
  return (
    <div className="min-h-screen font-sans">
      <Navbar />
      <main className="pt-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/consultants" element={<Consultants />} />
          <Route path="/consultant-register" element={<ConsultantRegistration />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/consultant-profile" element={<ConsultantProfile />} />
          <Route path="/consultant/dashboard" element={<ConsultantDashboard />} />
          <Route path="/company/register" element={<CompanyRegistration />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user-reviews" element={<UserReviews />} />
          <Route path="/user/profile" element={<UserProfile />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;
