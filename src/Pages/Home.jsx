import React from 'react';
import ImagenHome from '../../public/fondoHome.jpeg';
import { FaShieldAlt, FaUserCheck } from 'react-icons/fa';

function Home() {
  localStorage.setItem('idProyecto', 'i8l2VQeDIIB7fs3kUQxA');
  localStorage.setItem('proyecto', 'i8l2VQeDIIB7fs3kUQxA');
  localStorage.setItem('nombre_proyecto', 'Sector 3 - ADIF');
  localStorage.setItem('tramo', 'Mondragón-Elorrio-Bergara');
  localStorage.setItem('obra', 'Linea de alta velocidad Vitoria-Bilbao-San Sebastián');

  // Datos del usuario actual (mock)
  const currentUser = {
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    role: 'Administrador',
    status: 'Activo',
    avatar: 'https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=JP'
  };

  return (
    <div className="h-screen w-full relative">
      {/* Imagen de fondo ocupando toda la pantalla */}
      <div
        className="relative h-full w-full bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${ImagenHome})` }}
      >
        {/* Overlay simple */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        {/* Panel de Bienvenida (Lado Izquierdo) */}
        <div className="absolute left-8 top-8 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 p-6 max-w-sm">
            <div className="text-center">
              <img 
                src={currentUser.avatar} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-blue-100"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                ¡Bienvenido, {currentUser.name.split(' ')[0]}!
              </h2>
              <p className="text-gray-600 mb-2">{currentUser.email}</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <FaShieldAlt className="text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Rol: {currentUser.role}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <FaUserCheck className="text-green-500" />
                <span className="text-sm text-gray-600">Estado: {currentUser.status}</span>
              </div>
            </div>
          </div>
        </div>
        
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