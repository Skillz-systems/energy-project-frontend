import React from 'react';

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  buttonText?: string;
  buttonLink?: string;
  overlayOpacity?: number;
}

const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  backgroundImage,
  backgroundColor,
  buttonText,
  buttonLink,
  overlayOpacity = 0.5,
}) => {
  return (
    <div
      className="relative w-full h-64 flex flex-col justify-center items-center text-center"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundColor: backgroundColor || 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-black z-0"
          style={{ opacity: overlayOpacity }}
        ></div>
      )}

      <h1 className="relative text-4xl font-bold text-white z-10">{title}</h1>
      {subtitle && <p className="relative text-xl text-gray-200 mt-2 z-10">{subtitle}</p>}

      {buttonText && buttonLink && (
        <a
          href={buttonLink}
          aria-label={`Click here to ${buttonText}`}
          className="relative mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg z-10 hover:bg-blue-600"
        >
          {buttonText}
        </a>
      )}
    </div>
  );
};

export default PageBanner;
