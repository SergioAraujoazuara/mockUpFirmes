import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderPage from '../Components/HeaderPage';
import { FaUser, FaEdit, FaTrash, FaPlus, FaEye, FaEyeSlash, FaCog, FaShieldAlt, FaUserCheck, FaUserTimes, FaUsers, FaUserPlus, FaUserCog } from 'react-icons/fa';

function GestionUsuarios() {
  // Lista de usuarios (mock)
  const [users, setUsers] = useState([
    { id: 1, name: 'María García', email: 'maria.garcia@empresa.com', role: 'Editor', status: 'Activo' },
    { id: 2, name: 'Pedro López', email: 'pedro.lopez@empresa.com', role: 'Demarcación de carreteras', status: 'Activo' },
    { id: 3, name: 'Ana Martínez', email: 'ana.martinez@empresa.com', role: 'Empresa conservación', status: 'Inactivo' },
    { id: 4, name: 'Carlos Ruiz', email: 'carlos.ruiz@empresa.com', role: 'Editor', status: 'Activo' },
    { id: 5, name: 'Laura Sánchez', email: 'laura.sanchez@empresa.com', role: 'Demarcación de carreteras', status: 'Pendiente' }
  ]);

  // Estados para filtros
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [roleFilter, setRoleFilter] = useState('Todos');
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Demarcación de carreteras',
    status: 'Activo'
  });

  // Datos de roles y permisos
  const roles = {
    'Administrador': ['Ver todo', 'Editar todo', 'Eliminar usuarios', 'Gestionar roles'],
    'Editor': ['Ver datos', 'Editar datos', 'Crear reportes'],
    'Demarcación de carreteras': ['Ver datos', 'Exportar reportes'],
    'Empresa conservación': ['Ver datos', 'Crear inspecciones', 'Editar inspecciones']
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const statusMatch = statusFilter === 'Todos' || user.status === statusFilter;
    const roleMatch = roleFilter === 'Todos' || user.role === roleFilter;
    return statusMatch && roleMatch;
  });

  // Cambiar estado de usuario
  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'Activo' ? 'Inactivo' : 'Activo'
        };
      }
      return user;
    }));
  };

  // Eliminar usuario
  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  // Cambiar rol de usuario
  const changeUserRole = (userId, newRole) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          role: newRole
        };
      }
      return user;
    }));
    setShowRoleModal(false);
    setEditingUser(null);
  };

  // Abrir modal para cambiar rol
  const openRoleModal = (user) => {
    setEditingUser(user);
    setShowRoleModal(true);
  };

  // Agregar nuevo usuario
  const addNewUser = () => {
    if (newUser.name.trim() && newUser.email.trim()) {
      const user = {
        id: Date.now(), // ID único temporal
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        role: newUser.role,
        status: newUser.status
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: 'Demarcación de carreteras', status: 'Activo' });
      setShowAddUserModal(false);
    }
  };

  // Abrir modal para agregar usuario
  const openAddUserModal = () => {
    setNewUser({ name: '', email: '', role: 'Visualizador', status: 'Activo' });
    setShowAddUserModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header usando componente reutilizable */}
      <HeaderPage 
        title="Gestión de usuarios"
        showBackButton={true}
        backPath="/"
        backText="Volver"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sistema de Gestión de Usuarios */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <FaUsers className="text-sky-600" />
                  Lista de Usuarios
                </h3>
                <button 
                  onClick={openAddUserModal}
                  className="flex items-center gap-2 px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-xs"
                >
                  <FaUserPlus />
                  Agregar Usuario
                </button>
              </div>

              {/* Filtros */}
              <div className="flex gap-4 mb-6">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs"
                >
                  <option value="Todos">Todos los estados</option>
                  <option value="Activo">Activos</option>
                  <option value="Inactivo">Inactivos</option>
                  <option value="Pendiente">Pendientes</option>
                </select>
                
                <select 
                  value={roleFilter} 
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs"
                >
                  <option value="Todos">Todos los roles</option>
                  <option value="Administrador">Administradores</option>
                  <option value="Editor">Editores</option>
                  <option value="Demarcación de carreteras">Demarcación de carreteras</option>
                  <option value="Empresa conservación">Empresa conservación</option>
                </select>
              </div>

              {/* Lista de Usuarios */}
              <div className="space-y-3">
                {filteredUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                        <FaUser className="text-sky-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">{user.name}</h4>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Activo' ? 'bg-green-100 text-green-800' :
                        user.status === 'Inactivo' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.status}
                      </span>
                      
                      <span className="px-2 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-medium">
                        {user.role}
                      </span>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => toggleUserStatus(user.id)}
                          className="p-2 text-gray-500 hover:text-sky-600 transition-colors"
                          title={user.status === 'Activo' ? 'Desactivar' : 'Activar'}
                        >
                          {user.status === 'Activo' ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        <button 
                          onClick={() => openRoleModal(user)}
                          className="p-2 text-gray-500 hover:text-green-600 transition-colors" 
                          title="Cambiar Rol"
                        >
                          <FaUserCog />
                        </button>
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-gray-500 hover:text-red-600 transition-colors" 
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel de Roles y Permisos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaShieldAlt className="text-sky-600" />
                Roles y Permisos
              </h3>
              
              <div className="space-y-4">
                {Object.entries(roles).map(([role, permissions]) => (
                  <div key={role} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                      <FaShieldAlt className="text-sky-600" />
                      {role}
                    </h4>
                    <ul className="space-y-1">
                      {permissions.map((permission, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para cambiar rol */}
      {showRoleModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Cambiar Rol de Usuario
              </h3>
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setEditingUser(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2 text-xs">
                <strong>Usuario:</strong> {editingUser.name}
              </p>
              <p className="text-gray-600 mb-4 text-xs">
                <strong>Email:</strong> {editingUser.email}
              </p>
              <p className="text-gray-600 mb-4 text-xs">
                <strong>Rol actual:</strong> 
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {editingUser.role}
                </span>
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Seleccionar nuevo rol:
              </label>
              <div className="space-y-2">
                {Object.keys(roles).map(role => (
                  <label key={role} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      defaultChecked={role === editingUser.role}
                      className="mr-3 text-sky-600 focus:ring-sky-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">{role}</div>
                      <div className="text-xs text-gray-600">
                        {roles[role].slice(0, 2).join(', ')}
                        {roles[role].length > 2 && '...'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setEditingUser(null);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const selectedRole = document.querySelector('input[name="role"]:checked')?.value;
                  if (selectedRole && selectedRole !== editingUser.role) {
                    changeUserRole(editingUser.id, selectedRole);
                  } else {
                    setShowRoleModal(false);
                    setEditingUser(null);
                  }
                }}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-xs"
              >
                Cambiar Rol
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar usuario */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-800">
                Agregar Nuevo Usuario
              </h3>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUser({ name: '', email: '', role: 'Demarcación de carreteras', status: 'Activo' });
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs"
                  placeholder="Ej: María García"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs"
                  placeholder="Ej: maria.garcia@empresa.com"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs"
                >
                  {Object.keys(roles).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-xs"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Pendiente">Pendiente</option>
                </select>
              </div>

              {/* Vista previa de permisos del rol seleccionado */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="text-xs font-medium text-gray-700 mb-2">
                  Permisos del rol "{newUser.role}":
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {roles[newUser.role]?.map((permission, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setNewUser({ name: '', email: '', role: 'Demarcación de carreteras', status: 'Activo' });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={addNewUser}
                disabled={!newUser.name.trim() || !newUser.email.trim()}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
              >
                Agregar Usuario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionUsuarios;
