import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar(){
  const [open, setOpen] = useState(false);
  const [profileStatus, setProfileStatus] = useState('pending');
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Check if profile is completed and approved
    const status = localStorage.getItem('profileStatus');
    const savedProfile = localStorage.getItem('consultantCompleteProfile');
    
    if (status === 'approved' && savedProfile) {
      setProfileStatus('approved');
      try {
        setProfileData(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing profile data:', error);
        setProfileData(null);
      }
    } else {
      setProfileStatus('pending');
      setProfileData(null);
    }
  }, []);
  return (
    <nav className="bg-white/90 backdrop-blur shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900 hover:text-blue-700 transition">consultancy.co</Link>

        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 transition"
          onClick={() => setOpen(v => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d={open ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
          </svg>
        </button>

        <div className="hidden md:flex items-center space-x-8 text-gray-700">
          <NavLink to="/" end className={({isActive}) => `pb-1 border-b-2 border-transparent hover:border-blue-200 hover:text-blue-700 transition ${isActive ? 'text-blue-700 font-semibold border-blue-700' : ''}`}>Home</NavLink>
          <NavLink to="/consultants" className={({isActive}) => `pb-1 border-b-2 border-transparent hover:border-blue-200 hover:text-blue-700 transition ${isActive ? 'text-blue-700 font-semibold border-blue-700' : ''}`}>Consultants</NavLink>
          <NavLink to="/about" className={({isActive}) => `pb-1 border-b-2 border-transparent hover:border-blue-200 hover:text-blue-700 transition ${isActive ? 'text-blue-700 font-semibold border-blue-700' : ''}`}>About</NavLink>
          <NavLink to="/contact" className={({isActive}) => `pb-1 border-b-2 border-transparent hover:border-blue-200 hover:text-blue-700 transition ${isActive ? 'text-blue-700 font-semibold border-blue-700' : ''}`}>Contact</NavLink>
        </div>
        <div className="hidden md:flex items-center space-x-3">
          {profileStatus === 'approved' ? (
            <Link to="/consultant-profile" className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-blue-50 transition">
              {(() => {
                try {
                  return profileData?.profilePhoto && typeof profileData.profilePhoto !== 'string' ? (
                    <img 
                      src={URL.createObjectURL(profileData.profilePhoto)} 
                      alt="Profile" 
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  );
                } catch (error) {
                  console.error('Error displaying profile photo in navbar:', error);
                  return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  );
                }
              })()}
              <span className="text-sm font-medium text-gray-700">
                {profileData?.displayName || 'Profile'}
              </span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 border rounded-lg hover:bg-blue-50 transition">Login</Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 shadow-soft hover:shadow-softlg transition">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t">
          <div className="px-6 py-3 space-y-1.5 text-gray-700">
            <NavLink to="/" end className={({isActive}) => `block px-2 py-2 rounded hover:bg-gray-50 ${isActive ? 'text-blue-700 font-semibold' : ''}`} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/consultants" className={({isActive}) => `block px-2 py-2 rounded hover:bg-gray-50 ${isActive ? 'text-blue-700 font-semibold' : ''}`} onClick={() => setOpen(false)}>Consultants</NavLink>
            <NavLink to="/about" className={({isActive}) => `block px-2 py-2 rounded hover:bg-gray-50 ${isActive ? 'text-blue-700 font-semibold' : ''}`} onClick={() => setOpen(false)}>About</NavLink>
            <NavLink to="/contact" className={({isActive}) => `block px-2 py-2 rounded hover:bg-gray-50 ${isActive ? 'text-blue-700 font-semibold' : ''}`} onClick={() => setOpen(false)}>Contact</NavLink>
            <div className="pt-2">
              {profileStatus === 'approved' ? (
                <Link to="/consultant-profile" className="flex items-center space-x-2 w-full px-4 py-2 border rounded-lg hover:bg-blue-50 transition" onClick={() => setOpen(false)}>
                  {(() => {
                    try {
                      return profileData?.profilePhoto && typeof profileData.profilePhoto !== 'string' ? (
                        <img 
                          src={URL.createObjectURL(profileData.profilePhoto)} 
                          alt="Profile" 
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      );
                    } catch (error) {
                      console.error('Error displaying profile photo in mobile menu:', error);
                      return (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      );
                    }
                  })()}
                  <span className="text-sm font-medium text-gray-700">
                    {profileData?.displayName || 'Profile'}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="flex-1 px-4 py-2 border rounded-lg text-center hover:bg-blue-50 transition" onClick={() => setOpen(false)}>Login</Link>
                  <Link to="/signup" className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg text-center hover:bg-blue-800 transition" onClick={() => setOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
