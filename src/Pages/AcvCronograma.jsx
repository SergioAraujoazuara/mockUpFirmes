import React from 'react';
import HeaderPage from '../Components/HeaderPage';

const AcvCronograma = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header usando componente reutilizable */}
      <HeaderPage 
        title="Cronograma"
        showBackButton={true}
        backPath="/"
        backText="Volver al inicio"
      />

      {/* Main Content */}
      <div className="container mx-auto px-40 py-8">
        {/* Información del Proyecto A-67 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-700 font-bold text-sm">A-67</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Información del Proyecto</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Ubicación</h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Provincia:</span> CANTABRIA<br/>
                <span className="font-medium">CCAA:</span> Castilla y León / Cantabria<br/>
                <span className="font-medium">Recorre:</span> Palencia → Cantabria
              </p>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Características</h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Carretera:</span> A-67<br/>
                <span className="font-medium">Tipo:</span> Autopista Libre / Autovía<br/>
                <span className="font-medium">Longitud:</span> ~200+ km
              </p>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Conexiones</h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Inicio:</span> A-62 (Palencia)<br/>
                <span className="font-medium">Fin:</span> A-8 (Cantabria)<br/>
                <span className="font-medium">Tipo:</span> Eje Norte-Sur
              </p>
            </div>
          </div>
        </div>

        {/* Iframe del Cronograma */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <iframe
            src="/sagf/Pestaña_1/Mockup_SAGF_planificación.html"
            className="w-full h-screen"
            title="Cronograma"
            style={{ minHeight: '800px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AcvCronograma;
