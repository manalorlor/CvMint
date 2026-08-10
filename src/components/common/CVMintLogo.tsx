import React from "react";
import logoImg from "../../assets/images/main_logo_cvminter_1786355476552.jpg";

interface CVMintLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  hideTextOnMobile?: boolean;
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const CVMintLogo: React.FC<CVMintLogoProps> = ({
  size = "md",
  showText = true,
  hideTextOnMobile = false,
  showTagline = false,
  className = "",
  onClick,
}) => {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
    xl: "w-20 h-20",
  };

  const textSizeMap = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-4xl",
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 ${onClick ? "cursor-pointer select-none" : ""} ${className}`}
    >
      <div className={`relative flex-shrink-0 ${sizeMap[size]} rounded-xl overflow-hidden bg-white shadow-xs border border-emerald-100 p-0.5`}>
        <img
          src={logoImg}
          alt="CVMinter Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {showText && (
        <div className={`flex flex-col ${hideTextOnMobile ? "hidden min-[380px]:flex" : ""}`}>
          <span className={`font-black tracking-tight text-slate-900 ${textSizeMap[size]} leading-none`}>
            CV<span className="text-emerald-600">Minter</span>
          </span>
          {showTagline && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mt-1">
              Create Your CV <span className="text-emerald-600">•</span> Find Jobs <span className="text-emerald-600">•</span> Land Opportunities
            </span>
          )}
        </div>
      )}
    </div>
  );
};
