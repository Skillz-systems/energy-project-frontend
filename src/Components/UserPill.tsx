import React from "react";
import sampleimage from "../assets/sampleuserimage.svg"; 

interface UserPillProps {
  text: string;
  role?: string; 
  status?: "ACTIVE" | "INACTIVE";
  bgColor?: string;
  textColor?: string;
  iconSize?: string; 
  iconBorderColor?: string;
  iconPosition?: "left" | "right";
  withLeftIcon?: boolean;
  leftIcon?: string | JSX.Element;
  withRightIcon?: boolean;
  rightIcon?: string | JSX.Element;
  iconClass?: string;
  textClass?: string;
  className?: string;
  compact?: boolean;
  statusColor?: string;
  pillType?: "text" | "role" | "status" | "icon-only" | "text-role" | "compact"; 
}

const UserPill = ({
  text,
  role,
  status,
  bgColor = "#F9F9F9", 
  textColor = "#32290E", 
  iconSize = "w-[24px] h-[24px]",
  iconBorderColor = "#A58730", 
  iconPosition = "left", 
  withLeftIcon = false,
  leftIcon = sampleimage,
  withRightIcon = false,
  rightIcon = null,
  iconClass = "rounded-full border-[0.2px]",
  textClass = "px-2 py-1 bg-[#32290E] text-xs text-white font-medium rounded-full capitalize",
  className = "",
  compact = false,
  statusColor = "#22C55E", 
  pillType = "text",
}: UserPillProps) => {
  return (
    <div
      className={`flex items-center justify-center p-1 gap-1 w-max rounded-[32px] border ${compact ? "px-2 py-0" : "px-3 py-1"} ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {status && pillType !== "icon-only" && (
        <span 
          className={`w-2.5 h-2.5 rounded-full ${status === "ACTIVE" ? statusColor : "#F87171"}`} 
          style={{ marginRight: compact ? "4px" : "8px" }}
        />
      )}

      {(pillType === "role" || pillType === "text-role") && role && (
        <p className={`${textClass}`} style={{ color: textColor }}>
          {role}
        </p>
      )}

      {pillType === "text" && text && (
        <p className={`${textClass}`} style={{ color: textColor }}>
          {text}
        </p>
      )}

      {pillType === "compact" && text && (
        <p className="text-sm font-medium">{text}</p>
      )}

      {(pillType === "text-role" || pillType === "role") && text && (
        <p className={`${textClass}`} style={{ color: textColor }}>
          {text} - {role}
        </p>
      )}

      {(pillType === "icon-only" || withLeftIcon || withRightIcon) && (
        <>
          {withLeftIcon && iconPosition === "left" && (
            <span className={`${iconSize} ${iconClass}`} style={{ borderColor: iconBorderColor }}>
              {typeof leftIcon === "string" ? (
                <img src={leftIcon} alt="Left Icon" className={iconSize} />
              ) : (
                leftIcon
              )}
            </span>
          )}

          {withRightIcon && iconPosition === "right" && (
            <span className={`${iconSize} ${iconClass}`}>
              {typeof rightIcon === "string" ? (
                <img src={rightIcon} alt="Right Icon" className={iconSize} />
              ) : (
                rightIcon
              )}
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default UserPill;
