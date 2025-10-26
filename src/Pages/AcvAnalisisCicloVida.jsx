import React, { useState } from 'react';
import HeaderPage from '../Components/HeaderPage';
import { FaRoad, FaMapMarkerAlt, FaCalendarAlt, FaCog } from 'react-icons/fa';

const AcvAnalisisCicloVida = () => {
  const [filtrosProyecto, setFiltrosProyecto] = useState({
    carretera: 'A-67',
    provincia: 'Cantabria',
    ccaa: 'Cantabria',
    tipo: 'Autopista Libre',
    año: '2024'
  });

  const handleFiltroChange = (campo, valor) => {
    setFiltrosProyecto(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Header usando componente reutilizable */}
      <HeaderPage 
        title="Análisis ciclo de vida"
        showBackButton={true}
        backPath="/"
        backText="Volver al inicio"
      />

      {/* Filtros de Proyecto */}
      <div className="px-14 py-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaCog className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">Filtros de Proyecto</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaRoad className="w-4 h-4 inline mr-2" />
                Carretera
              </label>
              <select
                value={filtrosProyecto.carretera}
                onChange={(e) => handleFiltroChange('carretera', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm bg-white"
              >
                <option value="A-67">A-67</option>
                <option value="A-8">A-8</option>
                <option value="A-62">A-62</option>
                <option value="N-634">N-634</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="w-4 h-4 inline mr-2" />
                Provincia
              </label>
              <select
                value={filtrosProyecto.provincia}
                onChange={(e) => handleFiltroChange('provincia', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm bg-white"
              >
                <option value="Cantabria">Cantabria</option>
                <option value="Palencia">Palencia</option>
                <option value="Burgos">Burgos</option>
                <option value="Valladolid">Valladolid</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="w-4 h-4 inline mr-2" />
                CCAA
              </label>
              <select
                value={filtrosProyecto.ccaa}
                onChange={(e) => handleFiltroChange('ccaa', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm bg-white"
              >
                <option value="Cantabria">Cantabria</option>
                <option value="Castilla y León">Castilla y León</option>
                <option value="Asturias">Asturias</option>
                <option value="País Vasco">País Vasco</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaRoad className="w-4 h-4 inline mr-2" />
                Tipo de Vía
              </label>
              <select
                value={filtrosProyecto.tipo}
                onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm bg-white"
              >
                <option value="Autopista Libre">Autopista Libre</option>
                <option value="Autovía">Autovía</option>
                <option value="Carretera Nacional">Carretera Nacional</option>
                <option value="Carretera Comarcal">Carretera Comarcal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendarAlt className="w-4 h-4 inline mr-2" />
                Año de Análisis
              </label>
              <select
                value={filtrosProyecto.año}
                onChange={(e) => handleFiltroChange('año', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm bg-white"
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-14 py-4">
        {/* Información del Proyecto */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{filtrosProyecto.carretera}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Información del Proyecto</h2>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-medium">
                Análisis {filtrosProyecto.año}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Ubicación</h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Provincia:</span> {filtrosProyecto.provincia.toUpperCase()}<br/>
                <span className="font-medium">CCAA:</span> {filtrosProyecto.ccaa}<br/>
                <span className="font-medium">Recorre:</span> Palencia → Cantabria
              </p>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Características</h3>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Carretera:</span> {filtrosProyecto.carretera}<br/>
                <span className="font-medium">Tipo:</span> {filtrosProyecto.tipo}<br/>
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

        {/* Iframe del Análisis de Ciclo de Vida */}
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
