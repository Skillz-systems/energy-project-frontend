import HeaderBadge from '@/Components/HeaderBadgeComponent/HeaderBadgeComponent';
import TopNavComponent from '@/Components/TopNavComponent/TopNavComponent';
import React from 'react';

const Dashboard: React.FC = () => {
    return (
        <div className="flex flex-col h-screen bg-gray-50">
            
            <div className="z-10">
                <TopNavComponent
                    logoSrc="/assets/logo.png" 
                    userProfileSrc="/assets/user-profile.png" 
                    userRole="Super Admin" 
                    date={new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} 
                    notificationsCount={7} 
                />
            </div>

           
            <div className="flex flex-col w-full mt-4 px-6 z-0"> 
                <HeaderBadge
                    pageName="Dashboard"
                    imageSrc= "/Images/Inventory.png" 
                />
            </div>
        </div>
    );
};

export default Dashboard;
