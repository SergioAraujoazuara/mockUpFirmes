import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const HeaderPage = ({ 
  title, 
  showBackButton = true, 
  backPath = "/", 
  backText = "Volver",
  rightContent = null,
  className = ""
}) => {
  return (
    <div className={`bg-white/80 backdrop-blur-md sticky top-0 z-10 ${className}`}>
      <div className="py-4 container mx-auto px-40">
        <div className="flex items-center justify-between pb-4 border-b-2 border-gray-300">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-sky-600 to-sky-700 rounded-full"></div>
            <h1 className="text-base font-medium text-gray-600 normal-case">{title}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {rightContent}
            {showBackButton && (
              <Link 
                to={backPath} 
                className="flex items-center gap-2 py-2 text-sm text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
              >
                <FaArrowLeft className="text-xs" />
                <span>{backText}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderPage;
