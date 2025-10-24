import React, { useState } from 'react';
import ImagenHome from '../../public/fondoHome.jpeg';
import { FaShieldAlt, FaUserCheck, FaUser, FaEdit, FaTimes } from 'react-icons/fa';
import HeaderPage from '../Components/HeaderPage';

function Home() {
  localStorage.setItem('idProyecto', 'i8l2VQeDIIB7fs3kUQxA');
  localStorage.setItem('proyecto', 'i8l2VQeDIIB7fs3kUQxA');
  localStorage.setItem('nombre_proyecto', 'Sector 3 - ADIF');
  localStorage.setItem('tramo', 'Mondragón-Elorrio-Bergara');
  localStorage.setItem('obra', 'Linea de alta velocidad Vitoria-Bilbao-San Sebastián');

  // Estado para el modal
  const [showEditModal, setShowEditModal] = useState(false);

  // Datos del usuario actual (mock)
  const [currentUser, setCurrentUser] = useState({
    name: 'Rodrigo López',
    email: 'rodrigo.lopez@tpfingenieria.com',
    role: 'Administrador',
    status: 'Activo',
    avatar: 'https://via.placeholder.com/120x120/1E40AF/FFFFFF?text=RL',
    department: 'Ingeniería de Firmes',
    lastLogin: 'Hoy, 09:30',
    phone: '+34 123 456 789',
    position: 'Ingeniero Senior'
  });

  // Datos editables del usuario
  const [editUser, setEditUser] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone,
    department: currentUser.department,
    position: currentUser.position
  });

  // Función para abrir el modal
  const openEditModal = () => {
    setEditUser({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone,
      department: currentUser.department,
      position: currentUser.position
    });
    setShowEditModal(true);
  };

  // Función para cerrar el modal
  const closeEditModal = () => {
    setShowEditModal(false);
  };

  // Función para guardar los cambios
  const saveUserChanges = () => {
    setCurrentUser(prev => ({
      ...prev,
      ...editUser
    }));
    setShowEditModal(false);
    // Aquí podrías agregar lógica para guardar en el backend
    console.log('Usuario actualizado:', editUser);
  };

  return (
    <div className="min-h-screen">
      {/* Header estándar */}
      <HeaderPage 
        title="Inicio"
        showBackButton={true}
        backPath="/"
      />

      {/* Contenido principal con scroll */}
      <div className="py-6 px-14 mt-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 60px)' }}>
        {/* Título grande */}
        <div className="text-center mb-12">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Sistema Avanzado de Gestión de Firmes
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Sistema integral de consulta y mantenimiento de firmes de la RCE
          </p>
        </div>

        {/* Layout principal: Usuario a la izquierda, Imagen a la derecha */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          
          {/* Panel de información del usuario (Izquierda) */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 h-80 lg:h-96 flex flex-col justify-between">
              {/* Header con logo TPF */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-600 to-sky-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">TPF</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-sky-800">TPF Ingeniería</h3>
                  <p className="text-xs text-sky-600">Sistema SAGF</p>
                </div>
              </div>

              {/* Información del usuario */}
              <div className="text-center flex-1 flex flex-col justify-center">
                <div className="relative inline-block mb-2">
                  <div className="w-16 h-16 rounded-full mx-auto border-2 border-sky-200 shadow-md bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center">
                    <FaUser className="text-white text-lg" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  ¡Bienvenido, {currentUser.name.split(' ')[0]}!
                </h2>
                <p className="text-sky-600 font-semibold text-sm mb-1">{currentUser.name}</p>
                <p className="text-gray-600 text-xs mb-2">{currentUser.email}</p>
                
                {/* Información corporativa */}
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    <div className="text-center">
                      <FaShieldAlt className="text-sky-500 w-3 h-3 mx-auto mb-1" />
                      <p className="text-gray-500 text-xs">Rol</p>
                      <p className="font-bold text-gray-800 text-xs">{currentUser.role}</p>
                    </div>
                    <div className="text-center">
                      <FaUserCheck className="text-green-500 w-3 h-3 mx-auto mb-1" />
                      <p className="text-gray-500 text-xs">Estado</p>
                      <p className="font-bold text-green-600 text-xs">{currentUser.status}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1 pt-1 border-t border-gray-200">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Departamento:</span>
                      <span className="font-medium text-gray-700 text-xs">{currentUser.department}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Último acceso:</span>
                      <span className="font-medium text-gray-700 text-xs">{currentUser.lastLogin}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de editar perfil */}
              <div>
                <button 
                  onClick={openEditModal}
                  className="w-full bg-gradient-to-r from-sky-600 to-sky-700 text-white py-1.5 px-3 rounded-lg text-xs font-semibold hover:from-sky-700 hover:to-sky-800 transition-all duration-200 shadow-md flex items-center justify-center gap-1"
                >
                  <FaEdit className="w-3 h-3" />
                  Editar Perfil
                </button>
              </div>
            </div>
          </div>

          {/* Imagen (Derecha) */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-xl overflow-hidden shadow-lg h-80 lg:h-96 bg-gray-800">
              <img 
                src={ImagenHome} 
                alt="Sistema de Gestión de Firmes" 
                className="w-full h-full object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              {/* Overlay con información */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20">
                  <h3 className="text-lg font-bold mb-2">Características del Sistema</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-xs font-medium">Monitoreo en Tiempo Real</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs font-medium">Análisis Predictivo</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span className="text-xs font-medium">Gestión Integral</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>

      {/* Modal para editar perfil */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaEdit className="text-sky-600" />
                Editar Perfil
              </h3>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={editUser.phone}
                  onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
          </div>
          
              {/* Departamento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento
                </label>
                <select
                  value={editUser.department}
                  onChange={(e) => setEditUser({...editUser, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="Ingeniería de Firmes">Ingeniería de Firmes</option>
                  <option value="Gestión de Proyectos">Gestión de Proyectos</option>
                  <option value="Calidad">Calidad</option>
                  <option value="Administración">Administración</option>
                </select>
              </div>

              {/* Posición */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posición
                </label>
                <input
                  type="text"
                  value={editUser.position}
                  onChange={(e) => setEditUser({...editUser, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Botones del modal */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeEditModal}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveUserChanges}
                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
              >
                Guardar Cambios
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default Home;