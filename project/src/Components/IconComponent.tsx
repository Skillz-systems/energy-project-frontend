import React from 'react';
import clsx from 'clsx';

interface IconProps {
  icon: React.ElementType | string;  
  title?: string;
  size?: number;  
  color?: string;
  onClick?: () => void;
  className?: string;
  titleClassName?: string;
  iconClassName?: string;
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  title,
  size = 16, 
  color = 'currentColor',
  onClick,
  className,
  titleClassName,
  iconClassName,
}) => {

  return (
    <div
      className={clsx('flex items-center cursor-pointer', className)}  
      onClick={onClick}
      role="button"
      aria-label={title || 'icon'}
      tabIndex={onClick ? 0 : undefined}
    >
     
      {typeof IconComponent === 'string' ? (
        <img
          src={IconComponent}
          alt={title || 'icon image'}
          className={clsx(iconClassName)} 
          style={{ width: size, height: size }} 
        />
      ) : (
        <IconComponent
          style={{ fontSize: `${size}px`, color }}  
          className={clsx(iconClassName)}
        />
      )}

      
      {title && (
        <span className={clsx(titleClassName)}>
          {title}
        </span>
      )}
    </div>
  );
};

export default Icon;
