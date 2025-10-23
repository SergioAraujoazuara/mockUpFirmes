import React, { useState, useEffect } from 'react';

const BimLoadingBar = ({ isLoading, message = "Procesando geometría 3D y propiedades del modelo..." }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95; // Se mantiene en 95% hasta que se complete la carga real
          }
          return prev + Math.random() * 8; // Incremento más lento para modelos BIM
        });
      }, 300);

      return () => clearInterval(interval);
    } else {
      // Cuando termine la carga, completar al 100%
      setProgress(100);
      setTimeout(() => setProgress(0), 800);
    }
  }, [isLoading]);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      {/* Barra de progreso */}
      <div className="h-2 bg-gray-200">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Mensaje de carga */}
      <div className="bg-white shadow-lg border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
          <span className="text-base font-medium text-gray-700">{message}</span>
        </div>
        
      </div>
    </div>
  );
};

export default BimLoadingBar;
