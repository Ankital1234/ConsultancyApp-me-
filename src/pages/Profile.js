import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profile data from localStorage
    const savedProfile = localStorage.getItem('consultantCompleteProfile');
    const isApproved = localStorage.getItem('profileApproved');
    
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Profile Found</h2>
          <p className="text-gray-600 mb-4">Please complete your profile first.</p>
          <Link
            to="/complete-profile"
            className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Complete Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Profile Icon */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Profile Icon and Name */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-sky-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <h1 className="text-lg font-semibold text-gray-900">{profileData.displayName}</h1>
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Approved
                  </span>
                </div>
                <p className="text-sm text-gray-500">{profileData.domain}</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex space-x-8">
              <Link to="/consultant/dashboard" className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Dashboard
              </Link>
              <Link to="/profile" className="text-sky-600 border-b-2 border-sky-600 px-3 py-2 text-sm font-medium">
                Profile
              </Link>
              <button className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium">
                Settings
              </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Sidebar - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="text-center">
                    {/* Profile Photo */}
                    {profileData.profilePhoto && typeof profileData.profilePhoto !== 'string' ? (
                      <img 
                        src={URL.createObjectURL(profileData.profilePhoto)} 
                        alt="Profile" 
                        className="mx-auto h-32 w-32 rounded-full object-cover border-4 border-sky-100"
                      />
                    ) : (
                      <div className="mx-auto h-32 w-32 rounded-full bg-sky-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    
                    <h3 className="mt-4 text-xl font-bold text-gray-900">{profileData.displayName}</h3>
                    <p className="text-sm text-gray-500">{profileData.domain}</p>
                    
                    {/* LinkedIn Profile */}
                    {profileData.linkedinProfile && (
                      <a 
                        href={profileData.linkedinProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center text-sky-600 hover:text-sky-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                        </svg>
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Experience</dt>
                        <dd className="mt-1 text-sm text-gray-900">{profileData.experience}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Hourly Rate</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {profileData.currency} {profileData.hourlyRate}/hour
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Session Rate</dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {profileData.currency} {profileData.sessionRate}/session
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Timezone</dt>
                        <dd className="mt-1 text-sm text-gray-900">{profileData.timezone}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>

              {/* Availability Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>
                  <div className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Available Days</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profileData.availableDays.length > 0 ? profileData.availableDays.join(', ') : 'Not set'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Time Slots</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {profileData.timeSlots.length > 0 ? (
                          <ul className="space-y-1">
                            {profileData.timeSlots.map((slot, index) => (
                              <li key={index}>{slot.start} - {slot.end}</li>
                            ))}
                          </ul>
                        ) : 'Not set'}
                      </dd>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Bio</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{profileData.bio}</p>
                </div>
              </div>

              {/* Documents Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Profile Photo</p>
                        <p className="text-xs text-gray-500">
                          {profileData.profilePhoto ? profileData.profilePhoto.name : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Aadhar Card</p>
                        <p className="text-xs text-gray-500">
                          {profileData.aadharCard ? profileData.aadharCard.name : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">PAN Card</p>
                        <p className="text-xs text-gray-500">
                          {profileData.panCard ? profileData.panCard.name : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Resume/CV</p>
                        <p className="text-xs text-gray-500">
                          {profileData.resume ? profileData.resume.name : 'Not uploaded'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {profileData.achievementCertificates.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Achievement Certificates</h4>
                      <div className="space-y-2">
                        {profileData.achievementCertificates.map((cert, index) => (
                          cert && (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div>
                                <p className="text-sm font-medium text-gray-900">Certificate {index + 1}</p>
                                <p className="text-xs text-gray-500">{cert.name}</p>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex space-x-4">
                    <Link
                      to="/complete-profile"
                      className="flex-1 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors text-center"
                    >
                      Edit Profile
                    </Link>
                    <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Share Profile
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Download PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
