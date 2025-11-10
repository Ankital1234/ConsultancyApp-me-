import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from '../components/Select';
import Modal from '../components/Modal';

export default function ConsultantRegistration(){
  const navigate = useNavigate();
  const [companyVersion, setCompanyVersion] = useState(0);
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    qualification: '',
    industry: '',
    consultantType: 'Individual',
    organization: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [pending, setPending] = useState(false);

  function handleChange(e){
    const { name, value } = e.target;
    setForm(prev => ({...prev, [name]: value}));
    if(name === 'organization' && value === 'Others'){
      setShowOrgModal(true);
    }
  }

  function validate(){
    const errs = {};
    if(!form.fullName) errs.fullName = 'Required';
    if(!form.phone) errs.phone = 'Required';
    if(!form.qualification) errs.qualification = 'Required';
    if(!form.industry) errs.industry = 'Required';
    if(!form.email) errs.email = 'Required';
    if(!form.password) errs.password = 'Required';
    if(form.password && form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if(form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if(form.consultantType === 'Organized' && !form.organization) errs.organization = 'Please select an organization';
    return errs;
  }

  function handleSubmit(e){
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if(Object.keys(v).length === 0){
      // persist locally
      localStorage.setItem('consultantForm', JSON.stringify(form));
      localStorage.setItem('consultantStatus', 'pending');
      console.log('Submitting consultant registration for admin approval', form);
      setPending(true);
      navigate('/consultant/dashboard');
    }
  }

  // Companies list from localStorage including pending with suffix
  const companyOptions = useMemo(() => {
    const defaults = ["CGI","Infosys","Wipro","Bosch"];
    const saved = JSON.parse(localStorage.getItem('companies') || '[]');
    const pendings = JSON.parse(localStorage.getItem('pendingCompanies') || '[]');
    const base = saved.length ? saved : defaults;
    const pendingLabeled = pendings.map(name => `${name} (waiting for admin approval)`);
    const combined = [...new Set([...base, ...pendingLabeled])];
    combined.push('Others');
    return combined;
  }, [companyVersion]);

  useEffect(() => {
    // auto select last added pending company if exists
    const lastPending = localStorage.getItem('lastAddedCompanyPending');
    if(lastPending){
      setForm(prev => ({...prev, organization: `${lastPending} (waiting for admin approval)`}));
      localStorage.removeItem('lastAddedCompanyPending');
    } else {
      // fallback to last normal company
      const last = localStorage.getItem('lastAddedCompany');
      if(last){
        setForm(prev => ({...prev, organization: last}));
        localStorage.removeItem('lastAddedCompany');
      }
    }
    // listen to storage changes from other tabs
    function onStorage(ev){
      if(ev.key === 'companies' || ev.key === 'pendingCompanies'){
        // bump version to recompute options
        setCompanyVersion(v => v + 1);
      }
    }
    window.addEventListener('storage', onStorage);
    // also bump once on mount to ensure reading latest localStorage
    setCompanyVersion(v => v + 1);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 flex items-start">
      <div className="max-w-2xl mx-auto w-full px-6">
        <button onClick={() => navigate(-1)} className="-mt-2 mb-4 inline-flex items-center text-gray-600 hover:text-gray-800 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="ml-2">Back</span>
        </button>
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 text-blue-700 rounded-full p-3 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m-6 4h20" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-1">Consultant Registration</h2>
          <p className="text-center text-gray-500 mb-6">Enter your email and create a secure password</p>
          <div className="border-t mb-6" />

          {pending && (
            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
              Verification is pending. Your details have been submitted for admin approval.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700">Full Name <span className="text-red-500">*</span></label>
                <input name="fullName" value={form.fullName} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded px-3 py-2" placeholder="Your name" />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded px-3 py-2" placeholder="Enter phone" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-700">Qualification <span className="text-red-500">*</span></label>
                <input name="qualification" value={form.qualification} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded px-3 py-2" placeholder="e.g., B.Tech, MBA" />
              </div>

              <div>
                <label className="block text-sm text-gray-700">Industry <span className="text-red-500">*</span></label>
                <input name="industry" value={form.industry} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded px-3 py-2" placeholder="e.g., IT, Consulting" />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Consultant Type</label>
              <div className="flex items-center gap-6">
                <label className="inline-flex items-center">
                  <input type="radio" name="consultantType" value="Organized" checked={form.consultantType === 'Organized'} onChange={handleChange} className="form-radio" />
                  <span className="ml-2 text-sm">Organized</span>
                </label>
                <label className="inline-flex items-center">
                  <input type="radio" name="consultantType" value="Individual" checked={form.consultantType === 'Individual'} onChange={handleChange} className="form-radio" />
                  <span className="ml-2 text-sm">Individual</span>
                </label>
              </div>
              {form.consultantType === 'Organized' && (
                <div className="mt-4">
                  <label className="block text-sm text-gray-700 mb-1">Organization</label>
                  <Select
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    placeholder="Select organization"
                    options={companyOptions}
                  />
                  {errors.organization && <p className="text-red-500 text-xs mt-1">{errors.organization}</p>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-700">Email Address <span className="text-red-500">*</span></label>
              <input name="email" value={form.email} onChange={handleChange} className="mt-1 block w-full border border-gray-200 rounded px-3 py-2" placeholder="your.email@example.com" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input name="password" value={form.password} onChange={handleChange} type={showPwd ? 'text' : 'password'} className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 pr-10" placeholder="Create a strong password" />
                <button type="button" onClick={() => setShowPwd(v => !v)} aria-label="Toggle password visibility" className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700">
                  {showPwd ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3.94 4.94a.75.75 0 011.06 0l10.06 10.06a.75.75 0 11-1.06 1.06l-1.56-1.56A9.58 9.58 0 0110 15.75c-3.822 0-7.093-2.292-8.66-5.62a1.9 1.9 0 010-1.26 10.917 10.917 0 013.332-4.147l-.732-.733zM12.94 11.88l-1.63-1.63a2.5 2.5 0 01-3.56-3.56L6.06 4.94A9.55 9.55 0 0010 4.25c3.822 0 7.093 2.292 8.66 5.62.218.458.218.982 0 1.44-.81 1.702-2.115 3.132-3.72 4.13l-2-2z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.75c-3.822 0-7.093 2.292-8.66 5.62a1.9 1.9 0 000 1.26C2.907 13.958 6.178 16.25 10 16.25s7.093-2.292 8.66-5.62c.218-.458.218-.982 0-1.44C17.093 6.042 13.822 3.75 10 3.75zm0 8a3.25 3.25 0 110-6.5 3.25 3.25 0 010 6.5z"/></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

              <ul className="text-xs text-gray-500 mt-2 list-disc pl-5">
                <li>At least 8 characters</li>
                <li>One uppercase letter</li>
                <li>One number</li>
                <li>One special character</li>
              </ul>
            </div>

            <div>
              <label className="block text-sm text-gray-700">Confirm Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <input name="confirmPassword" value={form.confirmPassword} onChange={handleChange} type={showConfirmPwd ? 'text' : 'password'} className="mt-1 block w-full border border-gray-200 rounded px-3 py-2 pr-10" placeholder="Re-enter your password" />
                <button type="button" onClick={() => setShowConfirmPwd(v => !v)} aria-label="Toggle confirm password visibility" className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700">
                  {showConfirmPwd ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3.94 4.94a.75.75 0 011.06 0l10.06 10.06a.75.75 0 11-1.06 1.06l-1.56-1.56A9.58 9.58 0 0110 15.75c-3.822 0-7.093-2.292-8.66-5.62a1.9 1.9 0 010-1.26 10.917 10.917 0 013.332-4.147l-.732-.733zM12.94 11.88l-1.63-1.63a2.5 2.5 0 01-3.56-3.56L6.06 4.94A9.55 9.55 0 0010 4.25c3.822 0 7.093 2.292 8.66 5.62.218.458.218.982 0 1.44-.81 1.702-2.115 3.132-3.72 4.13l-2-2z"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.75c-3.822 0-7.093 2.292-8.66 5.62a1.9 1.9 0 000 1.26C2.907 13.958 6.178 16.25 10 16.25s7.093-2.292 8.66-5.62c.218-.458.218-.982 0-1.44C17.093 6.042 13.822 3.75 10 3.75zm0 8a3.25 3.25 0 110-6.5 3.25 3.25 0 010 6.5z"/></svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <button type="submit" disabled={pending} className={`w-full font-semibold px-4 py-2 rounded ${pending ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                Submit for Admin Approval
              </button>
            </div>

            <p className="text-center text-sm text-gray-500">Already have an account? <a className="text-blue-600 hover:underline" onClick={() => navigate('/login')}>Sign In</a></p>
          </form>
        </div>
      </div>
      <Modal
        open={showOrgModal}
        onClose={() => setShowOrgModal(false)}
        title="Register your company"
        footer={(
          <>
            <button
              onClick={() => setShowOrgModal(false)}
              className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => { window.open('/company/register', '_blank', 'noopener'); setShowOrgModal(false); }}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Open Registration Page
            </button>
          </>
        )}
      >
        <p>To continue, please register your company.</p>
      </Modal>
    </div>
  );
}
