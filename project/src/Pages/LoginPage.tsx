import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length > 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    // Simulate API request
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect or handle success
        console.log('Login successful');
      } else {
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-200">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="Company Logo" className="h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold">Welcome Back</h2>
          <p className="text-gray-600">Sign In to Access your Workplace</p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${!isEmailValid && email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            required
          />
          {!isEmailValid && email && <p className="text-red-500 text-sm">Please enter a valid email address.</p>}
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`mt-1 block w-full px-3 py-2 border ${!isPasswordValid && password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? 'Hide' : 'Show'}
          </button>
          {!isPasswordValid && password && <p className="text-red-500 text-sm">Password must be at least 6 characters.</p>}
        </div>

        {/* Forgot Password */}
        <div className="mb-4 text-right">
          <a href="/forgot-password" className="text-indigo-600 hover:underline">Forgot Password?</a>
        </div>

        {/* Error Message */}
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md ${!isEmailValid || !isPasswordValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
          disabled={!isEmailValid || !isPasswordValid || isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
