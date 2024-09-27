import React from 'react';

interface HeaderBadgeProps {
    pageName: string;
    imageSrc: string;
}

const HeaderBadge: React.FC<HeaderBadgeProps> = ({ pageName, imageSrc }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 shadow-sm rounded-lg h-auto gap-4 md:gap-8">
          
            <div className="text-base md:text-xl font-semibold text-gray-400 font-['Lora'] text-center md:text-left max-w-full">
                {pageName}
            </div>

            <div className="mt-2 md:mt-0 w-full flex justify-center md:w-auto">
                <img
                    src={imageSrc}
                    className="max-w-xs md:max-w-md object-contain"
                    alt="Header Image"
                />
            </div>
        </div>
    );
};

export default HeaderBadge;
