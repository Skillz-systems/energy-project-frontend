import React from 'react';


interface HeaderBadgeProps {
    pageName: string;
    imageSrc: string;
}

const HeaderBadge: React.FC<HeaderBadgeProps> = ({ pageName, imageSrc }) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 shadow-sm rounded-lg h-auto md:h-[128px] gap-6 md:gap-10">
          
            <div className="text-xl md:text-2xl font-semibold text-gray-400 w-full md:w-[149px] h-auto md:h-[38px] font-['Lora'] text-center md:text-left">
                {pageName}
            </div>

           
            <div className="mt-2 md:mt-0 w-full flex justify-center md:w-auto">
                <img
                    src={imageSrc}
                    className="w-[150px] h-[150px] md:w-[300px] md:h-[300px] object-contain"
                    alt="Header Image"
                />
            </div>
        </div>
    );
};

export default HeaderBadge;
