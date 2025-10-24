import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import HeaderPage from '../../Components/HeaderPage';
import FormularioInspeccion from '../../Components/FormularioInspeccion';
import ViewerComponent from '../BIM/ViewerComponent';
import * as OBC from "openbim-components";
import * as THREE from "three";
import { db } from '../../../firebase_config';
import { getDoc, getDocs, doc, collection, addDoc, runTransaction, writeBatch, setDoc, query, where, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';
import { 
  FaSearch, 
  FaFilter, 
  FaTable, 
  FaTh, 
  FaFilePdf, 
  FaEdit, 
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClipboardList,
  FaChartBar,
  FaDownload,
  FaPrint,
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
  FaCog,
  FaHome,
  FaRoad,
  FaHardHat,
  FaTools,
  FaClipboardCheck,
  FaFileAlt,
  FaImage,
  FaCamera,
  FaMapPin,
  FaFlag,
  FaCheck,
  FaBan,
  FaPlay,
  FaPause,
  FaStop,
  FaSync,
  FaUpload,
  FaCloud,
  FaDatabase,
  FaServer,
  FaNetworkWired,
  FaWifi,
  FaSignal,
  FaBatteryFull,
  FaBatteryHalf,
  FaBatteryEmpty,
  FaThermometerHalf,
  FaTachometerAlt
} from 'react-icons/fa';

const TablaPpi = () => {
  const { idLote, ppiNombre } = useParams();
  const [activeTab, setActiveTab] = useState('tabla');
  const [filtros, setFiltros] = useState({
    carretera: '',
    estado: '',
    responsable: '',
    actividad: '',
    fecha: ''
  });
  const [inspecciones, setInspecciones] = useState([]);
  const [inspeccionesFiltradas, setInspeccionesFiltradas] = useState([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [vista, setVista] = useState('tabla'); // 'tabla' o 'grid'
  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showFormularioModal, setShowFormularioModal] = useState(false);
  const [inspeccionSeleccionadaFormulario, setInspeccionSeleccionadaFormulario] = useState(null);
  const [newInspeccion, setNewInspeccion] = useState({
    actividad: '',
    subactividad: '',
    criterio: '',
    documento: '',
    tipo: '',
    punto: '',
    responsable: '',
    nombre: '',
    fecha: '',
    resultado: '',
    pdf: false,
    editar: true,
    estado: 'Pendiente'
  });
  const [resultadoInspeccion, setResultadoInspeccion] = useState('');
  const [imagen, setImagen] = useState('');
  const [imagen2, setImagen2] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [firma, setFirma] = useState('');
  const [firmaCapturada, setFirmaCapturada] = useState(false);
  const [firmaData, setFirmaData] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasRef, setCanvasRef] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // Estados para BIM
  const [selectedGlobalId, setSelectedGlobalId] = useState(null);
  const [selectedNameBim, setSelectedNameBim] = useState(null);
  const [isBimLoading, setIsBimLoading] = useState(false);
  
  // Estados del Viewer_inspeccion.tsx
  const [modelCount, setModelCount] = useState(0);
  const [lotes, setLotes] = useState([]);
  const [selectedLote, setSelectedLote] = useState(null);
  const [inspeccionesBim, setInspeccionesBim] = useState([]);
  const [ppi, setPpi] = useState(null);
  const [loteInfo, setLoteInfo] = useState(null);
  const [actividadesAptas, setActividadesAptas] = useState(0);
  const [totalSubactividades, setTotalSubactividades] = useState(0);
  const [difActividades, setDifActividades] = useState(0);
  const [cierreInspeccion, setCierreInspeccion] = useState(false);
  
  // Estados del formulario (ya declarados arriba)
  const [comentario, setComentario] = useState('');
  const [signature, setSignature] = useState('');
  const [userName, setUserName] = useState('');
  
  // Estados de modales
  const [modalFormulario, setModalFormulario] = useState(false);
  const [currentSubactividadId, setCurrentSubactividadId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalExito, setModalExito] = useState(false);
  const [mensajeExitoInspeccion, setMensajeExitoInspeccion] = useState('');
  
  // Auth context
  const { user } = useAuth();

  // useEffect para obtener lotes ahora manejado por Viewer_inspeccion

  // useEffect para obtener datos del usuario
  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'usuarios', user.uid);
      getDoc(userDocRef).then(docSnap => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.nombre);
          setSignature(userData.signature);
        }
      });
    }
  }, [user]);

  // useEffect para obtener información del lote ahora manejado por Viewer_inspeccion

  // Datos mock para las inspecciones de auscultación - Estados mixtos
  const datosInspecciones = [
    {
      id: 1,
      actividad: 'ACTIVIDADES PREVIAS',
      subactividad: 'Inicio de tajo',
      criterio: 'El registro de Inicio de tajo para esta actividad se encuentra cumplimentado, firmado y sin incidencias',
      documento: 'PC',
      tipo: 'Documental/Visual',
      punto: 'P',
      responsable: 'Jefe de calidad',
      nombre: 'Juan Pérez',
      fecha: '2024-01-15',
      comentarios: 'Inspección realizada correctamente',
      resultado: 'Apto',
      estado: 'Completado',
      pdf: true,
      editar: true,
      ver: true
    },
    {
      id: 2,
      actividad: 'ACTIVIDADES PREVIAS',
      subactividad: 'Documentación actualizada y planos válidos',
      criterio: 'Se dispone de toda la documentación y planos vigentes para realizar las inspecciones.',
      documento: 'Planos',
      tipo: 'Documental',
      punto: 'C',
      responsable: 'Vigilante',
      nombre: 'María García',
      fecha: '2024-01-14',
      comentarios: 'Documentación en orden',
      resultado: 'Apto',
      estado: 'Completado',
      pdf: true,
      editar: true,
      ver: true
    },
    {
      id: 3,
      actividad: 'SOSTENIMIENTO. HORMIGON PROYECTADO',
      subactividad: 'Limpieza de la superficie',
      criterio: 'La superficie a gunitar estará limpia y humeda, no queda material suelto en las paredes del talud',
      documento: 'PPTP/Planos',
      tipo: 'Visual',
      punto: 'C',
      responsable: 'Vigilante',
      nombre: 'Carlos López',
      fecha: '2024-01-13',
      comentarios: 'Superficie preparada correctamente',
      resultado: 'Apto',
      estado: 'Completado',
      pdf: true,
      editar: true,
      ver: true
    },
    {
      id: 4,
      actividad: 'SOSTENIMIENTO. HORMIGON PROYECTADO',
      subactividad: 'Proyección del hormigón',
      criterio: 'Se gunita perpendicularmente a la superficie y a una distancia de 1 m.',
      documento: 'PPTP/Planos',
      tipo: 'Visual',
      punto: 'C',
      responsable: 'Vigilante',
      nombre: 'Ana Martínez',
      fecha: '2024-01-12',
      comentarios: 'Proyección en proceso',
      resultado: '',
      estado: 'En progreso',
      pdf: false,
      editar: true,
      ver: true
    },
    {
      id: 5,
      actividad: 'SOSTENIMIENTO. HORMIGON PROYECTADO',
      subactividad: 'Espesor',
      criterio: 'Taladros y testificación según el tipo de sostenimiento que figura en los planos',
      documento: 'PPTP/Planos',
      tipo: 'Visual',
      punto: 'C',
      responsable: 'Vigilante',
      nombre: 'Pedro Rodríguez',
      fecha: '2024-01-11',
      comentarios: 'Espesor verificado correctamente',
      resultado: 'Apto',
      estado: 'Completado',
      pdf: true,
      editar: true,
      ver: true
    },
    {
      id: 6,
      actividad: 'SOSTENIMIENTO MALLA TRIPLE TORSIÓN',
      subactividad: 'Comprobación de colocación',
      criterio: 'Colocación: Según se indica en los planos o si DO estima que hay que reforzar.',
      documento: 'PPTP/Planos',
      tipo: 'Visual',
      punto: 'C',
      responsable: 'Vigilante',
      nombre: '',
      fecha: '',
      comentarios: '',
      resultado: '',
      estado: 'Pendiente',
      pdf: false,
      editar: false,
      ver: false
    },
    {
      id: 7,
      actividad: 'SOSTENIMIENTO MALLA TRIPLE TORSIÓN',
      subactividad: 'Sujección',
      criterio: 'En la parte superior se colocarán piquetas cada 2m hincadas en los suelos y en la parte inferior cada 4m, perforadas con martillo de mano.',
      documento: 'PPTP/Planos',
      tipo: 'Visual',
      punto: 'C',
      responsable: 'Vigilante',
      nombre: 'Miguel Torres',
      fecha: '2024-01-09',
      comentarios: 'Sujección en proceso',
      resultado: '',
      estado: 'En progreso',
      pdf: false,
      editar: true,
      ver: true
    },
    {
      id: 8,
      actividad: 'SOSTENIMIENTO MALLA TRIPLE TORSIÓN',
      subactividad: 'Aspecto final',
      criterio: 'Se comprobará que la malla cubre toda la superficie y que está correctamente adherida a la superficie de excavación',
      documento: 'PPTP/Planos',
      tipo: 'Visual',
      punto: 'C',
      responsable: 'Jefe de calidad',
      nombre: '',
      fecha: '',
      comentarios: '',
      resultado: '',
      estado: 'Pendiente',
      pdf: false,
      editar: false,
      ver: false
    },
    {
      id: 9,
      actividad: 'BULONES',
      subactividad: 'Comprobación del replanteo',
      criterio: 'Se colocarán según plano de trazabilidad de bulones',
      documento: 'PPTP/Planos',
      tipo: 'Visual',
      punto: 'C',
      responsable: 'Topógrafo',
      nombre: '',
      fecha: '',
      comentarios: '',
      resultado: '',
      estado: 'Pendiente',
      pdf: false,
      editar: false,
      ver: false
    },
    {
      id: 10,
      actividad: 'BULONES',
      subactividad: 'Dimensiones del taladro',
      criterio: 'Perpendicular al terreno (+/- 15º) y profundidad 8 (+/- 2) cm inferior a la longitud del bulón.',
      documento: 'PPTP/Planos',
      tipo: 'Visual',
      punto: 'C',
      responsable: 'Vigilante',
      nombre: '',
      fecha: '',
      comentarios: '',
      resultado: '',
      estado: 'Pendiente',
      pdf: false,
      editar: false,
      ver: false
    },
    {
      id: 11,
      actividad: 'BULONES',
      subactividad: 'Introducción del bulón',
      criterio: 'Se comprobará que el bulón entra íntegramente en la perforación',
      documento: 'PPTP/Planos',
      tipo: 'Visual',
      punto: 'C',
      responsable: 'Vigilante',
      nombre: 'Francisco Jiménez',
      fecha: '2024-01-05',
      comentarios: 'Introducción en proceso',
      resultado: '',
      estado: 'En progreso',
      pdf: false,
      editar: true,
      ver: true
    },
    {
      id: 12,
      actividad: 'BULONES',
      subactividad: 'Control de la inyección',
      criterio: 'La manguera irá hasta el fondo de perforacion para conseguir una inyeccion ascendente.',
      documento: 'PPTP/Planos',
      tipo: 'Visual',
      punto: 'C',
      responsable: 'Vigilante',
      nombre: '',
      fecha: '',
      comentarios: '',
      resultado: '',
      estado: 'Pendiente',
      pdf: false,
      editar: false,
      ver: false
    },
    {
      id: 13,
      actividad: 'BULONES',
      subactividad: 'Colocación de placas de reparto',
      criterio: 'Placas correctamente colocadas, alineadas y niveladas con el dado de hormigón.',
      documento: 'PPTP/Planos',
      tipo: 'Visual',
      punto: 'C',
      responsable: 'Vigilante',
      nombre: '',
      fecha: '',
      comentarios: '',
      resultado: '',
      estado: 'Pendiente',
      pdf: false,
      editar: false,
      ver: false
    },
    {
      id: 14,
      actividad: 'BULONES',
      subactividad: 'Tesado del bulón',
      criterio: 'Se comprobará que los resultados individuales de los ensayos realizados son aptos',
      documento: 'PPTP/Planos',
      tipo: 'Documental',
      punto: 'C',
      responsable: 'Jefe de calidad',
      nombre: '',
      fecha: '',
      comentarios: '',
      resultado: '',
      estado: 'Pendiente',
      pdf: false,
      editar: false,
      ver: false
    },
    {
      id: 15,
      actividad: 'PRUEBAS FINALES',
      subactividad: 'Ensayos realizados',
      criterio: 'Plan de ensayos',
      documento: 'Plan de ensayos',
      tipo: 'Documental',
      punto: 'P',
      responsable: 'Jefe de Calidad',
      nombre: '',
      fecha: '',
      comentarios: '',
      resultado: '',
      estado: 'Pendiente',
      pdf: false,
      editar: false,
      ver: false
    }
  ];

    useEffect(() => {
    setInspecciones(datosInspecciones);
    setInspeccionesFiltradas(datosInspecciones);
  }, []);

    useEffect(() => {
    let filtradas = inspecciones;

    if (filtros.estado) {
      filtradas = filtradas.filter(inspeccion => 
        inspeccion.estado.toLowerCase().includes(filtros.estado.toLowerCase())
      );
    }

    if (filtros.responsable) {
      filtradas = filtradas.filter(inspeccion => 
        inspeccion.responsable.toLowerCase().includes(filtros.responsable.toLowerCase())
      );
    }

    if (filtros.actividad) {
      filtradas = filtradas.filter(inspeccion => 
        inspeccion.actividad.toLowerCase().includes(filtros.actividad.toLowerCase())
      );
    }

    if (filtros.fecha) {
      filtradas = filtradas.filter(inspeccion => 
        inspeccion.fecha.includes(filtros.fecha)
      );
    }

    setInspeccionesFiltradas(filtradas);
  }, [filtros, inspecciones]);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      estado: '',
      responsable: '',
      actividad: '',
      fecha: ''
        });
    };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'En progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Funciones para edición
  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = (id, updatedData) => {
    setInspecciones(prev => 
      prev.map(inspeccion => 
        inspeccion.id === id ? { ...inspeccion, ...updatedData } : inspeccion
      )
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  // Funciones para nueva inspección
  const handleNewInspeccion = () => {
    setShowNewModal(true);
  };

  const handleSaveNew = () => {
    const newId = Math.max(...inspecciones.map(i => i.id)) + 1;
    const inspeccionCompleta = {
      ...newInspeccion,
      id: newId,
      resultado: resultadoInspeccion,
      observaciones: observaciones,
      firma: firma,
      firmaData: firmaData,
      imagen: imagen,
      imagen2: imagen2
    };
    setInspecciones(prev => [...prev, inspeccionCompleta]);
    
    // Mostrar mensaje de éxito
    setShowSuccessMessage(true);
    
    // Cerrar modal después de 2 segundos
    setTimeout(() => {
      setShowNewModal(false);
      setShowSuccessMessage(false);
      // Limpiar formulario
      setNewInspeccion({
        actividad: '',
        subactividad: '',
        criterio: '',
        documento: '',
        tipo: '',
        punto: '',
        responsable: '',
        nombre: '',
        fecha: '',
        resultado: '',
        pdf: false,
        editar: true,
        estado: 'Pendiente'
      });
      setResultadoInspeccion('');
      setImagen('');
      setImagen2('');
      setObservaciones('');
      setFirma('');
      setFirmaCapturada(false);
      setFirmaData('');
    }, 2000);
  };

  // Función para manejar el cambio de estado de carga del BIM
  const handleBimLoadingChange = (loading) => {
    setIsBimLoading(loading);
  };

  // Funciones del Viewer_inspeccion ahora manejadas internamente

  const handleCancelNew = () => {
    setShowNewModal(false);
    setNewInspeccion({
      actividad: '',
      subactividad: '',
      criterio: '',
      documento: '',
      tipo: '',
      punto: '',
      responsable: '',
      nombre: '',
      fecha: '',
      resultado: '',
      pdf: false,
      editar: true,
      estado: 'Pendiente'
    });
    setResultadoInspeccion('');
    setImagen('');
    setImagen2('');
    setObservaciones('');
    setFirma('');
    setFirmaCapturada(false);
    setFirmaData('');
  };

  // Función para abrir formulario de inspección
  const handleIniciarInspeccion = (inspeccion) => {
    setInspeccionSeleccionadaFormulario(inspeccion);
    setShowFormularioModal(true);
  };

  const handleCloseFormulario = () => {
    setShowFormularioModal(false);
    setInspeccionSeleccionadaFormulario(null);
  };

  // Funciones para firma digital
  const handleFirmaClick = () => {
    if (firma) {
      setFirmaCapturada(true);
      setFirmaData(`Firma digital de ${firma} - ${new Date().toLocaleString()}`);
    }
  };

  const handleLimpiarFirma = () => {
    setFirmaCapturada(false);
    setFirmaData('');
    if (canvasRef) {
      const ctx = canvasRef.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    }
  };

  // Funciones para dibujo real
  const startDrawing = (e) => {
    if (!firma) return;
    setIsDrawing(true);
    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef) return;
    
    const canvas = canvasRef;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setFirmaCapturada(true);
      setFirmaData(`Firma digital de ${firma} - ${new Date().toLocaleString()}`);
    }
  };

  // Configurar canvas cuando se monta
  const setupCanvas = (canvas) => {
    if (canvas) {
      setCanvasRef(canvas);
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#1e40af'; // Azul
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const getResultadoColor = (resultado) => {
    switch (resultado) {
      case 'Apto':
        return 'bg-green-100 text-green-800';
      case 'No apto':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'tabla', name: 'Tabla', icon: FaTable, description: 'Vista de tabla de inspecciones' },
    { id: 'bim', name: 'Visor BIM', icon: FaHardHat, description: 'Visualización de modelos BIM' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header usando componente reutilizable */}
      <HeaderPage 
        title="Campañas de Auscultación"
        showBackButton={true}
        backPath="/"
        backText="Volver"
      />
      
      <div className="px-14 py-6">
        {/* Header con información del PPI */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sky-100 rounded-lg">
                <FaRoad className="w-6 h-6 text-sky-600" />
                            </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Carretera A-67</h1>
                <p className="text-gray-600">Inspecciones de Auscultación</p>
                                    </div>
                                    </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">5</div>
                <div className="text-sm text-gray-600">Inspecciones aptas</div>
                                    </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">15</div>
                <div className="text-sm text-gray-600">Inspecciones totales</div>
                                    </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-gray-600">En progreso</div>
                                    </div>
                                    </div>
                                    </div>
                                    </div>

        {/* Pestañas de navegación */}
        <div className="bg-white rounded-t-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                                                    <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-sky-500 text-sky-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                                                    </button>
              ))}
            </nav>
                                                </div>
                                            </div>

        {/* Contenido de la pestaña Tabla */}
        {activeTab === 'tabla' && (
          <div className="bg-white rounded-b-lg shadow-sm border border-gray-200">
            {/* Filtros siempre activos */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-medium text-gray-700">Filtros</h3>
                <button
                  onClick={limpiarFiltros}
                  className="flex items-center space-x-1 px-2 py-1 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Limpiar filtros"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Carretera</label>
                  <select
                    value={filtros.carretera}
                    onChange={(e) => handleFiltroChange('carretera', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs"
                  >
                    <option value="">Todas las carreteras</option>
                    <option value="A-67">A-67</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    value={filtros.estado}
                    onChange={(e) => handleFiltroChange('estado', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs"
                  >
                    <option value="">Todos los estados</option>
                    <option value="Completado">Completado</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Pendiente">Pendiente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Responsable</label>
                  <select
                    value={filtros.responsable}
                    onChange={(e) => handleFiltroChange('responsable', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs"
                  >
                    <option value="">Todos los responsables</option>
                    <option value="Jefe de calidad">Jefe de calidad</option>
                    <option value="Vigilante">Vigilante</option>
                    <option value="Topógrafo">Topógrafo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Actividad</label>
                  <input
                    type="text"
                    value={filtros.actividad}
                    onChange={(e) => handleFiltroChange('actividad', e.target.value)}
                    placeholder="Buscar actividad..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={filtros.fecha}
                    onChange={(e) => handleFiltroChange('fecha', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Tarjetas de inspecciones modernas */}
            <div className="p-4 space-y-4">
              {inspeccionesFiltradas.map((inspeccion) => (
                <div key={inspeccion.id} className={`bg-white rounded-xl p-5 hover:shadow-lg transition-all duration-300 ${
                  editingId === inspeccion.id 
                    ? 'border-sky-500 shadow-lg shadow-sky-100' 
                    : 'border-gray-200'
                }`}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-sky-600 rounded-xl shadow-lg">
                        <span className="text-white font-bold text-sm">#{inspeccion.id}</span>
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900">{inspeccion.actividad}</div>
                        <div className="text-sm text-gray-600 font-medium">{inspeccion.subactividad}</div>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm ${getEstadoColor(inspeccion.estado)}`}>
                      {inspeccion.estado}
                    </span>
                  </div>

                  {/* Criterio con icono */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border-l-4 border-sky-600">
                    <div className="flex items-start space-x-2">
                      <FaClipboardCheck className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-600 font-semibold mb-1">Criterio de Aceptación</div>
                        {editingId === inspeccion.id ? (
                          <textarea
                            value={inspeccion.criterio}
                            onChange={(e) => handleSave(inspeccion.id, { criterio: e.target.value })}
                            className="w-full text-sm text-gray-800 leading-relaxed border border-gray-300 rounded-lg p-2 resize-none"
                            rows="3"
                          />
                        ) : (
                          <div className="text-sm text-gray-800 leading-relaxed">{inspeccion.criterio}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Información compacta en 2 filas */}
                  <div className="mb-4">
                    {/* Primera fila */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Doc: <span className="font-semibold text-gray-900">{inspeccion.documento}</span></span>
                        <span className="text-gray-600">Tipo: <span className="font-semibold text-gray-900">{inspeccion.tipo}</span></span>
                        <span className="text-gray-600">Punto: <span className="font-semibold text-gray-900">{inspeccion.punto}</span></span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Resp: <span className="font-semibold text-gray-900">{inspeccion.responsable}</span></span>
                        <span className="text-gray-600">Insp: <span className="font-semibold text-gray-900">{inspeccion.nombre || '-'}</span></span>
                      </div>
                    </div>
                    {/* Segunda fila */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Fecha: <span className="font-semibold text-gray-900">{inspeccion.fecha || '-'}</span></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {inspeccion.resultado && (
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-full ${getResultadoColor(inspeccion.resultado)}`}>
                            <FaCheckCircle className="w-3 h-3 mr-1" />
                            {inspeccion.resultado}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-end pt-3 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      {inspeccion.estado === 'Pendiente' && (
                        <button 
                          onClick={() => handleNewInspeccion()}
                          className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <FaPlay className="w-4 h-4" />
                          <span className="text-xs font-semibold">Iniciar inspección</span>
                        </button>
                      )}
                      {editingId === inspeccion.id ? (
                        <>
                          <button 
                            onClick={() => handleCancel()}
                            className="flex items-center space-x-2 px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
                          >
                            <FaTimes className="w-4 h-4" />
                            <span className="text-xs font-semibold">Cancelar</span>
                          </button>
                          <button 
                            onClick={() => handleCancel()}
                            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                          >
                            <FaSave className="w-4 h-4" />
                            <span className="text-xs font-semibold">Guardar</span>
                          </button>
                        </>
                      ) : (
                        inspeccion.editar && (
                          <button 
                            onClick={() => handleEdit(inspeccion.id)}
                            className="flex items-center space-x-2 px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200"
                          >
                            <FaEdit className="w-4 h-4" />
                            <span className="text-xs font-semibold">Editar</span>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contenido de la pestaña Visor BIM */}
        {activeTab === 'bim' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <FaHardHat className="w-6 h-6 text-sky-600" />
                        </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Visor BIM</h3>
                  <p className="text-sm text-gray-600">Visualización de modelos BIM para las inspecciones de auscultación</p>
                    </div>
                </div>
              
              {/* ViewerComponent */}
              <div className="bg-gray-50 rounded-lg p-4 h-[600px]">
                <ViewerComponent 
                  setSelectedGlobalId={setSelectedGlobalId}
                  setSelectedNameBim={setSelectedNameBim}
                  onLoadingChange={handleBimLoadingChange}
                />
              </div>
              
              {/* El Viewer_inspeccion maneja su propia interfaz */}
                    </div>
                </div>
            )}
        </div>

      {/* Modal del Formulario de Inspección */}
      {showFormularioModal && inspeccionSeleccionadaFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Formulario de Inspección - #{inspeccionSeleccionadaFormulario.id}
                </h3>
                <p className="text-sm text-gray-600">{inspeccionSeleccionadaFormulario.actividad}</p>
              </div>
              <button
                onClick={handleCloseFormulario}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del formulario */}
            <div className="p-6">
              <FormularioInspeccion
                username="Rodrigo López"
                setImagen={() => {}}
                setImagen2={() => {}}
                onObservaciones={() => {}}
                formulario={inspeccionSeleccionadaFormulario}
                crearVariableFormularioTrue={true}
                handleConfirmarEnviotablaPpi={() => {
                  // Actualizar el estado de la inspección
                  setInspecciones(prev => 
                    prev.map(inspeccion => 
                      inspeccion.id === inspeccionSeleccionadaFormulario.id 
                        ? { ...inspeccion, estado: 'En progreso' }
                        : inspeccion
                    )
                  );
                  handleCloseFormulario();
                }}
                handleConfirmarEnvioPdf={() => {
                  // Marcar como completado
                  setInspecciones(prev => 
                    prev.map(inspeccion => 
                      inspeccion.id === inspeccionSeleccionadaFormulario.id 
                        ? { ...inspeccion, estado: 'Completado', resultado: 'Apto' }
                        : inspeccion
                    )
                  );
                  handleCloseFormulario();
                }}
                setMensajeExitoInspeccion={() => {}}
                setModalConfirmacionInforme={() => {}}
                setModalFormulario={handleCloseFormulario}
                marcarFormularioComoEnviado={() => {}}
                resultadoInspeccion=""
                comentario=""
                setComentario={() => {}}
                firma=""
                fechaHoraActual={new Date().toISOString()}
                handleCloseModal={handleCloseFormulario}
                ppiNombre="PPI 0302 ELEMENTOS ESTRUCTURALES DE HORMIGÓN"
                nombreResponsable="Rodrigo López"
                setResultadoInspeccion={() => {}}
                enviarDatosARegistros={() => {}}
                setIsAuto={() => {}}
                setIsManual={() => {}}
                setImagenDataCoordinates={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal para nueva inspección */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
            {/* Header del modal con gradiente */}
            <div className="bg-sky-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <FaClipboardCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Nueva Inspección</h3>
                    <p className="text-sky-100 text-sm">Carretera A-67 - Campaña de Auscultación</p>
                  </div>
                </div>
                <button
                  onClick={handleCancelNew}
                  className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all duration-200"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contenido del modal con scroll */}
            <div className="overflow-y-auto max-h-[calc(95vh-200px)] p-6">
              <div className="space-y-8">
                {/* Sección de información básica */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="w-4 h-4 text-gray-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Información Básica</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Inspección</label>
                      <input
                        type="date"
                        value={newInspeccion.fecha}
                        onChange={(e) => setNewInspeccion(prev => ({ ...prev, fecha: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                      <select
                        value={newInspeccion.estado}
                        onChange={(e) => setNewInspeccion(prev => ({ ...prev, estado: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white shadow-sm"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Completado">Completado</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sección de resultado de inspección */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaCheckCircle className="w-4 h-4 text-gray-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Resultado de Inspección</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Resultado</label>
                      <select
                        value={resultadoInspeccion}
                        onChange={(e) => setResultadoInspeccion(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                      >
                        <option value="">Seleccionar resultado</option>
                        <option value="Apto">Apto</option>
                        <option value="No apto">No apto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                      <select
                        value={newInspeccion.estado}
                        onChange={(e) => setNewInspeccion(prev => ({ ...prev, estado: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Completado">Completado</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Visualización del resultado con animación */}
                  {resultadoInspeccion && (
                    <div className="mt-6 p-4 bg-white rounded-xl border-2 border-green-200 shadow-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          {resultadoInspeccion === 'Apto' ? (
                            <FaCheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <FaTimes className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Resultado:</span>
                          <span className={`ml-2 px-4 py-2 rounded-full text-sm font-bold ${
                            resultadoInspeccion === 'Apto' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}>
                            {resultadoInspeccion}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sección de gestión de imágenes */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaImage className="w-4 h-4 text-gray-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Imágenes de Inspección</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen Principal</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImagen(e.target.files[0]?.name || '')}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white shadow-sm"
                        />
                        {imagen && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FaCheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">{imagen}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen Adicional</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImagen2(e.target.files[0]?.name || '')}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200 bg-white shadow-sm"
                        />
                        {imagen2 && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <FaCheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">{imagen2}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección de observaciones */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaFileAlt className="w-4 h-4 text-gray-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Observaciones</h4>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Observaciones de la Inspección</label>
                    <textarea
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 bg-white shadow-sm resize-none"
                      rows="4"
                      placeholder="Describe las observaciones, hallazgos y recomendaciones de la inspección..."
                    />
                  </div>
                </div>

                {/* Sección de firma digital */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaUser className="w-4 h-4 text-gray-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Firma Digital</h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Inspector</label>
                      <input
                        type="text"
                        value={firma}
                        onChange={(e) => setFirma(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm"
                        placeholder="Nombre del inspector que firma"
                      />
                    </div>
                  
                    {/* Área de firma digital */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Firma Digital</label>
                      <div className={`border-2 border-dashed rounded-xl transition-all duration-300 ${
                        firmaCapturada 
                          ? 'border-green-400 bg-green-50 shadow-lg' 
                          : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                      }`}>
                      {firma ? (
                        <div className="relative">
                          <canvas
                            ref={setupCanvas}
                            width={400}
                            height={150}
                            className="w-full h-32 cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={(e) => {
                              e.preventDefault();
                              const touch = e.touches[0];
                              const mouseEvent = new MouseEvent('mousedown', {
                                clientX: touch.clientX,
                                clientY: touch.clientY
                              });
                              startDrawing(mouseEvent);
                            }}
                            onTouchMove={(e) => {
                              e.preventDefault();
                              const touch = e.touches[0];
                              const mouseEvent = new MouseEvent('mousemove', {
                                clientX: touch.clientX,
                                clientY: touch.clientY
                              });
                              draw(mouseEvent);
                            }}
                            onTouchEnd={(e) => {
                              e.preventDefault();
                              stopDrawing();
                            }}
                          />
                          
                          {firmaCapturada && (
                            <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              ✓ Firma Capturada
                            </div>
                          )}
                          
                          <div className="p-3 bg-gray-50 border-t">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-600">
                                {firmaCapturada ? (
                                  <span className="text-green-700 font-medium">{firmaData}</span>
                                ) : (
                                  <span>Dibuja tu firma en el área de arriba</span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={handleLimpiarFirma}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                              >
                                Limpiar
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 text-center">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </div>
                            <div className="text-sm text-gray-500">
                              <p className="font-medium">Primero ingresa tu nombre</p>
                              <p className="text-xs">Luego podrás dibujar tu firma</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal modernizado */}
            <div className="bg-white px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Carretera A-67</span> • Campaña de Auscultación
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleCancelNew}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
                    disabled={showSuccessMessage}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveNew}
                    className="px-6 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={showSuccessMessage}
                  >
                    {showSuccessMessage ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creando...</span>
                      </div>
                    ) : (
                      'Crear Inspección'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal pequeño de éxito */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Éxito!</h3>
            <p className="text-sm text-gray-600 mb-4">
              Inspección creada correctamente
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Cerrando...</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Inspección BIM usando FormularioInspeccion */}
      {false && (
        <div className="fixed inset-0 z-50 overflow-auto flex justify-center items-center p-11">
          <div className="modal-overlay absolute w-full h-full bg-gray-800 opacity-70"></div>
          <div className="mx-auto w-[500px] h-800px] modal-container bg-white mx-auto rounded-lg shadow-lg z-50 overflow-y-auto px-12 py-8">
            <button
              onClick={() => setShowBimInspeccionModal(false)}
              className="text-3xl w-full flex justify-end items-center text-gray-500 hover:text-gray-700 transition-colors duration-300">
              <FaTimes className="w-6 h-6" />
            </button>

            <div className="my-6">
              <label htmlFor="resultadoInspeccion" className="block text-2xl font-bold text-gray-500 mb-4 flex items-center gap-2">
                <span className='text-3xl'></span> Resultado de la inspección:
              </label>
              <div className="block w-full py-2 text-base p-2 border-gray-300 focus:outline-none focus:ring-gray-500 sm:text-sm rounded-md">
                {/* Opción Apto */}
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="resultadoInspeccion"
                      value="Apto"
                      checked={resultadoInspeccion === "Apto"}
                      onChange={(e) => setResultadoInspeccion(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">Apto</span>
                  </label>
                </div>

                {/* Opción No apto */}
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="resultadoInspeccion"
                      value="No apto"
                      checked={resultadoInspeccion === "No apto"}
                      onChange={(e) => setResultadoInspeccion(e.target.value)}
                      className="form-radio"
                    />
                    <span className="ml-2">No apto</span>
                  </label>
                </div>

                <div className="my-4">
                  <label htmlFor="comentario" className="block text-gray-500 text-sm font-bold mb-2">Comentarios de la inspección</label>
                  <textarea 
                    id="comentario" 
                    value={comentario} 
                    onChange={(e) => setComentario(e.target.value)} 
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                
                <div className="mb-4 mt-4">
                  <label htmlFor="imagen" className="block text-gray-500 text-sm font-medium">Seleccionar imagen</label>
                  <input 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setImagen(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }} 
                    type="file" 
                    id="imagen" 
                    accept="image/*" 
                    className="rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  />
                  {imagen && (
                    <img src={imagen} alt="Imagen 1" className="mt-2 w-full h-32 object-cover rounded-lg" />
                  )}
                </div>
                
                <div className="">
                  <label htmlFor="imagen2" className="block text-gray-500 text-sm font-medium">Seleccionar imagen 2</label>
                  <input 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setImagen2(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }} 
                    type="file" 
                    id="imagen2" 
                    accept="image/*" 
                    className="rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                  />
                  {imagen2 && (
                    <img src={imagen2} alt="Imagen 2" className="mt-2 w-full h-32 object-cover rounded-lg" />
                  )}
                </div>
              </div>
            </div>

            <FormularioInspeccion
              setModalFormulario={setShowBimInspeccionModal}
              modalFormulario={showBimInspeccionModal}
              currentSubactividadId="bim-inspeccion"
              ppiSelected={ppi}
              marcarFormularioComoEnviado={async () => {
                const idRegistroFormulario = await enviarDatosARegistros();
                if (idRegistroFormulario) {
                  // Agregar la inspección BIM a la tabla principal
                  const nuevaInspeccionBim = {
                    id: Math.max(...inspecciones.map(i => i.id)) + 1,
                    actividad: 'INSPECCIÓN BIM',
                    subactividad: 'Elemento seleccionado',
                    criterio: 'Inspección visual del elemento BIM',
                    documento: 'PPI BIM',
                    tipo: 'Visual',
                    punto: selectedNameBim || 'Elemento BIM Mockup',
                    responsable: 'Inspector BIM',
                    nombre: 'Inspector BIM',
                    fecha: new Date().toISOString().split('T')[0],
                    resultado: resultadoInspeccion,
                    pdf: false,
                    editar: true,
                    estado: 'Completada',
                    globalId: selectedGlobalId || 'MOCK-GLOBAL-ID',
                    elementoBim: selectedNameBim || 'Elemento BIM Mockup',
                    observaciones: observaciones,
                    comentario: comentario,
                    imagen: imagen,
                    imagen2: imagen2
                  };
                  
                  setInspecciones(prev => [...prev, nuevaInspeccionBim]);
                  setShowBimInspeccionModal(false);
                  setModalExito(true);
                  setMensajeExitoInspeccion('Inspección BIM completada con éxito');
                }
              }}
              actualizarFormularioEnFirestore={async () => {}}
              resultadoInspeccion={resultadoInspeccion}
              comentario={comentario}
              firma={firma}
              signature={signature}
              userName={userName}
              fechaHoraActual={new Date().toLocaleString('es-ES', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
              })}
              handleCloseModal={() => setShowBimInspeccionModal(false)}
              ppiNombre="PPI Auscultación BIM"
              setImagen={setImagen}
              setImagen2={setImagen2}
              setResultadoInspeccion={setResultadoInspeccion}
              enviarDatosARegistros={enviarDatosARegistros}
              onObservaciones={setObservaciones}
            />
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {modalExito && (
        <div className="fixed inset-0 z-50 overflow-auto flex justify-center items-center p-10">
          <div className="modal-overlay absolute w-full h-full bg-gray-800 opacity-90"></div>
          <div className="mx-auto w-[400px] modal-container bg-white mx-auto rounded-lg shadow-lg z-50 overflow-y-auto p-8 text-center flex flex-col gap-5 items-center">
            <button
              onClick={() => setModalExito(false)}
              className="text-3xl w-full flex justify-end items-center text-gray-500 hover:text-gray-700 transition-colors duration-300">
              <FaTimes className="w-6 h-6" />
            </button>
            <p className='text-teal-500 font-bold text-5xl'><FaCheckCircle className="w-12 h-12" /></p>
            <p className='text-xl font-bold'>{mensajeExitoInspeccion}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaPpi;
