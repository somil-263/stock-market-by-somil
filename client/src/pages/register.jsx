import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { registerUser } from '../services/authService';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await registerUser(formData);
      console.log("Success! 🎉", result);
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="bg-slate-900 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-800">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300 mb-2">
            Join the <span className="text-indigo-400">Empire</span>
          </h1>
          <p className="text-slate-400 text-sm">Create your account and start trading.</p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField 
            label="Full Name" type="text" placeholder="John Doe" 
            name="name" value={formData.name} onChange={handleChange} 
          />
          <InputField 
            label="Username" type="text" placeholder="trader_007" 
            name="username" value={formData.username} onChange={handleChange} 
          />
          <InputField 
            label="Email Address" type="email" placeholder="somil@empire.com" 
            name="email" value={formData.email} onChange={handleChange} 
          />
          <InputField 
            label="Password" type="password" placeholder="Create a strong password" 
            name="password" value={formData.password} onChange={handleChange} 
          />

          <div className="pt-2">
            <PrimaryButton 
              type="submit" 
              disabled={loading} 
              text={loading ? 'Creating Account...' : 'Create Account'} 
            />
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">Sign In here</Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default Register;