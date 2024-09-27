import React from 'react';

interface IconProps {
  icon: React.ElementType | string;  
  title?: string;
  size?: 'small' | 'medium' | 'large' | number;  
  color?: string;  
  position?: 'left' | 'right' | 'top' | 'bottom';  
  onClick?: () => void;  
  className?: string;  
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,  
  title,
  size = 'medium',
  color = 'currentColor',
  position = 'right',
  onClick,
  className,
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

  
  const iconSize = typeof size === 'number' ? { fontSize: `${size}px` } : { className: sizeClasses[size] };

  return (
    <div
      className={`flex items-center ${positionClasses[position]} ${className}`}
      onClick={onClick}
      role="button"
      aria-label={title || 'icon'}
      tabIndex={onClick ? 0 : undefined}  
    >
      {typeof IconComponent === 'string' ? (
        
        <i className={`${IconComponent} ${iconSize.className || ''}`} style={iconSize} />
      ) : (
        
        <IconComponent style={iconSize} className={color} />
      )}

      
      {title && (
        <span className={`${sizeClasses[size as keyof typeof sizeClasses]} ml-2`}>
          {title}
        </span>
      )}
    </div>
  );
};

export default Icon;
