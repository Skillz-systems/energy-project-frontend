import React from 'react';
import logo from '../assets/images/logo.png';



interface LogoProps {
  variant?: 'nav' | 'auth';
}

const LogoComponent = ({ variant = 'nav' }: LogoProps) => {

  const logoStyles = {
    nav: 'w-8 h-8',         // Small logo size for navbar
    auth: 'w-16 h-16 rounded-full', // Larger size and rounded for auth page
  };

  return (
    <div className='border border-red-500'>
      <img
        src={logo}
        alt="Company Logo"
        className={variant === 'nav' ? logoStyles.nav : logoStyles.auth}  // Apply appropriate styles
      />
    </div>

  );
};
export default LogoComponent;
