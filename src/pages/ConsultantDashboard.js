import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';

export default function ConsultantDashboard(){
  const [profileData, setProfileData] = useState(null);
  const [profileStatus, setProfileStatus] = useState('pending');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'request', message: 'New consultation request from John Doe', time: '2 hours ago', read: false },
    { id: 2, type: 'approval', message: 'Your profile has been approved', time: '1 day ago', read: true },
    { id: 3, type: 'message', message: 'Client sent you a message', time: '3 days ago', read: true }
  ]);

  useEffect(() => {
    // Check if profile is completed and approved
    const status = localStorage.getItem('profileStatus');
    const isApproved = localStorage.getItem('profileApproved');
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

  // Calculate profile completeness
  const calculateProfileCompleteness = () => {
    if (!profileData) return 0;
    
    const fields = [
      'displayName', 'domain', 'bio', 'experience', 'linkedinProfile',
      'profilePhoto', 'aadharCard', 'panCard', 'resume', 'hourlyRate', 'sessionRate',
      'availableDays', 'timeSlots'
    ];
    
    const completedFields = fields.filter(field => {
      const value = profileData[field];
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== '';
    });
    
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const profileCompleteness = calculateProfileCompleteness();

  const stats = [
    {label: 'Total Sessions', value: '47', delta: '+12%', icon: '📅'},
    {label: 'Monthly Earnings', value: '$3,240', delta: '+8%', icon: '💰'},
    {label: 'Active Clients', value: '12', delta: '+3', icon: '👥'},
    {label: 'Avg Rating', value: '4.8', delta: '+0.2', icon: '⭐'},
  ];

  const upcomingSessions = [
    { id: 1, client: 'Sarah Johnson', date: 'Today', time: '2:00 PM', type: 'Video Call', duration: '1 hour' },
    { id: 2, client: 'Mike Chen', date: 'Tomorrow', time: '10:00 AM', type: 'Phone Call', duration: '45 min' },
    { id: 3, client: 'Emily Davis', date: 'Dec 15', time: '3:30 PM', type: 'In-Person', duration: '2 hours' },
  ];

  const recentReviews = [
    { id: 1, client: 'Alex Thompson', rating: 5, comment: 'Excellent consultation! Very knowledgeable and helpful.', date: '2 days ago' },
    { id: 2, client: 'Maria Garcia', rating: 4, comment: 'Good session, provided valuable insights.', date: '1 week ago' },
    { id: 3, client: 'David Lee', rating: 5, comment: 'Outstanding service, exceeded expectations!', date: '2 weeks ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Top hero */}
      <section className="bg-gradient-to-b from-sky-500 to-sky-600 text-white">
        <div className="max-w-6xl mx-auto px-6 py-14 text-center">
          <p className="inline-block text-xs uppercase tracking-wider bg-white/20 rounded-full px-3 py-1 mb-4">Welcome to Consultant Dashboard</p>
          
          {/* Profile Info or Welcome Message */}
          {profileData ? (
            <div className="flex items-center justify-center mb-4">
              <div className="mr-4">
                {(() => {
                  try {
                    return profileData.profilePhoto && typeof profileData.profilePhoto !== 'string' ? (
                      <Avatar className="h-16 w-16 border-3 border-white/50">
                        <AvatarImage 
                          src={URL.createObjectURL(profileData.profilePhoto)} 
                          alt="Profile" 
                        />
                        <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                          {profileData.displayName?.charAt(0).toUpperCase() || 'C'}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="h-16 w-16 bg-white/20">
                        <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                          {profileData.displayName?.charAt(0).toUpperCase() || 'C'}
                        </AvatarFallback>
                      </Avatar>
                    );
                  } catch (error) {
                    console.error('Error displaying profile photo:', error);
                    return (
                      <Avatar className="h-16 w-16 bg-white/20">
                        <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                          {profileData.displayName?.charAt(0).toUpperCase() || 'C'}
                        </AvatarFallback>
                      </Avatar>
                    );
                  }
                })()}
              </div>
              <div className="text-left">
                <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-sm">Welcome, {profileData.displayName || 'Consultant'}!</h1>
                <p className="text-sky-100">{profileData.domain || 'Professional'} • {profileData.experience || 'Experienced'}</p>
              </div>
            </div>
          ) : (
            <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow-sm">Welcome, Demo Consultant!</h1>
          )}
          
          <p className="mt-3 text-sky-100">Grow your consulting business with powerful tools and insights</p>
          
          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {profileStatus !== 'approved' && (
              <Link to="/complete-profile" className="inline-flex items-center gap-2 rounded-lg bg-white text-sky-700 px-4 py-2 shadow hover:bg-sky-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9V6h2v3h3v2h-3v3H9v-3H6V9h3z"/></svg>
                Complete Profile
              </Link>
            )}
            {profileStatus === 'approved' && (
              <Link to="/consultant-profile" className="inline-flex items-center gap-2 rounded-lg bg-white text-sky-700 px-4 py-2 shadow hover:bg-sky-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9V6h2v3h3v2h-3v3H9v-3H6V9h3z"/></svg>
                View Profile
              </Link>
            )}
            <Link to="/consultants" className="inline-flex items-center gap-2 rounded-lg bg-sky-700/40 text-white px-4 py-2 border border-white/30 hover:bg-sky-700/50">
              Browse Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-2xl bg-white shadow-sm border border-gray-100 p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center mb-1">
                  <span className="text-lg mr-2">{s.icon}</span>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{s.delta}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Dashboard Content */}
      <section className="max-w-6xl mx-auto px-6 mt-10 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Profile Completeness Meter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Profile Completeness</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  profileCompleteness === 100 ? 'bg-green-100 text-green-800' :
                  profileCompleteness >= 75 ? 'bg-blue-100 text-blue-800' :
                  profileCompleteness >= 50 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {profileCompleteness}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    profileCompleteness === 100 ? 'bg-green-500' :
                    profileCompleteness >= 75 ? 'bg-blue-500' :
                    profileCompleteness >= 50 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${profileCompleteness}%` }}
                ></div>
              </div>
              {profileCompleteness < 100 && (
                <p className="text-sm text-gray-600">
                  Complete your profile to attract more clients. 
                  {profileStatus !== 'approved' && (
                    <Link to="/complete-profile" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                      Complete Profile →
                    </Link>
                  )}
                </p>
              )}
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
              </div>
              <div className="space-y-3">
                {upcomingSessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{session.client}</p>
                        <p className="text-sm text-gray-500">{session.type} • {session.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{session.date}</p>
                      <p className="text-sm text-gray-500">{session.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Earnings Overview</h3>
                <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-600 font-medium">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-900">$3,240</p>
                  <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-600 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-blue-900">$840</p>
                  <p className="text-xs text-blue-600 mt-1">3 sessions</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Video consultations</span>
                  <span className="font-medium">$2,100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phone consultations</span>
                  <span className="font-medium">$800</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">In-person meetings</span>
                  <span className="font-medium">$340</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            
            {/* Notifications */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {notifications.filter(n => !n.read).length}
                </span>
              </div>
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div key={notification.id} className={`p-3 rounded-lg border ${
                    !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {notification.type === 'request' && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        )}
                        {notification.type === 'approval' && (
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        )}
                        {notification.type === 'message' && (
                          <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                View All Notifications
              </button>
            </div>

            {/* Ratings & Reviews Snapshot */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ratings & Reviews</h3>
                <Link to="/consultant-profile#reviews" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
              </div>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-900">4.8</div>
                <div className="flex items-center justify-center mt-1">
                  {[1,2,3,4,5].map(star => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">Based on 24 reviews</p>
              </div>
              <div className="space-y-2">
                {recentReviews.slice(0, 2).map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-2 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{review.client}</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <svg key={star} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{review.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Schedule New Session
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  Update Availability
                </button>
                <Link to="/consultant-profile" className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium inline-block text-center">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
