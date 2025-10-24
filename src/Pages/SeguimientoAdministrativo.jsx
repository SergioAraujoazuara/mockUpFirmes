import React, { useState } from 'react';
import { FaCog, FaArrowLeft, FaChevronDown, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ProductionMessage from '../Components/ProductionMessage';
import HeaderPage from '../Components/HeaderPage';
function SeguimientoAdministrativo() {
  const [selectedType, setSelectedType] = useState('Adjudicadas');
  const [selectedProvince, setSelectedProvince] = useState('Todas las provincias');

  const types = [
    'Adjudicadas',
    'Licitadas',
    'Previstas',
    'A licitar'
  ];

  const provinces = [
    'Todas las provincias',
    'A Coruña', 'Albacete', 'Alicante', 'Almería', 'Ávila', 'Badajoz',
    'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Castellón', 'Ciudad Real',
    'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Huelva',
    'Huesca', 'Jaén', 'La Rioja', 'León', 'Lleida', 'Madrid', 'Zaragoza'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderno */}
      
      <HeaderPage

        title="Seguimiento Administrativo"
        showBackButton={true}
        backPath="/"
        backText="Volver"
      />

      {/* Filtros Externos */}
      <div className="px-14 py-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Tipo de actuación */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">Tipo de actuación</label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sky-500 focus:border-sky-500 appearance-none cursor-pointer text-gray-700 hover:bg-white transition-colors"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
              </div>
              <button
                onClick={() => console.log('Tipo de actuación:', selectedType)}
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
                onClick={() => console.log('Provincia:', selectedProvince)}
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
                src="http://212.128.194.13/sagf/actuaciones/"
                title="Seguimiento Administrativo"
                className="w-full h-full border-0"
                style={{
                  backgroundColor: '#f9fafb'
                }}
                allowFullScreen
              />
            ) : (
              <div className="p-8">
                <ProductionMessage 
                  title="Seguimiento Administrativo"
                  directUrl="http://212.128.194.13/sagf/actuaciones/"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeguimientoAdministrativo;

