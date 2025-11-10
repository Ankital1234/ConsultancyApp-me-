import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function UserProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    company: '',
    jobTitle: '',
    interests: [],
    domainNeeds: '',
    budgetRange: '',
    experienceLevel: '',
    consultationType: [],
    preferredTimezone: '',
    additionalNotes: '',
    profilePhoto: null,
    linkedinProfile: '',
    website: ''
  });

  useEffect(() => {
    // Load user data from localStorage
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setProfileData(parsedUser);
        setEditForm({
          ...editForm,
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          bio: parsedUser.bio || '',
          location: parsedUser.location || '',
          company: parsedUser.company || '',
          jobTitle: parsedUser.jobTitle || '',
          interests: parsedUser.interests || [],
          domainNeeds: parsedUser.domainNeeds || '',
          budgetRange: parsedUser.budgetRange || '',
          experienceLevel: parsedUser.experienceLevel || '',
          consultationType: parsedUser.consultationType || [],
          preferredTimezone: parsedUser.preferredTimezone || '',
          additionalNotes: parsedUser.additionalNotes || '',
          profilePhoto: parsedUser.profilePhoto || null,
          linkedinProfile: parsedUser.linkedinProfile || '',
          website: parsedUser.website || ''
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const calculateProfileCompleteness = () => {
    if (!profileData) return 0;
    
    const fields = [
      'name', 'email', 'phone', 'bio', 'location', 'company', 'jobTitle',
      'interests', 'domainNeeds', 'budgetRange', 'experienceLevel',
      'consultationType', 'preferredTimezone', 'profilePhoto', 'linkedinProfile'
    ];
    
    const completedFields = fields.filter(field => {
      const value = profileData[field];
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== '';
    });
    
    return Math.round((completedFields.length / fields.length) * 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    const updatedProfile = { ...profileData, ...editForm };
    localStorage.setItem('userData', JSON.stringify(updatedProfile));
    setProfileData(updatedProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (profileData) {
      setEditForm({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        bio: profileData.bio || '',
        location: profileData.location || '',
        company: profileData.company || '',
        jobTitle: profileData.jobTitle || '',
        interests: profileData.interests || [],
        domainNeeds: profileData.domainNeeds || '',
        budgetRange: profileData.budgetRange || '',
        experienceLevel: profileData.experienceLevel || '',
        consultationType: profileData.consultationType || [],
        preferredTimezone: profileData.preferredTimezone || '',
        additionalNotes: profileData.additionalNotes || '',
        profilePhoto: profileData.profilePhoto || null,
        linkedinProfile: profileData.linkedinProfile || '',
        website: profileData.website || ''
      });
    }
    setIsEditing(false);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const interests = ['Business Strategy', 'Technology', 'Marketing', 'Finance', 'HR', 'Operations', 'Sales', 'Legal'];
  const consultationTypes = ['Video Call', 'Phone Call', 'In-Person', 'Email Consultation'];

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Profile Found</h2>
          <p className="text-gray-600 mb-6">Please complete your registration to create a profile</p>
          <Link to="/user-signup">
            <Button>Complete Registration</Button>
          </Link>
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
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-blue-100 mt-2">Manage your personal information and preferences</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Profile Photo */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <Avatar className="h-24 w-24 mx-auto">
                    {editForm.profilePhoto ? (
                      <AvatarImage src={editForm.profilePhoto} alt={editForm.name} />
                    ) : (
                      <AvatarFallback className="text-2xl bg-blue-600 text-white">
                        {editForm.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                      />
                    </label>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mt-4">{editForm.name}</h2>
                <p className="text-gray-600">{editForm.jobTitle}</p>
                <p className="text-sm text-gray-500">{editForm.company}</p>
              </div>

              {/* Profile Completeness */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Profile Completeness</span>
                  <span className="text-sm font-bold text-blue-600">{calculateProfileCompleteness()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateProfileCompleteness()}%` }}
                  ></div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">Dec 2024</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Total Sessions</span>
                  <span className="text-sm font-medium text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile} className="w-full">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit} className="w-full">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="w-full">
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              </div>
              <div className="p-6">
                {isEditing ? (
                  <form className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={editForm.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={editForm.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            name="location"
                            value={editForm.location}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Professional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            name="company"
                            value={editForm.company}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input
                            id="jobTitle"
                            name="jobTitle"
                            value={editForm.jobTitle}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={editForm.bio}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="Tell us about yourself and your professional background..."
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Social Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
                          <Input
                            id="linkedinProfile"
                            name="linkedinProfile"
                            value={editForm.linkedinProfile}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            value={editForm.website}
                            onChange={handleInputChange}
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Consultation Preferences</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Areas of Interest</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {interests.map(interest => (
                              <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editForm.interests.includes(interest)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setEditForm(prev => ({ ...prev, interests: [...prev.interests, interest] }));
                                    } else {
                                      setEditForm(prev => ({ ...prev, interests: prev.interests.filter(i => i !== interest) }));
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{interest}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="budgetRange">Budget Range</Label>
                            <Select value={editForm.budgetRange} onValueChange={(value) => setEditForm(prev => ({ ...prev, budgetRange: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0-100">Under $100</SelectItem>
                                <SelectItem value="100-500">$100 - $500</SelectItem>
                                <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                                <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
                                <SelectItem value="5000+">$5,000+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="experienceLevel">Experience Level</Label>
                            <Select value={editForm.experienceLevel} onValueChange={(value) => setEditForm(prev => ({ ...prev, experienceLevel: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                                <SelectItem value="expert">Expert</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Preferred Consultation Types</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {consultationTypes.map(type => (
                              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editForm.consultationType.includes(type)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setEditForm(prev => ({ ...prev, consultationType: [...prev.consultationType, type] }));
                                    } else {
                                      setEditForm(prev => ({ ...prev, consultationType: prev.consultationType.filter(t => t !== type) }));
                                    }
                                  }}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{type}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="preferredTimezone">Preferred Timezone</Label>
                          <Select value={editForm.preferredTimezone} onValueChange={(value) => setEditForm(prev => ({ ...prev, preferredTimezone: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                              <SelectItem value="CST">Central Time (CST)</SelectItem>
                              <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                              <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                              <SelectItem value="IST">India Standard Time (IST)</SelectItem>
                              <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="additionalNotes">Additional Notes</Label>
                          <Textarea
                            id="additionalNotes"
                            name="additionalNotes"
                            value={editForm.additionalNotes}
                            onChange={handleInputChange}
                            rows={3}
                            placeholder="Any additional information that would help us match you with the right consultant..."
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium text-gray-900">{profileData.name || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email Address</p>
                          <p className="font-medium text-gray-900">{profileData.email || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone Number</p>
                          <p className="font-medium text-gray-900">{profileData.phone || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium text-gray-900">{profileData.location || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Professional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Company</p>
                          <p className="font-medium text-gray-900">{profileData.company || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Job Title</p>
                          <p className="font-medium text-gray-900">{profileData.jobTitle || 'Not specified'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Bio</p>
                        <p className="text-gray-900 leading-relaxed">{profileData.bio || 'No bio provided'}</p>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Social Links</h3>
                      <div className="space-y-3">
                        {profileData.linkedinProfile && (
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm">in</span>
                            </div>
                            <a href={profileData.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                        {profileData.website && (
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-sm">🌐</span>
                            </div>
                            <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                              Website
                            </a>
                          </div>
                        )}
                        {!profileData.linkedinProfile && !profileData.website && (
                          <p className="text-gray-500">No social links provided</p>
                        )}
                      </div>
                    </div>

                    {/* Preferences */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">Consultation Preferences</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Areas of Interest</p>
                          <div className="flex flex-wrap gap-2">
                            {profileData.interests?.length > 0 ? (
                              profileData.interests.map(interest => (
                                <span key={interest} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                  {interest}
                                </span>
                              ))
                            ) : (
                              <p className="text-gray-500">No interests specified</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-600">Budget Range</p>
                            <p className="font-medium text-gray-900">
                              {profileData.budgetRange ? `$${profileData.budgetRange}` : 'Not specified'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Experience Level</p>
                            <p className="font-medium text-gray-900 capitalize">{profileData.experienceLevel || 'Not specified'}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">Preferred Consultation Types</p>
                          <div className="flex flex-wrap gap-2">
                            {profileData.consultationType?.length > 0 ? (
                              profileData.consultationType.map(type => (
                                <span key={type} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                  {type}
                                </span>
                              ))
                            ) : (
                              <p className="text-gray-500">No preferences specified</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600">Preferred Timezone</p>
                          <p className="font-medium text-gray-900">{profileData.preferredTimezone || 'Not specified'}</p>
                        </div>

                        {profileData.additionalNotes && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Additional Notes</p>
                            <p className="text-gray-900 leading-relaxed">{profileData.additionalNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
