import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    consultant: '',
    date: '',
    time: '',
    sessionType: 'video',
    paymentMethod: 'credits',
    notes: ''
  });

  const [userCredits, setUserCredits] = useState(500);
  const [bookingHistory, setBookingHistory] = useState([
    {
      id: 1,
      consultant: 'Dr. Sarah Johnson',
      domain: 'Business Strategy',
      date: '2024-12-10',
      time: '10:00 AM',
      duration: '45 min',
      type: 'Phone Call',
      status: 'upcoming',
      payment: 'card',
      amount: '$75'
    },
    {
      id: 2,
      consultant: 'Mike Chen',
      domain: 'Technology Consulting',
      date: '2024-12-08',
      time: '2:00 PM',
      duration: '1 hour',
      type: 'Video Call',
      status: 'completed',
      payment: 'credits',
      amount: '80 credits'
    },
    {
      id: 3,
      consultant: 'Emily Davis',
      domain: 'Marketing Strategy',
      date: '2024-12-15',
      time: '3:30 PM',
      duration: '2 hours',
      type: 'In-Person',
      status: 'upcoming',
      payment: 'credits',
      amount: '150 credits'
    }
  ]);

  const [referralStatus] = useState([
    {
      id: 1,
      referredTo: 'John Smith',
      email: 'john.smith@example.com',
      date: '2024-12-01',
      status: 'completed',
      reward: '50 credits earned'
    },
    {
      id: 2,
      referredTo: 'Jane Doe',
      email: 'jane.doe@example.com',
      date: '2024-12-05',
      status: 'pending',
      reward: 'Pending completion'
    },
    {
      id: 3,
      referredTo: 'Bob Wilson',
      email: 'bob.wilson@example.com',
      date: '2024-12-03',
      status: 'joined',
      reward: '25 credits pending'
    }
  ]);

  const [notifications] = useState([
    {
      id: 1,
      type: 'session_reminder',
      message: 'Session with Dr. Sarah Johnson tomorrow at 10:00 AM',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'offer',
      message: 'Special offer: Get 20% off on your next consultation',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'session_confirmation',
      message: 'Your session with Emily Davis has been confirmed',
      time: '2 days ago',
      read: true
    },
    {
      id: 4,
      type: 'referral_reward',
      message: 'You earned 50 credits from John Smith\'s first consultation',
      time: '3 days ago',
      read: true
    },
    {
      id: 5,
      type: 'session_reminder',
      message: 'Reschedule reminder for Mike Chen session',
      time: '5 days ago',
      read: true
    }
  ]);

  const [stats] = useState([
    { label: 'Total Sessions', value: '12', change: '+2 this month', icon: '📊' },
    { label: 'Total Spent', value: '$850', change: '+$150 this month', icon: '💰' },
    { label: 'Available Credits', value: userCredits, change: '+50 earned', icon: '💎' },
    { label: 'Saved Consultants', value: '8', change: '+3 this month', icon: '⭐' }
  ]);

  useEffect(() => {
    // Load user data
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    
    const newBooking = {
      id: bookingHistory.length + 1,
      consultant: bookingData.consultant,
      domain: 'Business Strategy',
      date: bookingData.date,
      time: bookingData.time,
      duration: '1 hour',
      type: bookingData.sessionType === 'video' ? 'Video Call' : 
            bookingData.sessionType === 'phone' ? 'Phone Call' : 'In-Person',
      status: 'upcoming',
      payment: bookingData.paymentMethod,
      amount: bookingData.paymentMethod === 'credits' ? '75 credits' : '$75'
    };

    setBookingHistory([newBooking, ...bookingHistory]);

    if (bookingData.paymentMethod === 'credits') {
      setUserCredits(userCredits - 75);
    }

    setShowBookingModal(false);
    setBookingData({
      consultant: '',
      date: '',
      time: '',
      sessionType: 'video',
      paymentMethod: 'credits',
      notes: ''
    });

    alert('Session booked successfully! You will receive a confirmation email shortly.');
  };

  const handleCancelSession = (sessionId) => {
    const session = bookingHistory.find(s => s.id === sessionId);
    if (session && session.payment === 'credits' && session.status === 'upcoming') {
      setUserCredits(userCredits + parseInt(session.amount));
    }
    
    setBookingHistory(bookingHistory.map(s => 
      s.id === sessionId ? { ...s, status: 'cancelled' } : s
    ));
    
    alert('Session cancelled successfully. Credits have been refunded to your account.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {userData?.name || 'User'}!
              </h1>
              <p className="text-blue-100 mt-2">
                Manage your consultations and track your progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/consultants"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
              >
                Find Consultants
              </Link>
              <div className="relative group">
                <Link
                  to="/user/profile"
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {userData?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {userData?.name || 'User'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <Link
                      to="/user/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/user/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={() => {
                        localStorage.removeItem('userData');
                        window.location.href = '/';
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                      <p className="text-xs text-green-600 mt-2">{stat.change}</p>
                    </div>
                    <div className="text-3xl">{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking & Scheduling */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Booking & Scheduling</h2>
                  <Button 
                    onClick={() => setShowBookingModal(true)}
                    variant="outline"
                    size="sm"
                  >
                    Request New Session
                  </Button>
                </div>
              </div>
              <div className="p-6">
                {/* Credits Overview */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Available Credits</p>
                      <p className="text-2xl font-bold text-blue-900">{userCredits} credits</p>
                      <p className="text-xs text-blue-700 mt-1">1 credit = $1 value</p>
                    </div>
                    <Button size="sm">
                      Buy More Credits
                    </Button>
                  </div>
                </div>

                {/* Booking History */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Recent Bookings</h3>
                  {bookingHistory.slice(0, 3).map(booking => (
                    <div key={booking.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                      booking.status === 'cancelled' ? 'bg-gray-50 border-gray-300' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{booking.consultant.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.consultant}</p>
                          <p className="text-sm text-gray-600">{booking.domain}</p>
                          <p className="text-xs text-gray-500">{booking.date} at {booking.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          booking.status === 'upcoming' ? 'bg-green-100 text-green-700' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {booking.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{booking.amount}</p>
                        {booking.status === 'upcoming' && (
                          <div className="mt-2 space-x-2">
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                              Reschedule
                            </button>
                            <button 
                              onClick={() => handleCancelSession(booking.id)}
                              className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4">
                  View Full Booking History
                </Button>
              </div>
            </div>

            {/* Referral Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Referral Status</h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Refer Friends
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {referralStatus.slice(0, 3).map(referral => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <span className="text-green-600 font-semibold">{referral.referredTo.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{referral.referredTo}</p>
                          <p className="text-sm text-gray-600">{referral.email}</p>
                          <p className="text-xs text-gray-500">Referred: {referral.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          referral.status === 'completed' ? 'bg-green-100 text-green-700' :
                          referral.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {referral.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{referral.reward}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Notifications & Quick Actions */}
          <div className="space-y-8">
            {/* Notifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {notifications.filter(n => !n.read).length}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`p-4 rounded-lg border ${
                      !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {notification.type === 'session_reminder' && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                          )}
                          {notification.type === 'offer' && (
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          )}
                          {notification.type === 'session_confirmation' && (
                            <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                          )}
                          {notification.type === 'referral_reward' && (
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
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <Button 
                  onClick={() => setShowBookingModal(true)}
                  className="w-full"
                >
                  Book New Session
                </Button>
                <Link to="/consultants">
                  <Button variant="outline" className="w-full">
                    Find Consultants
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  View Profile
                </Button>
                <Button variant="outline" className="w-full">
                  Help & Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Request New Session</h3>
                <button 
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Consultant Selection */}
                <div className="space-y-2">
                  <Label htmlFor="consultant">Select Consultant</Label>
                  <Select value={bookingData.consultant} onValueChange={(value) => setBookingData({...bookingData, consultant: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a consultant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson - Business Strategy</SelectItem>
                      <SelectItem value="Mike Chen">Mike Chen - Technology Consulting</SelectItem>
                      <SelectItem value="Emily Davis">Emily Davis - Marketing Strategy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label htmlFor="date">Select Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    required
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label htmlFor="time">Select Time</Label>
                  <Select value={bookingData.time} onValueChange={(value) => setBookingData({...bookingData, time: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                      <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                      <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Session Type */}
                <div className="space-y-2">
                  <Label htmlFor="sessionType">Session Type</Label>
                  <Select value={bookingData.sessionType} onValueChange={(value) => setBookingData({...bookingData, sessionType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select session type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="inperson">In-Person</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="credits"
                        value="credits"
                        checked={bookingData.paymentMethod === 'credits'}
                        onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <Label htmlFor="credits" className="text-sm font-normal">
                        Use Credits ({userCredits} credits available)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="card"
                        value="card"
                        checked={bookingData.paymentMethod === 'card'}
                        onChange={(e) => setBookingData({...bookingData, paymentMethod: e.target.value})}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <Label htmlFor="card" className="text-sm font-normal">
                        Pay per Session ($75)
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    placeholder="Any specific topics or questions for the consultant..."
                    rows={2}
                  />
                </div>

                {/* Reminder Settings */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="h-4 w-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-blue-900">Auto-Reminders Enabled</p>
                  </div>
                  <p className="text-xs text-blue-700">You'll receive reminders via email and WhatsApp 24 hours and 1 hour before your session.</p>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Book Session
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
