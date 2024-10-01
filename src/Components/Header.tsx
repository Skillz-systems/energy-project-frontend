import React from 'react';
import UserProfile from './UserPill';

const Header = () => {
  const profileImage = "@assets/Images/logo.png"; // Replace with actual path
  const userRole = 'Super Admin';

  return (
    <header className="bg p-4">
      <UserProfile profileImage={profileImage} userRole={userRole} />
    </header>
  );
};

export default Header;