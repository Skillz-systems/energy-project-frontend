import React, { useState } from 'react';

interface HeaderProps {
    logoSrc: string;
    userProfileSrc: string;
    userRole: string;
    date: string;
    notificationsCount: number;
}

const Header: React.FC<HeaderProps> = ({ logoSrc, userProfileSrc, userRole, date, notificationsCount }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        // Implement logout functionality
        console.log('User logged out');
        setIsLogoutModalOpen(false);
    };

    return (
        <div className="flex items-center justify-between p-2 bg-white shadow">
            {/* Left Section (Logo and User) */}
            <div className="flex items-center space-x-4">
                {/* Logo */}
                <img src={logoSrc}  className="h-10 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)} />

                {/* Navigation Dropdown */}
                {isDropdownOpen && (
                    <div className="absolute mt-12 w-48 bg-white shadow-md rounded">
                        <ul className="flex flex-col">
                            <li className="p-2 hover:bg-gray-200 cursor-pointer">Home</li>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer">Profile</li>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer">Settings</li>
                        </ul>
                    </div>
                )}

                {/* Profile Icon */}
                <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white">
                    <img src={userProfileSrc}  className="rounded-full" />
                </div>

                {/* User Role Badge */}
                <div className="flex items-center space-x-2 bg-gray-200 rounded-full px-4 py-1 text-sm font-medium text-black ">
                    <img src={userProfileSrc} className="h-6 rounded-full" />
                    <span>{userRole}</span>
                </div>
            </div>

            {/* Right Section (Date, Icons) */}
            <div className="flex items-center space-x-4">
                {/* Date with badge */}
                <div className="relative">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">{date}</span>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {notificationsCount}
                    </span>
                </div>

                {/* Calendar Icon */}
                <button className="p-2 rounded-full bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 4h10M4 8h16M4 12h16M4 16h16M4 20h16" />
                    </svg>
                </button>

                {/* Search Icon */}
                <button className="p-2 rounded-full bg-gray-100" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a7 7 0 017 7v0a7 7 0 01-1.268 3.795l5.166 5.167a1 1 0 01-1.414 1.414l-5.167-5.166A7 7 0 1111 4z" />
                    </svg>
                </button>

                {/* Search Input */}
                {isSearchOpen && (
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="border rounded p-1"
                    />
                )}

                {/* Ellipsis Icon for Actions */}
                <button className="p-2 rounded-full bg-gray-100" onClick={() => setIsActionsModalOpen(!isActionsModalOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h.01M12 12h.01M18 12h.01" />
                    </svg>
                </button>

                {/* Actions Modal */}
                {isActionsModalOpen && (
                    <div className="absolute mt-12 w-48 bg-white shadow-md rounded">
                        <ul className="flex flex-col">
                            <li className="p-2 hover:bg-gray-200 cursor-pointer">Action 1</li>
                            <li className="p-2 hover:bg-gray-200 cursor-pointer">Action 2</li>
                        </ul>
                    </div>
                )}

                {/* Logout Button */}
                <button className="p-2 rounded-full bg-gray-100" onClick={() => setIsLogoutModalOpen(true)}>
                    Logout
                </button>

                {/* Logout Confirmation Modal */}
                {isLogoutModalOpen && (
                    <div className="absolute mt-12 w-48 bg-white shadow-md rounded p-2">
                        <p>Are you sure you want to logout?</p>
                        <button onClick={handleLogout} className="bg-red-500 text-white rounded px-2 py-1">Yes</button>
                        <button onClick={() => setIsLogoutModalOpen(false)} className="bg-gray-200 rounded px-2 py-1">Cancel</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
