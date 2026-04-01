import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { verifyOTP } from '../services/authService';

function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const emailToVerify = location.state?.email || '';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailToVerify) {
        setError("Email not found. Please register again.");
        return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOTP({ email: emailToVerify, otp: otp });
      alert("Email Verified Successfully! 🎉 You can now Login.");
      navigate('/login');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-800 text-center">
        
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Verify <span className="text-indigo-400">Email</span>
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          We've sent a 6-digit OTP to <br/><span className="text-indigo-300 font-semibold">{emailToVerify || 'your email'}</span>
        </p>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <InputField 
            label="Enter OTP" 
            type="text" 
            placeholder="123456" 
            name="otp" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
          />
          <div className="pt-2">
            <PrimaryButton 
              type="submit" 
              disabled={loading} 
              text={loading ? 'Verifying...' : 'Verify OTP & Continue'} 
            />
          </div>
        </form>

      </div>
    </div>
  );
}

export default VerifyOTP;