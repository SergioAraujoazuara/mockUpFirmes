import React from 'react';
import HeaderPage from '../Components/HeaderPage';

const AcvAnalisisCicloVida = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header usando componente reutilizable */}
      <HeaderPage 
        title="Análisis ciclo de vida"
        showBackButton={true}
        backPath="/"
        backText="Volver al inicio"
      />

      {/* Main Content */}
      <div className="container mx-auto px-40 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <iframe
            src="/sagf/Pestaña_1/Mockup_SAGF_ACV.html"
            className="w-full h-screen"
            title="Análisis ciclo de vida"
            style={{ minHeight: '800px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AcvAnalisisCicloVida;
