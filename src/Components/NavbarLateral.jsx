import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase_config';
import { 
  FaUserAlt, 
  FaDoorOpen, 
  FaBars, 
  FaCaretDown, 
  FaHome,
  FaDatabase,
  FaClipboardList,
  FaChartBar,
  FaCalendarAlt,
  FaLeaf,
  FaCog,
  FaTachometerAlt,
  FaBell,
  FaFileAlt,
  FaExternalLinkAlt,
  FaGlobe,
  FaDollarSign,
  FaSearch,
  FaUserCog
} from "react-icons/fa";

const NavbarLateral = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [userNombre, setUserNombre] = useState('Rodrigo López');
  const [userRol, setUserRol] = useState('');
  const [dropdownUserOpen, setDropdownUserOpen] = useState(false);
  const [dropdownDatosGeneralesOpen, setDropdownDatosGeneralesOpen] = useState(false);
  const [dropdownInventarioOpen, setDropdownInventarioOpen] = useState(false);
  const [dropdownActuacionesOpen, setDropdownActuacionesOpen] = useState(false);
  const [dropdownCampañasOpen, setDropdownCampañasOpen] = useState(false);
  const [dropdownAnalisisOpen, setDropdownAnalisisOpen] = useState(false);
  const [dropdownGISOpen, setDropdownGISOpen] = useState(false);
  const [dropdownPresupuestoOpen, setDropdownPresupuestoOpen] = useState(false);
  const [dropdownCVFOpen, setDropdownCVFOpen] = useState(false);
  const [dropdownACVFOpen, setDropdownACVFOpen] = useState(false);
  const [dropdownOtrosOpen, setDropdownOtrosOpen] = useState(false);
  const [dropdownPowerBIOpen, setDropdownPowerBIOpen] = useState(false);

  const userRef = useRef(null);

  useEffect(() => {
    // Siempre mostrar Rodrigo López independientemente del usuario autenticado
    setUserNombre('Rodrigo López');
    setUserRol('Administrador');
  }, [user]);

  const closeAllDropdowns = () => {
    setDropdownUserOpen(false);
    setDropdownDatosGeneralesOpen(false);
    setDropdownInventarioOpen(false);
    setDropdownActuacionesOpen(false);
    setDropdownCampañasOpen(false);
    setDropdownAnalisisOpen(false);
    setDropdownGISOpen(false);
    setDropdownPresupuestoOpen(false);
    setDropdownCVFOpen(false);
    setDropdownACVFOpen(false);
    setDropdownOtrosOpen(false);
    setDropdownPowerBIOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = (e, keepParentOpen = false) => {
    if (!keepParentOpen) {
      closeAllDropdowns();
    }
  };

  return (
    <aside className="w-64 bg-slate-800 text-white flex flex-col flex-shrink-0 h-screen">
      {/* Logo */}
      <div className="flex flex-col items-center justify-center border-b border-slate-700 px-4 py-4">
        <img 
          src="/logo_blanco.png" 
          alt="Logo SAGF" 
          className="w-18 h-14 object-contain mb-2 pr-8"
        />
        <h1 className="text-2xl font-bold text-white mb-1">SAGF</h1>
        <p className="text-xs text-slate-300 text-center leading-tight">
          Sistema Avanzado de Gestión de Firmes
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Inicio */}
        <Link
          to="/"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
            isActive('/') 
              ? 'bg-slate-700 text-white' 
              : 'hover:bg-slate-700 text-slate-300'
          }`}
        >
          <FaHome className="w-5 h-5" />
          <span className="text-sm font-medium">Inicio</span>
        </Link>

        {/* Datos generales */}
        <div>
            <button
              onClick={() => {
                setDropdownDatosGeneralesOpen(!dropdownDatosGeneralesOpen);
              }}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-slate-700 text-slate-300"
            >
              <div className="flex items-center gap-3">
                <FaGlobe className="w-5 h-5" />
                <span className="text-sm font-medium">Datos generales</span>
              </div>
              <FaCaretDown className={`w-3 h-3 transition-transform ${dropdownDatosGeneralesOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownDatosGeneralesOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <div className="block px-4 py-2 rounded-lg text-sm text-slate-400 cursor-pointer hover:bg-slate-700 hover:text-white transition-colors">
                  Mapa de tráfico
                </div>
                <div className="block px-4 py-2 rounded-lg text-sm text-slate-400 cursor-pointer hover:bg-slate-700 hover:text-white transition-colors">
                  AEMET
                </div>
                <a
                  href="https://iris.tpf.be/siteAssist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  BOE
                </a>
              </div>
            )}
          </div>

        {/* Inventario de red */}
        <div>
            <button
              onClick={() => {
                setDropdownInventarioOpen(!dropdownInventarioOpen);
              }}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-slate-700 text-slate-300"
            >
              <div className="flex items-center gap-3">
                <FaDatabase className="w-5 h-5" />
                <span className="text-sm font-medium">Inventario de red</span>
              </div>
              <FaCaretDown className={`w-3 h-3 transition-transform ${dropdownInventarioOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownInventarioOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/consultas"
                  onClick={(e) => handleLinkClick(e, true)}
                  className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Consultas
                </Link>
                <Link
                  to="/prognosis-evolucion"
                  onClick={(e) => handleLinkClick(e, true)}
                  className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Estado del firme
                </Link>
              </div>
            )}
          </div>

        {/* Actuaciones */}
        <Link
            to="/actuaciones"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive('/actuaciones') 
                ? 'bg-slate-700 text-white' 
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <FaClipboardList className="w-5 h-5" />
            <span className="text-sm font-medium">Actuaciones</span>
          </Link>

        {/* Campañas de auscultación */}
        <div>
            <button
              onClick={() => {
                setDropdownCampañasOpen(!dropdownCampañasOpen);
              }}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-slate-700 text-slate-300"
            >
              <div className="flex items-center text-left gap-3">
                <FaSearch className="w-5 h-5" />
                <span className="text-sm font-medium">Campañas de auscultación</span>
              </div>
              <FaCaretDown className={`w-3 h-3 transition-transform ${dropdownCampañasOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownCampañasOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/tablaPpi"
                  onClick={(e) => handleLinkClick(e, true)}
                  className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Carretera A-67
                </Link>
              </div>
            )}
          </div>

        {/* Análisis evolutivo */}
        <div>
            <button
              onClick={() => {
                setDropdownAnalisisOpen(!dropdownAnalisisOpen);
              }}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-slate-700 text-slate-300"
            >
              <div className="flex items-center gap-3">
                <FaChartBar className="w-5 h-5" />
                <span className="text-sm font-medium">Análisis evolutivo</span>
              </div>
              <FaCaretDown className={`w-3 h-3 transition-transform ${dropdownAnalisisOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownAnalisisOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {/* GIS submenu */}
                <div>
                  <button
                    onClick={() => setDropdownGISOpen(!dropdownGISOpen)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-slate-700 text-slate-300"
                  >
                    <span className="text-sm">GIS</span>
                    <FaCaretDown className={`w-3 h-3 transition-transform ${dropdownGISOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownGISOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      <Link
                        to="/indicadores"
                        onClick={(e) => handleLinkClick(e, true)}
                        className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        Indicadores
                      </Link>
                      <Link
                        to="/seguimiento-administrativo"
                        onClick={(e) => handleLinkClick(e, true)}
                        className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        Seguimiento Administrativo
                      </Link>
                      <Link
                        to="/prognosis-evolucion"
                        onClick={(e) => handleLinkClick(e, true)}
                        className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        Prognosis Evolución
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Dashboard Firmes - mismo nivel que GIS */}
                <Link
                  to="/dashboard-firmes"
                  onClick={(e) => handleLinkClick(e, true)}
                  className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Dashboard Firmes
                </Link>
              </div>
            )}
          </div>

        {/* Presupuesto conservación */}
        <Link
            to="/presupuesto-conservacion"
            onClick={handleLinkClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive('/presupuesto-conservacion') 
                ? 'bg-slate-700 text-white' 
                : 'hover:bg-slate-700 text-slate-300'
            }`}
          >
            <FaDollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Presupuesto conservación</span>
          </Link>


        {/* ACV */}
        <div>
            <button
              onClick={() => {
                setDropdownACVFOpen(!dropdownACVFOpen);
              }}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-slate-700 text-slate-300"
            >
              <div className="flex items-center gap-3">
                <FaFileAlt className="w-5 h-5" />
                <span className="text-sm font-medium">ACV</span>
              </div>
              <FaCaretDown className={`w-3 h-3 transition-transform ${dropdownACVFOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownACVFOpen && (
              <div className="ml-8 mt-1 space-y-1">
                <Link
                  to="/acv/analisis-ciclo-vida"
                  onClick={(e) => handleLinkClick(e, true)}
                  className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Análisis ciclo de vida
                </Link>
                <Link
                  to="/acv/cronograma"
                  onClick={(e) => handleLinkClick(e, true)}
                  className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  Cronograma
                </Link>
              </div>
            )}
          </div>

        {/* Otros */}
        <div>
            <button
              onClick={() => {
                setDropdownOtrosOpen(!dropdownOtrosOpen);
              }}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-colors hover:bg-slate-700 text-slate-300"
            >
              <div className="flex items-center gap-3">
                <FaCog className="w-5 h-5" />
                <span className="text-sm font-medium">Otros</span>
              </div>
              <FaCaretDown className={`w-3 h-3 transition-transform ${dropdownOtrosOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOtrosOpen && (
              <div className="ml-8 mt-1 space-y-1">
                {/* Power BI submenu */}
                <div>
                  <button
                    onClick={() => setDropdownPowerBIOpen(!dropdownPowerBIOpen)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-slate-700 text-slate-300"
                  >
                    <span className="text-sm">Power BI</span>
                    <FaCaretDown className={`w-3 h-3 transition-transform ${dropdownPowerBIOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownPowerBIOpen && (
                    <div className="ml-8 mt-1 space-y-1">
                      <Link
                        to="/auscultacion/llacuna"
                        onClick={(e) => handleLinkClick(e, true)}
                        className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        Llacuna
                      </Link>
                      <Link
                        to="/auscultacion/llacuna"
                        onClick={(e) => handleLinkClick(e, true)}
                        className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        Glorias
                      </Link>
                      <Link
                        to="/auscultacion/llacuna"
                        onClick={(e) => handleLinkClick(e, true)}
                        className="block px-4 py-2 rounded-lg text-sm transition-colors text-slate-300 hover:bg-slate-700 hover:text-white"
                      >
                        Horta
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700">
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              closeAllDropdowns();
              setDropdownUserOpen(!dropdownUserOpen);
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors hover:bg-slate-700 text-slate-300"
          >
            <FaUserAlt className="w-4 h-4" />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{userNombre || 'Usuario'}</div>
              <div className="text-xs text-slate-400">{userRol || 'Administrador'}</div>
            </div>
            <FaCaretDown className={`w-3 h-3 transition-transform ${dropdownUserOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <Link
                to="/gestion-usuarios"
                onClick={() => setDropdownUserOpen(false)}
                className="flex items-center gap-3 w-full px-3 py-2 mt-2 text-xs text-slate-400 hover:bg-slate-700 hover:text-slate-200 rounded-lg transition-colors"
              >
                <FaUserCog className="text-xl" />
                Gestión de usuarios
              </Link>
        </div>
        
        {/* TPF Logo */}
        <div className="mt-4 pt-4 border-t border-slate-600">
          <div className="flex items-center gap-2">
            <div className="w- h-8 bg-white rounded flex items-center justify-center">
              <span className="text-slate-800 font-bold text-xs">TPF</span>
            </div>
            <div>
              <p className="text-xs text-slate-300 font-medium">TPF Ingeniería</p>
              <p className="text-xs text-slate-400">Sistema SAGF</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar cierre de sesión</h3>
            <p className="text-gray-600 mb-6">¿Estás seguro de que quieres cerrar sesión?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutConfirmation(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/authTabs');
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default NavbarLateral;
