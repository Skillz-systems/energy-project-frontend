import React from 'react';

interface UserProfileProps {
  profileImage: string;
  userRole: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ profileImage, userRole }) => {
  return (
    <div className="flex items-center bg-amber-50 rounded-full p-2">
      <img
        src={profileImage}
        alt="Profile"
        className="w-[24px] h-[24px] rounded-full object-cover border-2 border-amber-50 shadow-sm"
      />
      <div className="ml-1 bg-amber-900 text-white rounded-full px-3 py-1  flex items-center justify-center">
        <span className="text-sm font-medium font-['red_hat_display']">{userRole}</span>
      </div>
    </div>
  );
};

export default UserProfile;
