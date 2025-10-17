import React from 'react';
import { Link } from 'react-router-dom';
import ImagenHome from '../../public/fondoHome.jpeg';
import { FaChartBar, FaCog } from "react-icons/fa";

function Home() {
  localStorage.setItem('idProyecto', 'i8l2VQeDIIB7fs3kUQxA');
  localStorage.setItem('proyecto', 'i8l2VQeDIIB7fs3kUQxA');
  localStorage.setItem('nombre_proyecto', 'Sector 3 - ADIF');
  localStorage.setItem('tramo', 'Mondragón-Elorrio-Bergara');
  localStorage.setItem('obra', 'Linea de alta velocidad Vitoria-Bilbao-San Sebastián');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Moderno */}
      <div
        className="relative min-h-[80vh] bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${ImagenHome})` }}
      >
        {/* Overlay simple */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        
        <div className="relative text-center text-white px-6 flex flex-col items-center z-10">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-sm font-medium mb-4 backdrop-blur-sm">
              Sistema de Gestión RCE
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
            Sistema avanzado de gestión de firmes
          </h1>
          
          <p className="text-xl md:text-2xl max-w-4xl mx-auto text-white mb-8 leading-relaxed">
            Sistema integral de consulta mantenimiento de firmes de la RCE
          </p>
          
          <div className="flex justify-center">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                TPF INGENIERIA
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          </div>
        </div>
      </div>

      {/* Sección de Monitoreo */}
      <div className="relative py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-sky-100 text-sky-600 rounded-full text-sm font-medium mb-4">
              Monitoreo de Red
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-600 mb-6">
              Sistema de <span className="text-gray-600">Monitoreo</span>
        </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas avanzadas para el análisis y seguimiento de la red de carreteras
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Indicadores - Estado de la red */}
            <Link to="/indicadores" className="block">
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaChartBar className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-sky-600 mb-4">Indicadores - Estado de la red</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Consulta los indicadores principales de la red de carreteras.
                  </p>
                </div>
              </div>
            </Link>

            {/* Seguimiento Administrativo */}
            <Link to="/seguimiento-administrativo" className="block">
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaCog className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-sky-600 mb-4">Seguimiento Administrativo</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Revisa las actuaciones realizadas o planificadas en la red de carreteras.
                  </p>
                </div>
              </div>
            </Link>

            {/* Prognosis de Evolución */}
            <Link to="/prognosis-evolucion" className="block">
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-sky-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FaChartBar className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-sky-600 mb-4">Prognosis de Evolución</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Previsión del estado futuro de la red de carreteras.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;