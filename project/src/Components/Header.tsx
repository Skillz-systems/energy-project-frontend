import React from 'react';
import UserProfile from './UserProfile';

const Header = () => {
  const profileImage = 'path/to/your/profile-image.jpg'; // Replace with actual path
  const userRole = 'Super Admin';

  return (
    <header className="bg p-4">
      <UserProfile profileImage={profileImage} userRole={userRole} />
    </header>
  );
};

export default Header;