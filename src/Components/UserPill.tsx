import sampleimage from "../assets/sampleuserimage.svg";

interface UserPillProps {
  role: string;
  bg?: string; 
  borderColor?: string; 
  textColor?: string; 
  iconSize?: string; 
  iconBorderColor?: string; 
  withLeftIcon?: boolean; 
  leftIcon?: string | JSX.Element; 
  withRightIcon?: boolean; 
  rightIcon?: string | JSX.Element; 
  iconClass?: string; 
  textClass?: string; 
  className?: string; 
}

const UserPill = ({
  role,
  bg = "#FEF5DA", 
  borderColor = "#A58730", 
  textColor = "#32290E", 
  iconSize = "w-[24px] h-[24px]", 
  iconBorderColor = "#A58730", 
  withLeftIcon = true, 
  leftIcon = sampleimage, 
  withRightIcon = false, 
  rightIcon = null, 
  iconClass = "rounded-full border-[0.2px]", 
  textClass = "px-2 py-1 bg-[#32290E] text-xs text-white font-medium rounded-full capitalize", 
  className = "",
}: UserPillProps) => {
  return (
    <div
      className={`flex items-center justify-center p-1 gap-1 w-max rounded-[32px] border ${className}`}
      style={{ backgroundColor: bg, borderColor }}
    >
      {withLeftIcon && (
        <span className={`${iconSize} ${iconClass}`} style={{ borderColor: iconBorderColor }}>
          {typeof leftIcon === "string" ? (
            <img
              src={leftIcon}
              alt="Left Icon"
              className={`${iconSize} ${iconClass}`}
              style={{ borderColor: iconBorderColor }}
            />
          ) : (
            leftIcon
          )}
        </span>
      )}

      <p className={`${textClass}`} style={{ color: textColor }}>
        {role}
      </p>

      {withRightIcon && (
        <span className={iconClass}>
          {typeof rightIcon === "string" ? (
            <img
              src={rightIcon}
              alt="Right Icon"
              className={iconClass}
            />
          ) : (
            rightIcon
          )}
        </span>
      )}
    </div>
  );
};

export default UserPill;
