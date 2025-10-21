import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import NavbarLateral from './NavbarLateral';

const LayoutLateral = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100 flex">
      {/* Sidebar */}
      <NavbarLateral />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header - Solo mostrar si NO es la página Home */}
        {!isHomePage && (
          <header className="bg-white border-b border-gray-200 flex items-center px-6 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-800">
              {/* Título dinámico de la página */}
            </h2>
          </header>
        )}
        
        {/* Page Content */}
        <main className={`flex-1 ${isHomePage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutLateral;
