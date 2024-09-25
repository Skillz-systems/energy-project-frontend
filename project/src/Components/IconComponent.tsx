import React from 'react';
import clsx from 'clsx';

interface IconProps {
  icon: React.ElementType | string;  
  title?: string;  
  size?: 'small' | 'medium' | 'large' | number;  
  color?: string;  
  position?: 'left' | 'right' | 'top' | 'bottom';  
  onClick?: () => void;  
  className?: string;  
  titleClassName?: string;  
  iconClassName?: string;  
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,  
  title,
  size = 'medium',
  color = 'currentColor',
  position = 'right',
  onClick,
  className,
  titleClassName,
  iconClassName,
}) => {
  
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };


  const positionClasses = {
    left: 'flex-row-reverse',
    right: 'flex-row',
    top: 'flex-col',
    bottom: 'flex-col-reverse',
  };

  
  const iconSize = typeof size === 'number' ? { fontSize: `${size}px` } : sizeClasses[size];

  return (
    <div
      className={clsx('flex items-center cursor-pointer', positionClasses[position], className)} 
      onClick={onClick}
      role="button"
      aria-label={title || 'icon'}
      tabIndex={onClick ? 0 : undefined}  
    >
     
      {typeof IconComponent === 'string' ? (
        <i
          className={clsx(IconComponent, iconSize, iconClassName)}  
          style={{ color }}  
        />
      ) : (
        
        <IconComponent
          style={{ fontSize: typeof size === 'number' ? `${size}px` : undefined, color }}  
          className={clsx(iconClassName)} 
        />
      )}

      
      {title && (
        <span
          className={clsx(sizeClasses[size as keyof typeof sizeClasses], 'ml-2', titleClassName)}  
        >
          {title}
        </span>
      )}
    </div>
  );
};

export default Icon;
