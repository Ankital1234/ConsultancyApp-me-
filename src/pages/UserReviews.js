import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function UserReviews() {
  const [activeTab, setActiveTab] = useState('write');
  const [userData, setUserData] = useState(null);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    consultantId: '',
    consultantName: '',
    rating: 5,
    sessionType: '',
    sessionDate: '',
    reviewTitle: '',
    reviewContent: '',
    wouldRecommend: true
  });

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

    // Load completed sessions (sessions that can be reviewed)
    const mockCompletedSessions = [
      {
        id: 1,
        consultant: 'Dr. Sarah Johnson',
        domain: 'Business Strategy',
        date: '2024-12-01',
        time: '2:00 PM',
        type: 'Video Call',
        status: 'completed',
        amount: '$75',
        canReview: true,
        reviewed: false
      },
      {
        id: 2,
        consultant: 'Mike Chen',
        domain: 'Technology Consulting',
        date: '2024-11-28',
        time: '10:00 AM',
        type: 'Phone Call',
        status: 'completed',
        amount: '$80',
        canReview: true,
        reviewed: true
      },
      {
        id: 3,
        consultant: 'Emily Davis',
        domain: 'Marketing Strategy',
        date: '2024-11-25',
        time: '3:30 PM',
        type: 'In-Person',
        status: 'completed',
        amount: '$70',
        canReview: true,
        reviewed: false
      }
    ];
    setCompletedSessions(mockCompletedSessions);

    // Load user's review history
    const mockUserReviews = [
      {
        id: 1,
        consultant: 'Mike Chen',
        consultantId: 'mike-chen',
        domain: 'Technology Consulting',
        rating: 5,
        title: 'Excellent Technical Advice',
        content: 'Mike provided outstanding insights on our cloud migration strategy. His expertise was evident throughout the session.',
        date: '2024-11-28',
        sessionType: 'Phone Call',
        wouldRecommend: true,
        helpful: 12,
        status: 'approved'
      },
      {
        id: 2,
        consultant: 'Dr. Sarah Johnson',
        consultantId: 'sarah-johnson',
        domain: 'Business Strategy',
        rating: 4,
        title: 'Very Helpful Business Planning',
        content: 'Great session on business strategy. Dr. Johnson was knowledgeable and provided actionable recommendations.',
        date: '2024-11-15',
        sessionType: 'Video Call',
        wouldRecommend: true,
        helpful: 8,
        status: 'approved'
      }
    ];
    setUserReviews(mockUserReviews);
  }, []);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    const newReview = {
      id: userReviews.length + 1,
      consultant: reviewForm.consultantName,
      consultantId: reviewForm.consultantId,
      domain: 'Business Strategy',
      rating: reviewForm.rating,
      title: reviewForm.reviewTitle,
      content: reviewForm.reviewContent,
      date: new Date().toISOString().split('T')[0],
      sessionType: reviewForm.sessionType,
      wouldRecommend: reviewForm.wouldRecommend,
      helpful: 0,
      status: 'pending' // Reviews are moderated by admin
    };

    setUserReviews([newReview, ...userReviews]);
    
    // Mark session as reviewed
    setCompletedSessions(completedSessions.map(session => 
      session.consultant === reviewForm.consultantName 
        ? { ...session, reviewed: true }
        : session
    ));

    // Reset form
    setReviewForm({
      consultantId: '',
      consultantName: '',
      rating: 5,
      sessionType: '',
      sessionDate: '',
      reviewTitle: '',
      reviewContent: '',
      wouldRecommend: true
    });

    alert('Review submitted successfully! It will be visible after admin approval.');
  };

  const handleSessionSelect = (session) => {
    setReviewForm({
      ...reviewForm,
      consultantId: session.consultant.toLowerCase().replace(' ', '-'),
      consultantName: session.consultant,
      sessionType: session.type,
      sessionDate: session.date
    });
  };

  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : "button"}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : null}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <span className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>
              ★
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reviews & Ratings</h1>
              <p className="text-blue-100 mt-2">
                Rate consultants post-session and view your review history
              </p>
            </div>
            <Link to="/user/dashboard">
              <Button variant="outline" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('write')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'write'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Write Review
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Review History
              </button>
            </nav>
          </div>
        </div>

        {/* Write Review Tab */}
        {activeTab === 'write' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sessions to Review */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Completed Sessions</h2>
                  <p className="text-sm text-gray-600 mt-1">Select a session to review</p>
                </div>
                <div className="p-6">
                  {completedSessions.filter(session => !session.reviewed).length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">✅</div>
                      <p className="text-gray-600">No pending reviews</p>
                      <p className="text-sm text-gray-500 mt-2">You've reviewed all your completed sessions</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {completedSessions.filter(session => !session.reviewed).map((session) => (
                        <div
                          key={session.id}
                          onClick={() => handleSessionSelect(session)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            reviewForm.consultantName === session.consultant
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900">{session.consultant}</p>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Can Review
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{session.domain}</p>
                          <p className="text-xs text-gray-500 mt-1">{session.date} at {session.time}</p>
                          <p className="text-sm font-medium text-blue-600 mt-2">{session.amount}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Review Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Write Your Review</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {reviewForm.consultantName 
                      ? `Reviewing ${reviewForm.consultantName}`
                      : 'Select a session from the left to start reviewing'
                    }
                  </p>
                </div>
                <div className="p-6">
                  {!reviewForm.consultantName ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Session Selected</h3>
                      <p className="text-gray-600">Choose a completed session from the left to write a review</p>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                      {/* Consultant Info */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {reviewForm.consultantName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{reviewForm.consultantName}</p>
                            <p className="text-sm text-gray-600">{reviewForm.sessionType} • {reviewForm.sessionDate}</p>
                          </div>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="space-y-2">
                        <Label>Overall Rating</Label>
                        <div className="flex items-center space-x-4">
                          {renderStars(reviewForm.rating, true, (rating) => 
                            setReviewForm({...reviewForm, rating})
                          )}
                          <span className="text-sm text-gray-600">
                            {reviewForm.rating === 5 && 'Excellent'}
                            {reviewForm.rating === 4 && 'Very Good'}
                            {reviewForm.rating === 3 && 'Good'}
                            {reviewForm.rating === 2 && 'Fair'}
                            {reviewForm.rating === 1 && 'Poor'}
                          </span>
                        </div>
                      </div>

                      {/* Review Title */}
                      <div className="space-y-2">
                        <Label htmlFor="reviewTitle">Review Title</Label>
                        <Input
                          id="reviewTitle"
                          value={reviewForm.reviewTitle}
                          onChange={(e) => setReviewForm({...reviewForm, reviewTitle: e.target.value})}
                          placeholder="Summarize your experience in a few words"
                          required
                        />
                      </div>

                      {/* Review Content */}
                      <div className="space-y-2">
                        <Label htmlFor="reviewContent">Your Review</Label>
                        <Textarea
                          id="reviewContent"
                          value={reviewForm.reviewContent}
                          onChange={(e) => setReviewForm({...reviewForm, reviewContent: e.target.value})}
                          placeholder="Share details about your consultation experience. What did you find helpful? What could be improved?"
                          rows={6}
                          required
                        />
                        <p className="text-xs text-gray-500">
                          Minimum 50 characters. Your review will be moderated by admin before being published.
                        </p>
                      </div>

                      {/* Would Recommend */}
                      <div className="space-y-2">
                        <Label>Would you recommend this consultant?</Label>
                        <div className="flex space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="recommend"
                              checked={reviewForm.wouldRecommend === true}
                              onChange={() => setReviewForm({...reviewForm, wouldRecommend: true})}
                              className="text-blue-600"
                            />
                            <span className="text-sm">Yes, I would recommend</span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="recommend"
                              checked={reviewForm.wouldRecommend === false}
                              onChange={() => setReviewForm({...reviewForm, wouldRecommend: false})}
                              className="text-blue-600"
                            />
                            <span className="text-sm">No, I would not recommend</span>
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setReviewForm({
                            consultantId: '',
                            consultantName: '',
                            rating: 5,
                            sessionType: '',
                            sessionDate: '',
                            reviewTitle: '',
                            reviewContent: '',
                            wouldRecommend: true
                          })}
                        >
                          Clear
                        </Button>
                        <Button type="submit">
                          Submit Review
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{userReviews.length}</p>
                  </div>
                  <div className="text-3xl">⭐</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {userReviews.length > 0 
                        ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
                        : '0.0'
                      }
                    </p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Helpful Votes</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {userReviews.reduce((sum, review) => sum + review.helpful, 0)}
                    </p>
                  </div>
                  <div className="text-3xl">👍</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Recommend Rate</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {userReviews.length > 0 
                        ? Math.round((userReviews.filter(review => review.wouldRecommend).length / userReviews.length) * 100)
                        : 0
                    }%
                    </p>
                  </div>
                  <div className="text-3xl">🎯</div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Your Review History</h2>
              </div>
              <div className="p-6">
                {userReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-600 mb-4">You haven't written any reviews yet</p>
                    <Button onClick={() => setActiveTab('write')}>
                      Write Your First Review
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userReviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">
                                {review.consultant.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{review.consultant}</p>
                              <p className="text-sm text-gray-600">{review.domain}</p>
                              <p className="text-xs text-gray-500 mt-1">{review.date} • {review.sessionType}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              review.status === 'approved' ? 'bg-green-100 text-green-700' :
                              review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {review.status === 'approved' && 'Published'}
                              {review.status === 'pending' && 'Pending Review'}
                              {review.status === 'rejected' && 'Rejected'}
                            </span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-gray-600">({review.rating}.0)</span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
                          <p className="text-gray-700">{review.content}</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600">Would recommend:</span>
                              <span className={`text-sm font-medium ${review.wouldRecommend ? 'text-green-600' : 'text-red-600'}`}>
                                {review.wouldRecommend ? 'Yes' : 'No'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-sm text-gray-600">Helpful:</span>
                              <span className="text-sm font-medium text-gray-900">{review.helpful}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
