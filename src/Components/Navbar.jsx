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
  const [dropdownDatosGeneralesOpen, setDropdownDatosGeneralesOpen] = useState(false); // Datos generales
  const [dropdownInventarioOpen, setDropdownInventarioOpen] = useState(false); // Inventario de red
  const [dropdownOrdenesOpen, setDropdownOrdenesOpen] = useState(false); // Órdenes de estudio
  const [dropdownActuacionesOpen, setDropdownActuacionesOpen] = useState(false); // Actuaciones
  const [dropdownCampañasOpen, setDropdownCampañasOpen] = useState(false); // Campañas de auscultación
  const [dropdownAnalisisOpen, setDropdownAnalisisOpen] = useState(false); // Análisis evolutivo
  const [dropdownGISOpen, setDropdownGISOpen] = useState(false); // GIS submenu
  const [dropdownPresupuestoOpen, setDropdownPresupuestoOpen] = useState(false); // Presupuesto conservación
  const [dropdownCVFOpen, setDropdownCVFOpen] = useState(false); // CVF
  const [dropdownACVFOpen, setDropdownACVFOpen] = useState(false); // ACVF
  const [dropdownOtrosOpen, setDropdownOtrosOpen] = useState(false); // Otros
  const [dropdownPowerBIOpen, setDropdownPowerBIOpen] = useState(false); // Power BI
  const [dropdownUserOpen, setDropdownUserOpen] = useState(false); // Menú de usuario

  // Referencias para detectar clics fuera de los menús
  const datosGeneralesRef = useRef(null);
  const inventarioRef = useRef(null);
  const ordenesRef = useRef(null);
  const actuacionesRef = useRef(null);
  const campañasRef = useRef(null);
  const analisisRef = useRef(null);
  const gisRef = useRef(null);
  const presupuestoRef = useRef(null);
  const cvfRef = useRef(null);
  const acvfRef = useRef(null);
  const otrosRef = useRef(null);
  const powerBIRef = useRef(null);
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
    setDropdownDatosGeneralesOpen(false);
    setDropdownInventarioOpen(false);
    setDropdownOrdenesOpen(false);
    setDropdownActuacionesOpen(false);
    setDropdownCampañasOpen(false);
    setDropdownAnalisisOpen(false);
    setDropdownGISOpen(false);
    setDropdownPresupuestoOpen(false);
    setDropdownCVFOpen(false);
    setDropdownACVFOpen(false);
    setDropdownOtrosOpen(false);
    setDropdownPowerBIOpen(false);
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
        <div className="flex items-center justify-between gap-4 py-2 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity">
              <img className="h-auto" src={Imagen} width={100} alt="logo" />
            </Link>
            <h1 className="text-sm font-medium text-gray-500 hidden lg:block">
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
                className="flex items-center gap-2 px-2 py-1.5 rounded text-sm font-medium text-gray-500 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
              >
                <FaUserAlt className="text-sm" />
                <span>{userNombre || 'Usuario'}</span>
                <FaCaretDown className="text-xs" />
              </button>
              {dropdownUserOpen && (
                <div className="absolute right-0 bg-white shadow-xl rounded-lg mt-2 py-2 w-56 z-50 border border-gray-100">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-xs text-gray-500">Usuario</p>
                    <p className="font-medium text-gray-700 text-sm">{userNombre}</p>
                  </div>
                  <Link
                    to="/"
                    className="block px-4 py-2.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                    onClick={handleLinkClick}
                  >
                    Inicio
                  </Link>
                  {(userRol === 'admin' || userRol === 'usuario') && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                      onClick={handleLinkClick}
                    >
                      Administración
                    </Link>
                  )}
                  <button
                    onClick={toggleLogoutConfirmation}
                    className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm transition-colors duration-150"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Barra de navegación con menú */}
        <div className="flex justify-between items-center h-10">
          {/* Espacio para el menú móvil */}
          <div></div>

          {menuOpen && (
            <div className="xl:hidden bg-white shadow-xl absolute top-32 left-0 w-full z-50 rounded-lg mx-4 border border-gray-100">
                <div className="flex flex-col space-y-2 p-3">

                  {/* Dashboard - Oculto temporalmente */}
                  {/* {(userRol === 'usuario' || userRol === 'admin') && (
                    <Link
                      to="/dashboard-firmes"
                      className="block px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm font-medium rounded transition-colors duration-150"
                      onClick={handleLinkClick}
                    >
                      Dashboard
                    </Link>
                  )} */}

                  {/* Datos generales */}
                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <div>
                      <button
                        onClick={() => handleDropdownClick(setDropdownDatosGeneralesOpen, dropdownDatosGeneralesOpen)}
                        className="flex justify-between items-center w-full text-left px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm rounded transition-colors duration-150"
                      >
                        Datos generales <FaCaretDown />
                      </button>
                      {dropdownDatosGeneralesOpen && (
                        <div className="pl-6">
                          <Link
                            to="/mapa-trafico"
                            className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                            onClick={handleLinkClick}
                          >
                            Mapa de tráfico
                          </Link>
                          <Link
                            to="/aemet"
                            className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                            onClick={handleLinkClick}
                          >
                            AEMET
                          </Link>
                          <Link
                            to="/boe"
                            className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                            onClick={handleLinkClick}
                          >
                            BOE
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Inventario de red */}
                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <div>
                      <button
                        onClick={() => handleDropdownClick(setDropdownInventarioOpen, dropdownInventarioOpen)}
                        className="flex justify-between items-center w-full text-left px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm rounded transition-colors duration-150"
                      >
                        Inventario de red <FaCaretDown />
                      </button>
                      {dropdownInventarioOpen && (
                        <div className="pl-6">
                          <Link
                            to="/consultas"
                            className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                            onClick={handleLinkClick}
                          >
                            Consultas
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Órdenes de estudio */}
                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <Link
                      to="/ordenes-estudio"
                      className="block px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm font-medium rounded transition-colors duration-150"
                      onClick={handleLinkClick}
                    >
                      Órdenes de estudio (GECO)
                    </Link>
                  )}

                  {/* Actuaciones */}
                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <Link
                      to="/actuaciones"
                      className="block px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm font-medium rounded transition-colors duration-150"
                      onClick={handleLinkClick}
                    >
                      Actuaciones
                    </Link>
                  )}

                  {/* Campañas de auscultación */}
                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <Link
                      to="/campañas-auscultacion"
                      className="block px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm font-medium rounded transition-colors duration-150"
                      onClick={handleLinkClick}
                    >
                      Campañas de auscultación
                    </Link>
                  )}

                  {/* Análisis evolutivo */}
                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <div>
                      <button
                        onClick={() => setDropdownAnalisisOpen(!dropdownAnalisisOpen)}
                        className="flex justify-between items-center w-full text-left px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm rounded transition-colors duration-150"
                      >
                        Análisis evolutivo
                        <FaCaretDown className={`transition-transform duration-200 ${dropdownAnalisisOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {dropdownAnalisisOpen && (
                        <div className="pl-4">
                          {/* GIS submenu */}
                          <div>
                            <button
                              onClick={() => setDropdownGISOpen(!dropdownGISOpen)}
                              className="flex justify-between items-center w-full text-left px-4 py-2.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                            >
                              GIS
                              <FaCaretDown className={`transition-transform duration-200 ${dropdownGISOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {dropdownGISOpen && (
                              <div className="pl-4">
                                <Link
                                  to="/indicadores"
                                  className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                                  onClick={handleLinkClick}
                                >
                                  Indicadores
                                </Link>
                                <Link
                                  to="/prognosis-evolucion"
                                  className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                                  onClick={handleLinkClick}
                                >
                                  Prognosis
                                </Link>
                                <Link
                                  to="/seguimiento-administrativo"
                                  className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                                  onClick={handleLinkClick}
                                >
                                  Seguimiento administrativo
                                </Link>
                              </div>
                            )}
                          </div>
                          {/* Dashboard */}
                          <Link
                            to="/dashboard-firmes"
                            className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                            onClick={handleLinkClick}
                          >
                            Dashboard
                          </Link>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Presupuesto conservación */}
                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <Link
                      to="/presupuesto-conservacion"
                      className="block px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm font-medium rounded transition-colors duration-150"
                      onClick={handleLinkClick}
                    >
                      Presupuesto conservación
                    </Link>
                  )}

                  {/* CVF */}
                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <Link
                      to="/cvf"
                      className="block px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm font-medium rounded transition-colors duration-150"
                      onClick={handleLinkClick}
                    >
                      CVF
                    </Link>
                  )}

                  {/* ACVF */}
                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <div>
                      <button
                        onClick={() => handleDropdownClick(setDropdownACVFOpen, dropdownACVFOpen)}
                        className="flex justify-between items-center w-full text-left px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm rounded transition-colors duration-150"
                      >
                        ACVF <FaCaretDown />
                      </button>
                      {dropdownACVFOpen && (
                        <div className="pl-6">
                          {[1,2,4].map((n) => (
                            <Link
                              key={n}
                              to={`/acvf/opcion-${n}`}
                              className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                              onClick={handleLinkClick}
                            >
                              Opción {n}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Otros */}
                  {(userRol === 'usuario' || userRol === 'admin') && (
                    <div>
                      <button
                        onClick={() => handleDropdownClick(setDropdownOtrosOpen, dropdownOtrosOpen)}
                        className="flex justify-between items-center w-full text-left px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm rounded transition-colors duration-150"
                      >
                        Otros <FaCaretDown />
                      </button>
                      {dropdownOtrosOpen && (
                        <div className="pl-6">
                          <button
                            onClick={() => handleDropdownClick(setDropdownPowerBIOpen, dropdownPowerBIOpen)}
                            className="flex justify-between items-center w-full text-left px-3 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm rounded transition-colors duration-150"
                          >
                            Power BI <FaCaretDown />
                          </button>
                          {dropdownPowerBIOpen && (
                            <div className="pl-6">
                              <Link
                                to="/auscultacion/llacuna"
                                className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                                onClick={handleLinkClick}
                              >
                                Llacuna
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {user && (
                    <div className='px-4 font-medium text-gray-500'>
                      <p className='text-xs'>Usuario: {userNombre}</p>
                      <button
                        onClick={toggleLogoutConfirmation}
                        className="bg-sky-600 text-white px-3 py-1.5 rounded text-xs text-left mt-3"
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
              <div className="hidden xl:ml-4 xl:flex xl:space-x-1 items-center">

                {/* Inicio */}
                <Link
                  to="/"
                  className="px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                  onClick={handleLinkClick}
                >
                  Inicio
                </Link>

                {/* Dashboard - Oculto temporalmente */}
                {/* {(userRol === 'usuario' || userRol === 'admin') && (
                  <Link
                    to="/dashboard-firmes"
                    className="px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                    onClick={handleLinkClick}
                  >
                    Dashboard
                  </Link>
                )} */}

                {/* Datos generales */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative" ref={datosGeneralesRef}>
                    <button
                      onClick={() => {
                        closeAllDropdowns();
                        setDropdownDatosGeneralesOpen(!dropdownDatosGeneralesOpen);
                      }}
                      className="flex items-center gap-1 px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      Datos generales <FaCaretDown />
                    </button>
                    {dropdownDatosGeneralesOpen && (
                      <div className="absolute bg-white shadow-xl rounded-lg mt-2 py-2 w-52 z-50 border border-gray-100">
                        <Link
                          to="/mapa-trafico"
                          className="block px-4 py-2.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                          onClick={handleLinkClick}
                        >
                          Mapa de tráfico
                        </Link>
                        <Link
                          to="/aemet"
                          className="block px-4 py-2.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                          onClick={handleLinkClick}
                        >
                          AEMET
                        </Link>
                        <Link
                          to="/boe"
                          className="block px-4 py-2.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                          onClick={handleLinkClick}
                        >
                          BOE
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Inventario de red */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative" ref={inventarioRef}>
                    <button
                      onClick={() => {
                        closeAllDropdowns();
                        setDropdownInventarioOpen(!dropdownInventarioOpen);
                      }}
                      className="flex items-center gap-1 px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      Inventario de red <FaCaretDown />
                    </button>
                    {dropdownInventarioOpen && (
                      <div className="absolute bg-white shadow-xl rounded-lg mt-2 py-2 w-52 z-50 border border-gray-100">
                        <Link
                          to="/consultas"
                          className="block px-4 py-2.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                          onClick={handleLinkClick}
                        >
                          Consultas
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Órdenes de estudio */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <Link
                    to="/ordenes-estudio"
                    className="px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                    onClick={handleLinkClick}
                  >
                    Órdenes de estudio (GECO)
                  </Link>
                )}

                {/* Actuaciones */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <Link
                    to="/actuaciones"
                    className="px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                    onClick={handleLinkClick}
                  >
                    Actuaciones
                  </Link>
                )}

                {/* Campañas de auscultación */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <Link
                    to="/campañas-auscultacion"
                    className="px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                    onClick={handleLinkClick}
                  >
                    Campañas de auscultación
                  </Link>
                )}

                {/* Análisis evolutivo */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative" ref={analisisRef}>
                    <button
                      onClick={() => {
                        closeAllDropdowns();
                        setDropdownAnalisisOpen(!dropdownAnalisisOpen);
                      }}
                      className="flex items-center gap-1 px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      Análisis evolutivo <FaCaretDown />
                    </button>
                    {dropdownAnalisisOpen && (
                      <div className="absolute bg-white shadow-xl rounded-lg mt-2 py-2 w-52 z-50 border border-gray-100">
                        {/* GIS submenu */}
                        <div className="relative" ref={gisRef}>
                          <button
                            onClick={() => {
                              setDropdownGISOpen(!dropdownGISOpen);
                            }}
                            className="flex items-center justify-between w-full px-4 py-2.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                          >
                            GIS
                            <FaCaretDown className={`transition-transform duration-200 ${dropdownGISOpen ? 'rotate-180' : ''}`} />
                          </button>
                          {dropdownGISOpen && (
                            <div className="absolute left-full top-0 ml-1 bg-white shadow-xl rounded-lg py-2 w-56 z-50 border border-gray-100">
                              <Link
                                to="/indicadores"
                                className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                                onClick={handleLinkClick}
                              >
                                Indicadores
                              </Link>
                              <Link
                                to="/prognosis-evolucion"
                                className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                                onClick={handleLinkClick}
                              >
                                Prognosis
                              </Link>
                              <Link
                                to="/seguimiento-administrativo"
                                className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                                onClick={handleLinkClick}
                              >
                                Seguimiento administrativo
                              </Link>
                            </div>
                          )}
                        </div>
                        {/* Dashboard */}
                        <Link
                          to="/dashboard-firmes"
                          className="block px-4 py-2.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                          onClick={handleLinkClick}
                        >
                          Dashboard
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Presupuesto conservación */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <Link
                    to="/presupuesto-conservacion"
                    className="px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                    onClick={handleLinkClick}
                  >
                    Presupuesto conservación
                  </Link>
                )}

                {/* CVF */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <Link
                    to="/cvf"
                    className="px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                    onClick={handleLinkClick}
                  >
                    CVF
                  </Link>
                )}

                {/* ACVF */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative" ref={acvfRef}>
                    <button
                      onClick={() => {
                        closeAllDropdowns();
                        setDropdownACVFOpen(!dropdownACVFOpen);
                      }}
                      className="flex items-center gap-1 px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      ACVF <FaCaretDown />
                    </button>
                    {dropdownACVFOpen && (
                      <div className="absolute bg-white shadow-xl rounded-lg mt-2 py-2 w-52 z-50 border border-gray-100">
                        {[1,2,4].map((n) => (
                          <Link
                            key={n}
                            to={`/acvf/opcion-${n}`}
                            className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                            onClick={handleLinkClick}
                          >
                            Opción {n}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Otros */}
                {(userRol === 'usuario' || userRol === 'admin') && (
                  <div className="relative" ref={otrosRef}>
                    <button
                      onClick={() => {
                        closeAllDropdowns();
                        setDropdownOtrosOpen(!dropdownOtrosOpen);
                      }}
                      className="flex items-center gap-1 px-2 py-1.5 rounded text-sm font-medium text-gray-600 hover:text-sky-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      Otros <FaCaretDown />
                    </button>
                    {dropdownOtrosOpen && (
                      <div className="absolute bg-white shadow-xl rounded-lg mt-2 py-2 w-52 z-50 border border-gray-100">
                        <div className="relative" ref={powerBIRef}>
                          <button
                            onClick={() => {
                              setDropdownPowerBIOpen(!dropdownPowerBIOpen);
                            }}
                            className="flex items-center justify-between w-full px-4 py-2.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                          >
                            Power BI <FaCaretDown />
                          </button>
                          {dropdownPowerBIOpen && (
                            <div className="absolute left-full top-0 bg-white shadow-xl rounded-lg py-2 w-48 z-50 border border-gray-100">
                              <Link
                                to="/auscultacion/llacuna"
                                className="block px-3 py-1.5 text-gray-600 hover:bg-sky-50 hover:text-sky-600 text-sm transition-colors duration-150"
                                onClick={handleLinkClick}
                              >
                                Llacuna
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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



