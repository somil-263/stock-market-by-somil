import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { requestPasswordReset, resetPassword } from '../services/authService';

function ForgotPassword() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); 
  
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await requestPasswordReset(formData.email);
      setStep(2);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await resetPassword(formData);
      alert("Password Reset Successfully! Now you can login");
      navigate('/login');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 selection:bg-indigo-500/30">
      <div className="bg-slate-900 p-10 rounded-3xl shadow-[0_20px_50px_rgba(31,41,55,0.7)] w-full max-w-md border border-slate-800 transition-all duration-300 hover:border-indigo-800/50">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tighter mb-2">
            Reset <span className="text-indigo-400">Password</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm">
            {step === 1 
              ? "Enter your email and we'll send you an OTP." 
              : "Enter the 6-digit OTP and your new password."}
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <InputField 
              label="Registered Email Address" type="email" placeholder="somil@empire.com" 
              name="email" value={formData.email} onChange={handleChange} 
            />
            <div className="pt-2">
              <PrimaryButton type="submit" disabled={loading} text={loading ? 'Sending OTP...' : 'Send Reset OTP'} />
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <InputField 
              label="Enter 6-Digit OTP" type="text" placeholder="123456" 
              name="otp" value={formData.otp} onChange={handleChange} 
            />
            <InputField 
              label="New Password" type="password" placeholder="Create new password" 
              name="newPassword" value={formData.newPassword} onChange={handleChange} 
            />
            <div className="pt-2">
              <PrimaryButton type="submit" disabled={loading} text={loading ? 'Updating...' : 'Set New Password'} />
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Remember your password?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Back to Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;