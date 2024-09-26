import React from 'react';

interface UserProfileProps {
  profileImage?: string; 
  userRole: string;
  titleClassname?: string;
  imageClassname?: string;
  parentClassName?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  profileImage,
  userRole,
  titleClassname = '',
  imageClassname = '',
  parentClassName = '',
}) => {
  
  const defaultAvatar = '';

  return (
    <div className={`flex items-center bg-yellow-100 rounded-full max-w-[135px] max-h-[34px] mt-4 gap-1 ml-1 border-2 border-amber-100 ${parentClassName}`}>
      <img
        src={profileImage || defaultAvatar}
        alt="Profile"
        className={`w-[24px] h-[24px] rounded-full object-cover border-2 border-amber-100 shadow-sm ${imageClassname}`}
      />
      <div className=" bg-amber-950 text-white rounded-full px-2 py-1 flex items-center justify-center ">
        <span className={`text-sm font-medium font-['Red_Hat_Display'] truncate leading-[14.4px] ${titleClassname}`}>{userRole}</span>
      </div>
    </div>
  );
};

export default UserProfile;
