import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';

export default function UserSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Email OTP verification only
    email: '',
    emailOtp: '',
    emailVerified: false,
    
    // Step 2: Profile creation
    name: '',
    interests: [],
    domainNeeds: '',
    
    // Step 3: Onboarding survey (optional)
    budgetRange: '',
    experienceLevel: '',
    consultationType: [],
    preferredTimezone: '',
    additionalNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  const interests = [
    'Technology', 'Business Strategy', 'Marketing', 'Finance', 
    'Human Resources', 'Legal', 'Design', 'Sales',
    'Product Management', 'Data Science', 'Leadership', 'Operations'
  ];

  const consultationTypes = [
    'Career Guidance', 'Business Strategy', 'Technical Consulting',
    'Financial Planning', 'Marketing Strategy', 'Leadership Coaching'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleConsultationTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      consultationType: prev.consultationType.includes(type)
        ? prev.consultationType.filter(t => t !== type)
        : [...prev.consultationType, type]
    }));
  };

  const sendEmailOtp = () => {
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
      return;
    }
    
    // Simulate sending OTP
    setEmailOtpSent(true);
    alert(`OTP sent to ${formData.email}`);
  };

  const verifyEmailOtp = () => {
    if (formData.emailOtp.trim() === '') {
      setErrors(prev => ({ ...prev, emailOtp: 'Please enter OTP' }));
      return;
    }
    
    // Accept any value as valid OTP for demo
    setFormData(prev => ({ ...prev, emailVerified: true }));
    alert('Email verified successfully!');
  };

  const validateStep1 = () => {
    const errs = {};
    
    if (!formData.email) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    
    if (!formData.emailVerified) {
      errs.emailOtp = 'Please verify your email address';
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    
    if (!formData.name) {
      errs.name = 'Name is required';
    }
    
    if (formData.interests.length === 0) {
      errs.interests = 'Please select at least one interest';
    }
    
    if (!formData.domainNeeds) {
      errs.domainNeeds = 'Please describe your domain needs';
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 3) {
      // Save user data to localStorage
      localStorage.setItem('userData', JSON.stringify(formData));
      console.log('User registration data:', formData);
      
      alert('Registration successful! Welcome to Consultancy.co');
      navigate('/user/dashboard');
    } else {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link to="/" className="flex justify-center">
            <span className="text-3xl font-bold text-blue-600">consultancy.co</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign Up as Client
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Connect with expert consultants for your business needs
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Step 1: Email Verification */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Verify Your Email Address</h3>
                
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex space-x-2 items-center">
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={sendEmailOtp}
                      disabled={formData.emailVerified}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm whitespace-nowrap flex-shrink-0"
                    >
                      {formData.emailVerified ? 'Verified' : 'Send OTP'}
                    </button>
                  </div>
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  
                  {emailOtpSent && !formData.emailVerified && (
                    <div className="flex space-x-2">
                      <Input
                        type="text"
                        name="emailOtp"
                        value={formData.emailOtp}
                        onChange={handleInputChange}
                        placeholder="Enter OTP (any value for demo)"
                      />
                      <button
                        type="button"
                        onClick={verifyEmailOtp}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                  {errors.emailOtp && <p className="text-red-500 text-xs">{errors.emailOtp}</p>}
                  <p className="text-xs text-gray-500">Demo: Enter any value as OTP to verify</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Profile Creation */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create Your Profile</h3>
                
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>

                {/* Interests */}
                <div className="space-y-2">
                  <Label>Areas of Interest</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {interests.map(interest => (
                      <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestToggle(interest)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{interest}</span>
                      </label>
                    ))}
                  </div>
                  {errors.interests && <p className="text-red-500 text-xs">{errors.interests}</p>}
                </div>

                {/* Domain Needs */}
                <div className="space-y-2">
                  <Label htmlFor="domainNeeds">Domain Needs</Label>
                  <Textarea
                    id="domainNeeds"
                    name="domainNeeds"
                    value={formData.domainNeeds}
                    onChange={handleInputChange}
                    placeholder="Describe your specific domain needs and what kind of consulting help you're looking for..."
                    rows={4}
                  />
                  {errors.domainNeeds && <p className="text-red-500 text-xs">{errors.domainNeeds}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Onboarding Survey */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Onboarding Survey (Optional)</h3>
                <p className="text-sm text-gray-600 mb-4">This helps us match you with the best consultants</p>
                
                {/* Budget Range */}
                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <Select value={formData.budgetRange} onValueChange={(value) => setFormData(prev => ({...prev, budgetRange: value}))}>
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

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label>Experience Level</Label>
                  <Select value={formData.experienceLevel} onValueChange={(value) => setFormData(prev => ({...prev, experienceLevel: value}))}>
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

                {/* Consultation Type */}
                <div className="space-y-2">
                  <Label>Preferred Consultation Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {consultationTypes.map(type => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consultationType.includes(type)}
                          onChange={() => handleConsultationTypeToggle(type)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <Label>Preferred Timezone</Label>
                  <Select value={formData.preferredTimezone} onValueChange={(value) => setFormData(prev => ({...prev, preferredTimezone: value}))}>
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

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    placeholder="Any additional information that would help us match you with the right consultant..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            )}
            
            <div className="flex space-x-3 ml-auto">
              <Link
                to="/"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {step === 3 ? 'Complete Registration' : 'Next'}
              </button>
            </div>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Demo OTP: 123456
          </p>
        </div>
      </div>
    </div>
  );
}
