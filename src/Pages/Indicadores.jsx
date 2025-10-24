import React, { useState } from 'react';
import { FaChartBar, FaArrowLeft, FaChevronDown, FaMapMarkerAlt, FaRoad } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ProductionMessage from '../Components/ProductionMessage';
import HeaderPage from '../Components/HeaderPage';
function Indicadores() {
  const [selectedIndicator, setSelectedIndicator] = useState('Índice General');
  const [selectedProvince, setSelectedProvince] = useState('Todas las provincias');
  const [selectedRoad, setSelectedRoad] = useState('Todas las carreteras');

  const indicators = [
    'Índice General',
    'Índice Seguridad', 
    'Índice Confort',
    'Índice Estructural',
    'Índice Nuevo 1',
    'Índice Nuevo 2',
    'Índice Nuevo 3'
  ];

  const provinces = [
    'Todas las provincias',
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
    'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real',
    'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva',
    'Huesca', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lleida',
    'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia',
    'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla',
    'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya',
    'Zamora', 'Zaragoza'
  ];

  const roads = [
    'Todas las carreteras',
    'A-1', 'A-2', 'A-3', 'A-4', 'A-5', 'A-6', 'A-7', 'A-8'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderno */}
      <HeaderPage

        title="Indicadores - Estado de la red"
        showBackButton={true}
        backPath="/"
        backText="Volver"
      />

      {/* Filtros Externos */}
      <div className="px-14 py-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Indicador a analizar */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">Indicador</label>
              <div className="relative">
                <select
                  value={selectedIndicator}
                  onChange={(e) => setSelectedIndicator(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 appearance-none cursor-pointer text-gray-700 hover:bg-white transition-colors"
                >
                  {indicators.map((indicator) => (
                    <option key={indicator} value={indicator}>
                      {indicator}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
              </div>
              <button
                onClick={() => console.log('Cambiar índice:', selectedIndicator)}
                className="w-full bg-sky-600 text-white py-1.5 px-3 rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                Aplicar
              </button>
            </div>

            {/* Provincias */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">Provincia</label>
              <div className="relative">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 appearance-none cursor-pointer text-gray-700 hover:bg-white transition-colors"
                >
                  {provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
              </div>
              <button
                onClick={() => console.log('Mostrar provincia:', selectedProvince)}
                className="w-full bg-sky-600 text-white py-1.5 px-3 rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                Aplicar
              </button>
            </div>

            {/* Carreteras */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">Carretera</label>
              <div className="relative">
                <select
                  value={selectedRoad}
                  onChange={(e) => setSelectedRoad(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 appearance-none cursor-pointer text-gray-700 hover:bg-white transition-colors"
                >
                  {roads.map((road) => (
                    <option key={road} value={road}>
                      {road}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
              </div>
              <button
                onClick={() => console.log('Extraer datos:', { selectedIndicator, selectedProvince, selectedRoad })}
                className="w-full bg-sky-600 text-white py-1.5 px-3 rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>

        {/* Iframe Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="relative" style={{ height: '600px' }}>
            {import.meta.env.DEV ? (
              <iframe
                src="http://212.128.194.13/sagf/indicadores/"
                title="Indicadores de Estado de la Red"
                className="w-full h-full border-0"
                style={{
                  backgroundColor: '#f9fafb'
                }}
                allowFullScreen
              />
            ) : (
              <div className="p-8">
                <ProductionMessage 
                  title="Indicadores - Estado de la red"
                  directUrl="http://212.128.194.13/sagf/indicadores/"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Indicadores;

