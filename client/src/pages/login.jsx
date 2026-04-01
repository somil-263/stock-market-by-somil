import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { loginUser } from '../services/authService';

function Login() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginUser(credentials);
      
      localStorage.setItem('token', result.token);
      
      console.log("Login Success! 🎉", result);
      
      navigate('/app/home');
      
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 selection:bg-indigo-500/30">
      <div className="bg-slate-900 p-10 rounded-3xl shadow-[0_20px_50px_rgba(31,41,55,0.7)] w-full max-w-md border border-slate-800 transition-all duration-300 hover:border-indigo-800/50">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300 tracking-tighter mb-2">
            Empire <span className="text-indigo-400">Trading</span>
          </h1>
          <p className="text-slate-400 font-medium">Welcome back! Please login to your account.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField 
            label="Email Address" type="email" placeholder="somil@empire.com" 
            name="email" value={credentials.email} onChange={handleChange} 
          />

          <div>
            <div className="flex justify-end mb-1">
                <Link to="/forgot-password" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</Link>
            </div>
            <InputField 
              label="Password" type="password" placeholder="••••••••" 
              name="password" value={credentials.password} onChange={handleChange} 
            />
          </div>

          <PrimaryButton 
            type="submit" 
            disabled={loading} 
            text={loading ? 'Authenticating...' : 'Sign In to Dashboard'} 
          />
        </form>

        <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-slate-900 px-3 text-sm text-slate-500">New around here?</span>
            </div>
        </div>

        <Link to="/register" className="block w-full text-center bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:border-slate-600 border border-slate-700">
            Create Your Account
        </Link>

      </div>
    </div>
  );
}

export default Login;