import React, { useEffect } from 'react';

const BOE = () => {
  useEffect(() => {
    // Redirigir directamente al sitio de TPF
    window.location.href = 'https://iris.tpf.be/siteAssist';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirigiendo a BOE...</p>
      </div>
    </div>
  );
};

export default BOE;
