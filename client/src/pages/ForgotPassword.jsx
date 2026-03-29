import React from 'react';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 selection:bg-indigo-500/30">
      <div className="bg-slate-900 p-10 rounded-3xl shadow-[0_20px_50px_rgba(31,41,55,0.7)] w-full max-w-md border border-slate-800 transition-all duration-300 hover:border-indigo-800/50">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tighter mb-2">
            Reset <span className="text-indigo-400">Password</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm">
            Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        <form className="space-y-6">
          <InputField 
            label="Registered Email Address" 
            type="email" 
            placeholder="somil@empire.com" 
          />

          <div className="pt-2">
            <PrimaryButton text="Send Reset Link" />
          </div>
        </form>

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