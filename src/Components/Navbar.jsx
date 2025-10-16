import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { getDoc, doc } from 'firebase/firestore';
import Imagen from '../assets/tpf_marca.png'; // Asegúrate de que la ruta de la imagen está correcta
import { db } from '../../firebase_config';

import { FaUserAlt, FaDoorOpen, FaBars, FaCaretDown } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const proyecto = 'i8l2VQeDIIB7fs3kUQxA';
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [userNombre, setUserNombre] = useState('');
  const [userRol, setUserRol] = useState('');
  const [menuOpen, setMenuOpen] = useState(false); // Menú móvil
  const [dropdownOpen, setDropdownOpen] = useState(false); // Inventario
  const [dropdownInspectionOpen, setDropdownInspectionOpen] = useState(false); // Gestión
  const [dropdownMonitoringOpen, setDropdownMonitoringOpen] = useState(false); // Monitoreo
  const [dropdownConservacionOpen, setDropdownConservacionOpen] = useState(false); // Estado de conservación
  const [dropdownRehabilitacionOpen, setDropdownRehabilitacionOpen] = useState(false); // Actuaciones de rehabilitación
  const [dropdownUserOpen, setDropdownUserOpen] = useState(false); // Menú de usuario

  // Referencias para detectar clics fuera de los menús
  const dropdownRef = useRef(null);
  const inspectionRef = useRef(null);
  const monitoringRef = useRef(null);
  const conservacionRef = useRef(null);
  const rehabilitacionRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'usuarios', user.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserNombre(userData.nombre);
          setUserRol(userData.role);
        }
      });
    } else {
      setUserNombre('');
      setUserRol('');
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/authTabs');
    setShowLogoutConfirmation(false);
  };

  const toggleLogoutConfirmation = () => {
    setShowLogoutConfirmation(!showLogoutConfirmation);
    setMenuOpen(false)
  };

  const closeAllDropdowns = () => {
    setDropdownOpen(false);
    setDropdownInspectionOpen(false);
    setDropdownMonitoringOpen(false);
    setDropdownConservacionOpen(false);
    setDropdownRehabilitacionOpen(false);
    setDropdownUserOpen(false);
  };

  const handleDropdownClick = (dropdownSetter, currentState) => {
    dropdownSetter(!currentState);
  };



  const handleLinkClick = () => {
    closeAllDropdowns();
    setMenuOpen(false) // Cierra todos los menús al hacer clic en cualquier enlace
  };






  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    closeAllDropdowns();
  };

  return (
    <nav className="bg-gray-100 shadow">
      <div className="container mx-auto ps-0 pr-4 xl:px-10">
        {/* Título y Logo */}
        <div className="flex items-center justify-between gap-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity">
              <img className="h-auto" src={Imagen} width={120} alt="logo" />
            </Link>
            <h1 className="text-xl font-bold text-gray-500">
              Sistema de gestión de firmes de la RCE
            </h1>
          </div>
          
          {/* Menú de usuario en la parte superior */}
          {user && (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  closeAllDropdowns();
                  setDropdownUserOpen(!dropdownUserOpen);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:text-sky-600 hover:bg-gray-50"
              >
                <FaUserAlt />
                <span className="font-medium">{userNombre || 'Usuario'}</span>
                <FaCaretDown />
              </button>
              {dropdownUserOpen && (
                <div className="absolute right-0 bg-white shadow-lg rounded-md mt-2 py-2 w-56 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Usuario</p>
                    <p className="font-medium text-gray-700">{userNombre}</p>
                  </div>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    onClick={handleLinkClick}
                  >
                    Inicio
                  </Link>
                  {(userRol === 'admin' || userRol === 'usuario') && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      onClick={handleLinkClick}
                    >
                      Administración
                    </Link>
                  )}
                  <button
                    onClick={toggleLogoutConfirmation}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Barra de navegación con menú */}
        <div className="flex justify-between items-center h-16">
          {/* Espacio para el menú móvil */}
          <div></div>

          {menuOpen && (
            <div className="xl:hidden bg-white shadow-md absolute top-40 left-0 w-full z-50">
                <div className="flex flex-col space-y-4 p-4">


                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <div>
                      <button
                        onClick={() => handleDropdownClick(setDropdownInspectionOpen, dropdownInspectionOpen)}
                        className="flex justify-between items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        Gestión <FaCaretDown />
                      </button>
                      {dropdownInspectionOpen && (
                        <div className="pl-6">
                          {/* Campos anteriores comentados
                          <Link
                            to={`/elemento/${proyecto}`}
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Iniciar Inspección
                          </Link>
                          <Link
                            to="/dashboard"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/visor_inspeccion"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            BIM
                          </Link>
                          */}
                          
                          <Link
                            to="/noticias"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Noticias
                          </Link>
                          <Link
                            to="/foro"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Foro
                          </Link>
                          <Link
                            to="/descargas"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Descargas
                          </Link>
                          <Link
                            to="/documentacion"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Documentación Técnica
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <div>
                      <button
                        onClick={() => handleDropdownClick(setDropdownMonitoringOpen, dropdownMonitoringOpen)}
                        className="flex justify-between items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        Monitoreo <FaCaretDown />
                      </button>
                      {dropdownMonitoringOpen && (
                        <div className="pl-6">
                          <Link
                            to="/indicadores"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Indicadores - Estado de la red
                          </Link>
                          <Link
                            to="/seguimiento-administrativo"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Seguimiento Administrativo
                          </Link>
                          <Link
                            to="/prognosis-evolucion"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Prognosis de Evolución
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <div>
                      <button
                        onClick={() => handleDropdownClick(setDropdownOpen, dropdownOpen)}
                        className="flex justify-between items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        Inventario <FaCaretDown />
                      </button>
                      {dropdownOpen && (
                        <div className="pl-6">
                          <Link
                            to="/consultas"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Consultas
                          </Link>
                          <Link
                            to="/actualizacion"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Actualización
                          </Link>
                          <Link
                            to="/informe-anual"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Informe Anual
                          </Link>
                          {/* Opciones anteriores comentadas
                          <Link
                            to="/formularios"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Formulario
                          </Link>
                          <Link
                            to="/verRegistros"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Registros
                          </Link>
                          */}
                        </div>
                      )}
                    </div>
                  )}

                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <div>
                      <button
                        onClick={() => handleDropdownClick(setDropdownConservacionOpen, dropdownConservacionOpen)}
                        className="flex justify-between items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100"
                      >
                        Estado de conservación <FaCaretDown />
                      </button>
                      {dropdownConservacionOpen && (
                        <div className="pl-6">
                          <Link
                            to="/consultas-conservacion"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Consultas
                          </Link>
                          {/* Opciones anteriores comentadas
                          <Link
                            to="/auscultacion/llacuna"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Llacuna
                          </Link>
                          <Link
                            to="/auscultacion/glorias"
                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
                            onClick={handleLinkClick}
                          >
                            Glorias
                          </Link>
                          */}
                        </div>
                      )}
                    </div>
                  )}



                  {user && (
                    <div className='px-6 font-medium text-gray-500'>
                      <p className=''>Usuario: {userNombre}</p>
                      <button
                        onClick={toggleLogoutConfirmation}
                        className="bg-sky-600 text-white px-4 py-2 rounded-md text-left mt-5"
                      >
                        Salir
                      </button>
                    </div>

                  )}
                </div>
              </div>
            )}

          {/* Menú principal */}
            {user && (
              <div className="hidden xl:ml-6 xl:flex xl:space-x-8 items-center">

                {/* Inicio */}
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-md font-medium text-gray-500 hover:text-sky-600"
                  onClick={handleLinkClick}
                >
                  Inicio
                </Link>

                {/* Gestión */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative" ref={inspectionRef}>
                    <button
                      onClick={() => {
                        closeAllDropdowns(); // Cierra los otros dropdowns
                        setDropdownInspectionOpen(!dropdownInspectionOpen); // Alterna el estado del actual
                      }}
                      className="flex items-center gap-1 px-3 py-2 rounded-md text-md font-medium text-gray-500 hover:text-sky-600"
                    >
                      Gestión <FaCaretDown />
                    </button>
                    {dropdownInspectionOpen && (
                      <div className="absolute bg-white shadow-lg rounded-md mt-2 py-2 w-48 z-50">
                        {/* Campos anteriores comentados
                        <Link
                          to={`/elemento/${proyecto}`}
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Iniciar Inspección
                        </Link>
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/visor_inspeccion"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          BIM
                        </Link>
                        */}
                        
                        <Link
                          to="/noticias"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Noticias
                        </Link>
                        <Link
                          to="/foro"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Foro
                        </Link>
                        <Link
                          to="/descargas"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Descargas
                        </Link>
                        <Link
                          to="/documentacion"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Documentación Técnica
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Monitoreo */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative" ref={monitoringRef}>
                    <button
                      onClick={() => {
                        closeAllDropdowns(); // Cierra los otros dropdowns
                        setDropdownMonitoringOpen(!dropdownMonitoringOpen); // Alterna el estado del actual
                      }}
                      className="flex items-center gap-1 px-3 py-2 rounded-md text-md font-medium text-gray-500 hover:text-sky-600"
                    >
                      Monitoreo <FaCaretDown />
                    </button>
                    {dropdownMonitoringOpen && (
                      <div className="absolute bg-white shadow-lg rounded-md mt-2 py-2 w-64 z-50">
                        <Link
                          to="/indicadores"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Indicadores - Estado de la red
                        </Link>
                        <Link
                          to="/seguimiento-administrativo"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Seguimiento Administrativo
                        </Link>
                        <Link
                          to="/prognosis-evolucion"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Prognosis de Evolución
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Parte de obra */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => {
                        closeAllDropdowns(); // Cierra los otros dropdowns
                        setDropdownOpen(!dropdownOpen); // Alterna el estado del actual
                      }}
                      className="flex items-center gap-1 px-3 py-2 rounded-md text-md font-medium text-gray-500 hover:text-sky-600"
                    >
                      Inventario <FaCaretDown />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute bg-white shadow-lg rounded-md mt-2 py-2 w-48 z-50">
                        <Link
                          to="/consultas"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Consultas
                        </Link>
                        <Link
                          to="/actualizacion"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Actualización
                        </Link>
                        <Link
                          to="/informe-anual"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Informe Anual
                        </Link>
                        {/* Opciones anteriores comentadas
                        <Link
                          to="/formularios"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Formulario
                        </Link>
                        <Link
                          to="/verRegistros"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Registros
                        </Link>
                        */}
                      </div>
                    )}
                  </div>
                )}

                {/* Auscultación */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative" ref={conservacionRef}>
                    <button
                      onClick={() => {
                        closeAllDropdowns(); // Cierra los otros dropdowns
                        setDropdownConservacionOpen(!dropdownConservacionOpen); // Alterna el estado del actual
                      }}
                      className="flex items-center gap-1 px-3 py-2 rounded-md text-md font-medium text-gray-500 hover:text-sky-600"
                    >
                      Estado de conservación <FaCaretDown />
                    </button>
                    {dropdownConservacionOpen && (
                      <div className="absolute bg-white shadow-lg rounded-md mt-2 py-2 w-48 z-50">
                        <Link
                          to="/consultas-conservacion"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Consultas
                        </Link>
                        {/* Opciones anteriores comentadas
                        <Link
                          to="/auscultacion/llacuna"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Llacuna
                        </Link>
                        <Link
                          to="/auscultacion/glorias"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Glorias
                        </Link>
                        */}
                      </div>
                    )}
                  </div>
                )}

                {(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative" ref={rehabilitacionRef}>
                    <button
                      onClick={() => {
                        closeAllDropdowns(); // Cierra los otros dropdowns
                        setDropdownRehabilitacionOpen(!dropdownRehabilitacionOpen); // Alterna el estado del actual
                      }}
                      className="flex items-center gap-1 px-3 py-2 rounded-md text-md font-medium text-gray-500 hover:text-sky-600"
                    >
                      Actuaciones de rehabilitación <FaCaretDown />
                    </button>
                    {dropdownRehabilitacionOpen && (
                      <div className="absolute bg-white shadow-lg rounded-md mt-2 py-2 w-48 z-50">
                        <Link
                          to="/poe"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          P.O.E
                        </Link>
                        <Link
                          to="/ordenes-estudios"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Ordenes de estudios
                        </Link>
                        {/* Opciones anteriores comentadas
                        <Link
                          to="/auscultacion/llacuna"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Llacuna
                        </Link>
                        <Link
                          to="/auscultacion/glorias"
                          className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                          onClick={handleLinkClick}
                        >
                          Glorias
                        </Link>
                        */}
                      </div>
                    )}
                  </div>
                )}

{(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative">
                    <Link
                      to="/mapa-interactivo"
                      className="px-3 py-2 rounded-md text-md font-medium text-gray-500 hover:text-sky-600"
                      onClick={handleLinkClick}
                    >
                      Mapa interactivo
                    </Link>
                  </div>
                )}

{(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative">
                    <Link
                      to="/fichas"
                      className="px-3 py-2 rounded-md text-md font-medium text-gray-500 hover:text-sky-600"
                      onClick={handleLinkClick}
                    >
                      Fichas
                    </Link>
                  </div>
                )}

              </div>
            )}

          {/* Botón hamburguesa móvil */}
          <div className="flex items-center">
            {user ? (
              <div className="xl:hidden">
                <button onClick={toggleMenu} className="text-gray-500 focus:outline-none">
                  <FaBars className="text-2xl" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/authTabs')}
                className="bg-sky-600 text-white font-medium py-2 px-4 h-12 rounded-lg"
              >
                Iniciar sesión | Registrarse
              </button>
            )}
          </div>
        </div>

        {/* Modal de confirmación de logout */}
        {showLogoutConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-10 flex justify-center items-center">
            <div className="bg-white p-10 rounded-md flex flex-col gap-2 items-center">
              <p className="text-gray-500 text-7xl"><FaDoorOpen /></p>
              <p className="text-gray-500 font-bold">¿Estás seguro que quieres cerrar sesión?</p>
              <div className="flex justify-around gap-5 mt-4 p-1">
                <button onClick={handleLogout} className="bg-amber-600 text-white font-medium px-4 py-2 rounded-lg">Confirmar</button>
                <button onClick={() => setShowLogoutConfirmation(false)} className="bg-gray-300 text-black px-10 py-2 rounded-lg">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const NavLink = ({ to, linkName, onClick }) => (
  <Link to={to} onClick={onClick} className="xl:px-4 px-6 py-2 font-medium rounded-md text-gray-500 hover:text-sky-600">
    {linkName}
  </Link>
);

export default Navbar;

