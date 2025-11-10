import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import Calendar from '../components/Calendar';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Profile Creation
    displayName: '',
    domain: '',
    bio: '',
    experience: '',
    linkedinProfile: '',
    
    // Documents
    profilePhoto: null,
    aadharCard: null,
    panCard: null,
    addressProof: null,
    addressProofType: 'utility',
    degreeCertificate: null,
    resume: null,
    consultingLicense: null,
    achievementCertificates: [],
    
    // Pricing
    hourlyRate: '',
    sessionRate: '',
    currency: 'USD',
    
    // Availability
    availableDays: [],
    timeSlots: [],
    timezone: 'UTC'
  });
  
  const [previewImages, setPreviewImages] = useState({
    profilePhoto: null
  });
  
  const [errors, setErrors] = useState({});
  const [showCalendar, setShowCalendar] = useState(false);
  
  const fileInputRefs = {
    profilePhoto: useRef(),
    aadharCard: useRef(),
    panCard: useRef(),
    addressProof: useRef(),
    degreeCertificate: useRef(),
    resume: useRef(),
    consultingLicense: useRef()
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field, file) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file
      }));
      
      if (field === 'profilePhoto') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImages(prev => ({
            ...prev,
            profilePhoto: reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAchievementCertificateChange = (index, file) => {
    const newCertificates = [...formData.achievementCertificates];
    newCertificates[index] = file;
    setFormData(prev => ({
      ...prev,
      achievementCertificates: newCertificates
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { start: '', end: '' }]
    }));
  };

  const updateTimeSlot = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }));
  };

  const addAchievementCertificate = () => {
    setFormData(prev => ({
      ...prev,
      achievementCertificates: [...prev.achievementCertificates, null]
    }));
  };

  const removeAchievementCertificate = (index) => {
    const newCertificates = formData.achievementCertificates.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      achievementCertificates: newCertificates
    }));
  };

  const validate = () => {
    const errs = {};
    // Profile Creation
    if (!formData.displayName) errs.displayName = 'Required';
    if (!formData.domain) errs.domain = 'Required';
    if (!formData.bio) errs.bio = 'Required';
    if (!formData.experience) errs.experience = 'Required';
    
    // Pricing
    if (!formData.hourlyRate) errs.hourlyRate = 'Required';
    if (!formData.sessionRate) errs.sessionRate = 'Required';
    
    // Availability
    if (formData.availableDays.length === 0) errs.availableDays = 'Please select at least one available day';
    if (formData.timeSlots.length === 0) errs.timeSlots = 'Please add at least one time slot';
    
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length === 0) {
      // Store profile data in localStorage with approved status
      localStorage.setItem('consultantCompleteProfile', JSON.stringify(formData));
      localStorage.setItem('profileStatus', 'approved');
      localStorage.setItem('profileApproved', 'true');
      
      console.log('Profile completion data:', formData);
      
      // Show success message and redirect to consultant profile page
      alert('Profile created successfully! Your profile is now live and ready to receive clients.');
      navigate('/consultant-profile');
    }
  };

  const FileUploadCard = ({ title, description, accept, field, multiple = false, certificateIndex = null }) => (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-sky-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
          
          {field === 'profilePhoto' && previewImages.profilePhoto && (
            <div className="mt-3">
              <img 
                src={previewImages.profilePhoto} 
                alt="Profile preview" 
                className="w-20 h-20 rounded-full object-cover border-2 border-sky-200"
              />
            </div>
          )}
          
          {field !== 'profilePhoto' && (
            <div className="mt-2">
              {certificateIndex !== null ? (
                formData.achievementCertificates[certificateIndex] ? (
                  <span className="text-sm text-green-600 font-medium">
                    {formData.achievementCertificates[certificateIndex].name}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">No file selected</span>
                )
              ) : (
                formData[field] ? (
                  <span className="text-sm text-green-600 font-medium">
                    {formData[field].name}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">No file selected</span>
                )
              )}
            </div>
          )}
        </div>
        
        <input
          ref={certificateIndex !== null ? null : fileInputRefs[field]}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => {
            const file = e.target.files[0];
            if (certificateIndex !== null) {
              handleAchievementCertificateChange(certificateIndex, file);
            } else {
              handleFileChange(field, file);
            }
          }}
          className="hidden"
          id={certificateIndex !== null ? `certificate-${certificateIndex}` : undefined}
        />
        
        <button
          type="button"
          onClick={() => {
            if (certificateIndex !== null) {
              document.getElementById(`certificate-${certificateIndex}`).click();
            } else {
              fileInputRefs[field].current.click();
            }
          }}
          className="ml-4 px-3 py-1 text-sm bg-sky-50 text-sky-700 rounded-md hover:bg-sky-100 transition-colors"
        >
          Choose File
        </button>
        
        {certificateIndex !== null && (
          <button
            type="button"
            onClick={() => removeAchievementCertificate(certificateIndex)}
            className="ml-2 px-3 py-1 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/consultant/dashboard" className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Set up your professional profile to start consulting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Details Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Profile Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Display Name <span className="text-red-500">*</span></label>
                <input 
                  value={formData.displayName} 
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                  placeholder="How clients will see you" 
                />
                {errors.displayName && <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Domain/Expertise <span className="text-red-500">*</span></label>
                <input 
                  value={formData.domain} 
                  onChange={(e) => handleChange('domain', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                  placeholder="e.g., Software Development, Marketing, Finance" 
                />
                {errors.domain && <p className="text-red-500 text-xs mt-1">{errors.domain}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Professional Bio <span className="text-red-500">*</span></label>
                <textarea 
                  value={formData.bio} 
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                  placeholder="Tell clients about your expertise, background, and what you can help them with..." 
                />
                {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Years of Experience <span className="text-red-500">*</span></label>
                <input 
                  value={formData.experience} 
                  onChange={(e) => handleChange('experience', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                  placeholder="e.g., 5+ years, 10-15 years" 
                />
                {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">LinkedIn Profile URL</label>
                <input 
                  value={formData.linkedinProfile} 
                  onChange={(e) => handleChange('linkedinProfile', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                  placeholder="https://linkedin.com/in/yourprofile" 
                />
                <p className="text-xs text-gray-500 mt-1">Will be verified by admin after submission</p>
              </div>
            </div>
          </div>

          {/* Profile Photo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Profile Photo
            </h2>
            <FileUploadCard
              title="Upload Profile Photo"
              description="Upload a clear, professional photo of yourself"
              accept="image/*"
              field="profilePhoto"
            />
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
              Pricing Setup
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Currency</label>
                <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Hourly Rate <span className="text-red-500">*</span></label>
                <input 
                  value={formData.hourlyRate} 
                  onChange={(e) => handleChange('hourlyRate', e.target.value)}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                  placeholder="50" 
                />
                {errors.hourlyRate && <p className="text-red-500 text-xs mt-1">{errors.hourlyRate}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Session Rate <span className="text-red-500">*</span></label>
                <input 
                  value={formData.sessionRate} 
                  onChange={(e) => handleChange('sessionRate', e.target.value)}
                  type="number"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500" 
                  placeholder="150" 
                />
                {errors.sessionRate && <p className="text-red-500 text-xs mt-1">{errors.sessionRate}</p>}
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Available Timings
            </h2>
            
            <div className="space-y-6">
              {/* View Toggle */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Select your available days and configure time slots
                </p>
                <button
                  type="button"
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="px-4 py-2 bg-sky-50 text-sky-700 rounded-lg hover:bg-sky-100 transition-colors text-sm font-medium flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {showCalendar ? 'List View' : 'Calendar View'}
                </button>
              </div>

              {/* Calendar View */}
              {showCalendar ? (
                <div className="border border-gray-200 rounded-xl p-6">
                  <Calendar
                    selectedDays={formData.availableDays}
                    timeSlots={formData.timeSlots}
                    onDayClick={handleDayToggle}
                    onTimeSlotChange={updateTimeSlot}
                    onAddTimeSlot={addTimeSlot}
                    onRemoveTimeSlot={removeTimeSlot}
                  />
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Available Days <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-2">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => handleDayToggle(day)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            formData.availableDays.includes(day)
                              ? 'bg-sky-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                    {errors.availableDays && <p className="text-red-500 text-xs mt-1">{errors.availableDays}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Time Slots <span className="text-red-500">*</span></label>
                    <div className="space-y-2">
                      {formData.timeSlots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.start}
                            onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={slot.end}
                            onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                            className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={addTimeSlot}
                      className="mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                    >
                      Add Time Slot
                    </button>
                    {errors.timeSlots && <p className="text-red-500 text-xs mt-1">{errors.timeSlots}</p>}
                  </div>
                </div>
              )}

              {/* Timezone Selection (Common for both views) */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Timezone</label>
                <Select value={formData.timezone} onValueChange={(value) => handleChange('timezone', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">EST (Eastern Time)</SelectItem>
                    <SelectItem value="PST">PST (Pacific Time)</SelectItem>
                    <SelectItem value="IST">IST (India Standard Time)</SelectItem>
                    <SelectItem value="GMT">GMT (Greenwich Mean Time)</SelectItem>
                    <SelectItem value="CET">CET (Central European Time)</SelectItem>
                    <SelectItem value="JST">JST (Japan Standard Time)</SelectItem>
                    <SelectItem value="AEST">AEST (Australian Eastern Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Availability Summary */}
              {formData.availableDays.length > 0 && (
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                  <h4 className="font-semibold text-sky-900 mb-2">Availability Summary</h4>
                  <div className="text-sm text-sky-700">
                    <p>Available on {formData.availableDays.length} day(s): {formData.availableDays.join(', ')}</p>
                    <p>Time slots: {formData.timeSlots.length} configured</p>
                    <p>Timezone: {formData.timezone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Identity Documents */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Identity Verification
            </h2>
            <div className="space-y-4">
              <FileUploadCard
                title="Aadhar Card"
                description="Upload your Aadhar card (PDF or image)"
                accept="image/*,.pdf"
                field="aadharCard"
              />
              <FileUploadCard
                title="PAN Card"
                description="Upload your PAN card (PDF or image)"
                accept="image/*,.pdf"
                field="panCard"
              />
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Address Proof Type</label>
                <Select value={formData.addressProofType} onValueChange={(value) => handleChange('addressProofType', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select address proof type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utility">Utility Bill</SelectItem>
                    <SelectItem value="rent">Rent Agreement</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <FileUploadCard
                title="Address Proof"
                description={`Upload your ${formData.addressProofType === 'utility' ? 'utility bill' : formData.addressProofType === 'rent' ? 'rent agreement' : 'passport'}`}
                accept="image/*,.pdf"
                field="addressProof"
              />
            </div>
          </div>

          {/* Education & Qualifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Education & Qualifications
            </h2>
            <div className="space-y-4">
              <FileUploadCard
                title="Degree Certificate"
                description="Upload your highest degree certificate"
                accept="image/*,.pdf"
                field="degreeCertificate"
              />
              <FileUploadCard
                title="Resume/CV"
                description="Upload your updated resume"
                accept=".pdf,.doc,.docx"
                field="resume"
              />
              <FileUploadCard
                title="Consulting License"
                description="Upload your consulting license (if applicable)"
                accept="image/*,.pdf"
                field="consultingLicense"
              />
            </div>
          </div>

          {/* Achievement Certificates */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Achievement Certificates
            </h2>
            <p className="text-sm text-gray-600 mb-4">Add any certificates or achievements you've earned</p>
            
            <div className="space-y-3">
              {formData.achievementCertificates.map((certificate, index) => (
                <FileUploadCard
                  key={index}
                  title={`Certificate ${index + 1}`}
                  description="Upload achievement or certification document"
                  accept="image/*,.pdf"
                  field="achievementCertificate"
                  certificateIndex={index}
                />
              ))}
            </div>
            
            <button
              type="button"
              onClick={addAchievementCertificate}
              className="mt-4 w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-sky-400 hover:text-sky-600 transition-colors flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Another Certificate
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              to="/consultant/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              Create Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
