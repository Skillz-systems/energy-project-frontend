import React from 'react';



// Define the props type for the component
interface HeaderBadgeProps {
    pageName: string;
    imageSrc: string;
}

const HeaderBadge: React.FC<HeaderBadgeProps> = ({ pageName, imageSrc }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 shadow-sm rounded-lg h-[128px] gap-10">
            {/* Left: Page Name */}
            <div className="text-2xl font-semibold text-gray-400 w-[149px] h-[38px] font-['Lora']">
                {pageName}
            </div>

            {/* Right: Image */}
            <div className="mt-2 md:mt-0">
                <img
                    src={imageSrc}
                    className="w-[300px] h-[300px] object-contain"
                />
            </div>
        </div>
    );
};

export default HeaderBadge;
