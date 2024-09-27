import React from 'react';

interface HeaderBadgeProps {
    pageName: string;
    imageSrc: string;
    parentClassName?: string;
    imageClassName?: string;
    titleClassName?: string;
}

const HeaderBadge: React.FC<HeaderBadgeProps> = ({
    pageName,
    imageSrc,
    parentClassName = '',
    imageClassName = '',
    titleClassName = '',
}) => {
    return (
        <div
            className={`flex flex-row justify-between items-center bg-gray-100 p-4 shadow-sm rounded-lg h-auto gap-4 md:gap-8 ${parentClassName}`}
        >
            <div
                className={`text-base md:text-xl font-semibold text-gray-400 font-['Lora'] text-center md:text-left max-w-full ${titleClassName}`}
            >
                {pageName}
            </div>

            <div className="w-auto flex justify-center">
                <img
                    src={imageSrc}
                    className={`w-16 md:w-32 object-contain ${imageClassName}`}
                    alt="Header Image"
                />
            </div>
        </div>
    );
};

export default HeaderBadge;
