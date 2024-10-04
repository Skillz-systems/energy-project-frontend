import React, { useState } from 'react';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { useApiCall } from '../../utils/useApiCall';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { apiCall } = useApiCall(); 

  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length > 6;

  
  const handleSubmit = async (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    if (!isEmailValid || !isPasswordValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await apiCall({
        endpoint: '/api/v1/auth/login',
        method: 'post',
        data: { email, password }, 
        successMessage: 'Login successful!',
      });

     
      console.log('Login successful:', response);
      toast.success('Login successful!'); 

    } catch (error) {
      setErrorMessage('Login failed. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/Images/image.png')" }}
    >
      <form className="p-8 w-full max-w-md flex flex-col items-center">
        <div className="text-center mb-6">
          <img
            src="./Images/logo2.png"
            className="logo-image h-[120px] w-[120px] mx-auto mb-6"
          />
        </div>

        <div className="text-center mt-8">
          <h2 className="text-[32px] font-medium text-red-950 w-[230px] h-[32px] font-['lora'] leading-8">
            Welcome Back
          </h2>
          <p className="text-[12px] text-gray-600 font-['Red_Hat_Display'] w-[219px] h-[20px] italic font-normal">
            Sign In to Access your Workplace
          </p>
        </div>

        <div className="w-full flex flex-col items-center mt-16">
          <div className="mb-4 w-[400px]">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={`w-full h-[48px] px-3 py-2 border text-[12px] italic leading-5 font-normal font-['Red_Hat_Display'] ${!isEmailValid && email ? 'border-red-500' : 'border-gray-300'} rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
              required
            />
            {!isEmailValid && email && (
              <p className="text-red-500 text-xs mt-1">Please enter a valid email address.</p>
            )}
          </div>

          <div className="mb-12 relative w-[400px]">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`w-full h-[48px] px-3 py-2 text-[12px] italic leading-5 font-normal font-['Red_Hat_Display'] border ${!isPasswordValid && password ? 'border-red-500' : 'border-gray-300'} rounded-full shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-xs"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? 'Hide' : 'Show'}
            </button>
            {!isPasswordValid && password && (
              <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters.</p>
            )}
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <img
            src="./Images/Arrow button.png"
            className={`cursor-pointer ${(!isEmailValid || !isPasswordValid || isSubmitting) ? 'opacity-50' : ''}`}
            onClick={handleSubmit}
            style={{ width: '64px', height: '64px' }}
          />

          <div className="mt-8 w-[400px] text-center">
            <a href="/forgot-password" className="text-white hover:underline text-xs">
              Forgot Password?
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
