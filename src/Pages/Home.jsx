import React from 'react';
import ImagenHome from '../../public/fondoHome.jpeg';

function Home() {
  localStorage.setItem('idProyecto', 'i8l2VQeDIIB7fs3kUQxA');
  localStorage.setItem('proyecto', 'i8l2VQeDIIB7fs3kUQxA');
  localStorage.setItem('nombre_proyecto', 'Sector 3 - ADIF');
  localStorage.setItem('tramo', 'Mondragón-Elorrio-Bergara');
  localStorage.setItem('obra', 'Linea de alta velocidad Vitoria-Bilbao-San Sebastián');

  return (
    <div className="h-screen w-full">
      {/* Imagen de fondo ocupando toda la pantalla */}
      <div
        className="relative h-full w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${ImagenHome})` }}
      >
        {/* Overlay simple */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        {/* Contenido centrado sobre la imagen */}
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
    </div>
  );
}

export default Home;