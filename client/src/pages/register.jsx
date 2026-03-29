import React from 'react';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 selection:bg-indigo-500/30">
      <div className="bg-slate-900 p-10 rounded-3xl shadow-[0_20px_50px_rgba(31,41,55,0.7)] w-full max-w-md border border-slate-800 transition-all duration-300 hover:border-indigo-800/50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300 tracking-tighter mb-2">
            Join the <span className="text-indigo-400">Empire</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm">Create your account and start trading.</p>
        </div>

        <form className="space-y-5">
          
          <InputField 
            label="Full Name" 
            type="text" 
            placeholder="John Doe" 
          />

          <InputField 
            label="Username" 
            type="text" 
            placeholder="trader_007" 
          />

          <InputField 
            label="Email Address" 
            type="email" 
            placeholder="somil@empire.com" 
          />

          <InputField 
            label="Password" 
            type="password" 
            placeholder="Create a strong password" 
          />

          <div className="pt-2">
            <PrimaryButton text="Create Account" />
          </div>

        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign In here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;