import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ReferenceLine,
  Legend
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import HeaderPage from '../Components/HeaderPage';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  MapPin, 
  BarChart3,
  Calendar,
  Shield,
  Wrench,
  Car,
  Activity,
  Zap,
  Target,
  Gauge,
  Table
} from 'lucide-react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import cantabriaData from '../../public/dashboard_cantabria/cantabria.json';

const DashboardFirmes = () => {
  const [firmes, setFirmes] = useState([]);
  const [filtros, setFiltros] = useState({
    calzada: '',
    rangoIndice: '',
    rangoFisuracion: '',
    fechaDesde: '',
    fechaHasta: ''
  });
  const [activeTab, setActiveTab] = useState('graficos'); // 'graficos' o 'tabla'
  const [lineasVisibles, setLineasVisibles] = useState({
    indGlobal: true,
    indSeguridad: true,
    indConfort: true,
    indEstructural: true
  });

  // Cargar y transformar datos del JSON de Cantabria
  useEffect(() => {
    const datosTransformados = cantabriaData.map((item, index) => ({
      id: index + 1,
      provincia: item.Provincia,
      carretera: item.Carretera,
      calzada: item.Calzada,
      pkIni: `${item['PK.Ini']}+${item.PkIniDist}`,
      pkFin: `${item['PK.Fin']}+${item.PkFinDist}`,
      crt: parseFloat(item.CRT) || 0,
      fisuracion: parseFloat(item.Fisuracion) || 0,
      iri: parseFloat(item.IRI) || 0,
      mpd: parseFloat(item.MPD) || 0,
      rodera: parseFloat(item.Rodera) || 0,
      deflexion: parseFloat(item.Deflexion) || 0,
      imdTotal: parseInt(item['IMD Total']) || 0,
      imdp: parseInt(item.IMDp) || 0,
      // Características individuales
      regLong: parseFloat(item['[I] Reg.Long.']) || 0,
      regTransv: parseFloat(item['[I] Reg. Transv']) || 0,
      resistDesliz: parseFloat(item['[I] Resist.Desliz.']) || 0,
      macroTextura: parseFloat(item['[I] MacroTextura']) || 0,
      capacPortante: parseFloat(item['[I] Capac.Portante']) || 0,
      // Índices agregados
      indSeguridad: parseFloat(item['Ind.Seguridad']) || 0,
      indConfort: parseFloat(item['Ind.Confort']) || 0,
      indEstructural: parseFloat(item['Ind.Estructural']) || 0,
      indGlobal: parseFloat(item['Ind.Global']) || 0,
      // Fechas
      fechaCRT: item['Fecha CRT'],
      fechaFisuracion: item['Fecha Fisurac'],
      fechaRegSuperficial: item['Fecha Reg.Superf.'],
      fechaDeflexion: item['Fecha Deflex.']
    }));
    setFirmes(datosTransformados);
  }, []);

  // Filtrar datos según los filtros aplicados
  const firmesFiltrados = firmes.filter(firme => {
    // Filtro por calzada
    const cumpleCalzada = !filtros.calzada || firme.calzada === filtros.calzada;
    
    // Filtro por rango de índice global
    let cumpleRangoIndice = true;
    if (filtros.rangoIndice) {
      switch(filtros.rangoIndice) {
        case 'excelente':
          cumpleRangoIndice = firme.indGlobal >= 8;
          break;
        case 'bueno':
          cumpleRangoIndice = firme.indGlobal >= 6 && firme.indGlobal < 8;
          break;
        case 'regular':
          cumpleRangoIndice = firme.indGlobal >= 4 && firme.indGlobal < 6;
          break;
        case 'malo':
          cumpleRangoIndice = firme.indGlobal < 4;
          break;
      }
    }
    
    // Filtro por rango de fisuración
    let cumpleRangoFisuracion = true;
    if (filtros.rangoFisuracion) {
      switch(filtros.rangoFisuracion) {
        case 'baja':
          cumpleRangoFisuracion = firme.fisuracion < 2;
          break;
        case 'media':
          cumpleRangoFisuracion = firme.fisuracion >= 2 && firme.fisuracion < 5;
          break;
        case 'alta':
          cumpleRangoFisuracion = firme.fisuracion >= 5;
          break;
      }
    }
    
    // Filtro por fecha
    let cumpleFecha = true;
    if (filtros.fechaDesde || filtros.fechaHasta) {
      const fechaCRT = firme.fechaCRT ? new Date(firme.fechaCRT) : null;
      if (fechaCRT) {
        if (filtros.fechaDesde) {
          const fechaDesde = new Date(filtros.fechaDesde);
          cumpleFecha = cumpleFecha && fechaCRT >= fechaDesde;
        }
        if (filtros.fechaHasta) {
          const fechaHasta = new Date(filtros.fechaHasta);
          cumpleFecha = cumpleFecha && fechaCRT <= fechaHasta;
        }
      } else {
        cumpleFecha = false; // Si no hay fecha CRT, excluir del filtro
      }
    }
    
    return cumpleCalzada && cumpleRangoIndice && cumpleRangoFisuracion && cumpleFecha;
  });

  // Procesar datos para gráfica de evolución temporal
  const datosEvolucionTemporal = useMemo(() => {
    // Agrupar por fecha de medición CRT
    const datosPorFecha = {};
    
    firmesFiltrados.forEach(firme => {
      if (firme.fechaCRT) {
        const fecha = new Date(firme.fechaCRT);
        const fechaKey = fecha.toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (!datosPorFecha[fechaKey]) {
          datosPorFecha[fechaKey] = {
            fecha: fechaKey,
            indices: [],
            count: 0
          };
        }
        
        datosPorFecha[fechaKey].indices.push({
          indGlobal: firme.indGlobal,
          indSeguridad: firme.indSeguridad,
          indConfort: firme.indConfort,
          indEstructural: firme.indEstructural
        });
        datosPorFecha[fechaKey].count++;
      }
    });
    
    // Solo incluir fechas que tienen datos para que las líneas se conecten
    return Object.keys(datosPorFecha)
      .sort()
      .map(fechaKey => {
        const grupo = datosPorFecha[fechaKey];
        return {
          fecha: fechaKey,
          indGlobal: grupo.indices.reduce((sum, ind) => sum + ind.indGlobal, 0) / grupo.count,
          indSeguridad: grupo.indices.reduce((sum, ind) => sum + ind.indSeguridad, 0) / grupo.count,
          indConfort: grupo.indices.reduce((sum, ind) => sum + ind.indConfort, 0) / grupo.count,
          indEstructural: grupo.indices.reduce((sum, ind) => sum + ind.indEstructural, 0) / grupo.count,
          count: grupo.count
        };
      });
  }, [firmesFiltrados]);

  // Calcular KPIs principales
  const calcularKPIs = () => {
    const totalFirmes = firmesFiltrados.length;
    
    if (totalFirmes === 0) {
      return {
        totalFirmes: 0,
        redBuenEstado: 0,
        redCritica: 0,
        redNecesitaAtencion: 0,
        promedioGlobal: '0.0',
        promedioSeguridad: '0.0',
        promedioEstructural: '0.0',
        promedioConfort: '0.0',
        promedioIRI: '0.0'
      };
    }
    
    const redBuenEstado = firmesFiltrados.filter(f => f.indGlobal >= 6).length;
    const redCritica = firmesFiltrados.filter(f => f.indGlobal < 4).length;
    const redNecesitaAtencion = firmesFiltrados.filter(f => f.indGlobal >= 4 && f.indGlobal < 6).length;
    
    const promedioGlobal = firmesFiltrados.reduce((sum, f) => sum + f.indGlobal, 0) / totalFirmes;
    const promedioSeguridad = firmesFiltrados.reduce((sum, f) => sum + f.indSeguridad, 0) / totalFirmes;
    const promedioEstructural = firmesFiltrados.reduce((sum, f) => sum + f.indEstructural, 0) / totalFirmes;
    const promedioConfort = firmesFiltrados.reduce((sum, f) => sum + f.indConfort, 0) / totalFirmes;
    const promedioIRI = firmesFiltrados.reduce((sum, f) => sum + f.iri, 0) / totalFirmes;

    return {
      totalFirmes,
      redBuenEstado: Math.round((redBuenEstado / totalFirmes) * 100),
      redCritica: Math.round((redCritica / totalFirmes) * 100),
      redNecesitaAtencion: Math.round((redNecesitaAtencion / totalFirmes) * 100),
      promedioGlobal: promedioGlobal.toFixed(1),
      promedioSeguridad: promedioSeguridad.toFixed(1),
      promedioEstructural: promedioEstructural.toFixed(1),
      promedioConfort: promedioConfort.toFixed(1),
      promedioIRI: promedioIRI.toFixed(1)
    };
  };

  const kpis = calcularKPIs();

  // Datos para gráfico de características individuales (promedio general)
  const calcularPromedioCaracteristicas = () => {
    if (firmesFiltrados.length === 0) return [];
    
    const totales = firmesFiltrados.reduce((acc, firme) => {
      acc.regLong += firme.regLong || 0;
      acc.regTransv += firme.regTransv || 0;
      acc.resistDesliz += firme.resistDesliz || 0;
      acc.macroTextura += firme.macroTextura || 0;
      acc.capacPortante += firme.capacPortante || 0;
      acc.fisuracion += firme.fisuracion || 0;
      return acc;
    }, {
      regLong: 0,
      regTransv: 0,
      resistDesliz: 0,
      macroTextura: 0,
      capacPortante: 0,
      fisuracion: 0
    });

    const count = firmesFiltrados.length;
    
    return [
      { 
        caracteristica: 'Reg. Long.', 
        valor: parseFloat((totales.regLong / count).toFixed(2)),
        umbral: 3.5,
        color: '#93C5FD' // Azul pastel
      },
      { 
        caracteristica: 'Reg. Transv', 
        valor: parseFloat((totales.regTransv / count).toFixed(2)),
        umbral: 3.0,
        color: '#86EFAC' // Verde pastel
      },
      { 
        caracteristica: 'Resist. Desliz.', 
        valor: parseFloat((totales.resistDesliz / count).toFixed(2)),
        umbral: 3.5,
        color: '#FDE68A' // Amarillo pastel
      },
      { 
        caracteristica: 'MacroTextura', 
        valor: parseFloat((totales.macroTextura / count).toFixed(2)),
        umbral: 2.5,
        color: '#FCA5A5' // Rojo pastel
      },
      { 
        caracteristica: 'Capac. Portante', 
        valor: parseFloat((totales.capacPortante / count).toFixed(2)),
        umbral: 3.0,
        color: '#C4B5FD' // Púrpura pastel
      },
      { 
        caracteristica: 'Fisuracion', 
        valor: parseFloat((totales.fisuracion / count).toFixed(2)),
        umbral: 2.5,
        color: '#7DD3FC' // Cian pastel
      }
    ];
  };

  const graficoCaracteristicas = calcularPromedioCaracteristicas();

  // Función para mostrar solo una línea
  const mostrarSoloLinea = (linea) => {
    setLineasVisibles({
      indGlobal: false,
      indSeguridad: false,
      indConfort: false,
      indEstructural: false,
      [linea]: true
    });
  };

  // Datos para gráfico de evolución por PK
  const datosEvolucionPK = firmesFiltrados
    .sort((a, b) => {
      // Ordenar por carretera y luego por PK
      if (a.carretera !== b.carretera) {
        return a.carretera.localeCompare(b.carretera);
      }
      // Extraer número del PK para ordenar correctamente
      const pkA = parseFloat(a.pkIni.replace('+', '.'));
      const pkB = parseFloat(b.pkIni.replace('+', '.'));
      return pkA - pkB;
    })
    .map(firme => ({
      pk: firme.pkIni,
      carretera: firme.carretera,
      indSeguridad: firme.indSeguridad,
      indConfort: firme.indConfort,
      indEstructural: firme.indEstructural,
      indGlobal: firme.indGlobal
    }));

  // Datos para gráfico de estado
  const datosEstado = [
    { name: 'Excelente (8-10)', value: firmesFiltrados.filter(f => f.indGlobal >= 8).length, color: '#059669' },
    { name: 'Bueno (6-8)', value: firmesFiltrados.filter(f => f.indGlobal >= 6 && f.indGlobal < 8).length, color: '#0284C7' },
    { name: 'Regular (4-6)', value: firmesFiltrados.filter(f => f.indGlobal >= 4 && f.indGlobal < 6).length, color: '#D97706' },
    { name: 'Malo (0-4)', value: firmesFiltrados.filter(f => f.indGlobal < 4).length, color: '#DC2626' }
  ];

  // Datos para correlación tráfico-deterioro
  const datosCorrelacion = firmesFiltrados.map(firme => ({
    imd: firme.imdTotal,
    indGlobal: firme.indGlobal,
    provincia: firme.provincia
  }));

  // Coordenadas aproximadas para el mapa (simuladas)
  const coordenadasProvincias = {
    'CANTABRIA': [43.1828, -3.9878]
  };

  const firmesConCoordenadas = firmesFiltrados.map(firme => ({
    ...firme,
    coordenadas: coordenadasProvincias[firme.provincia] || [43.1828, -3.9878]
  }));

  const getColorByState = (indGlobal) => {
    if (indGlobal >= 8) return '#10B981';
    if (indGlobal >= 6) return '#3B82F6';
    if (indGlobal >= 4) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="min-h-screen ">
      {/* Header moderno */}
     {/* Header usando componente reutilizable */}
     <HeaderPage

        title="Dashboard de Firmes"
        showBackButton={true}
        backPath="/"
        backText="Volver"
      />

      <div className="px-14 py-6">
        {/* Filtros */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-gray-100 rounded-md">
              <svg className="h-3.5 w-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-600">Filtros</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Filtro por Calzada */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Calzada</label>
              <select 
                value={filtros.calzada}
                onChange={(e) => setFiltros({...filtros, calzada: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
              >
                <option value="">Todas las calzadas</option>
                {[...new Set(firmes.map(f => f.calzada))].sort().map(calzada => (
                  <option key={calzada} value={calzada}>Calzada {calzada}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Rango de Índice */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Estado del firme</label>
              <select 
                value={filtros.rangoIndice}
                onChange={(e) => setFiltros({...filtros, rangoIndice: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="excelente">Excelente (8-10)</option>
                <option value="bueno">Bueno (6-8)</option>
                <option value="regular">Regular (4-6)</option>
                <option value="malo">Malo (0-4)</option>
              </select>
            </div>

            {/* Filtro por Fisuración */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Fisuración</label>
              <select 
                value={filtros.rangoFisuracion}
                onChange={(e) => setFiltros({...filtros, rangoFisuracion: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
              >
                <option value="">Todos los niveles</option>
                <option value="baja">Baja (&lt; 2%)</option>
                <option value="media">Media (2-5%)</option>
                <option value="alta">Alta (≥ 5%)</option>
              </select>
            </div>

            {/* Filtro por Fecha Desde */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Fecha desde</label>
              <input 
                type="date"
                value={filtros.fechaDesde}
                onChange={(e) => setFiltros({...filtros, fechaDesde: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
              />
            </div>

            {/* Filtro por Fecha Hasta */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Fecha hasta</label>
              <input 
                type="date"
                value={filtros.fechaHasta}
                onChange={(e) => setFiltros({...filtros, fechaHasta: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
              />
            </div>
          </div>
          
          {/* Botón para limpiar filtros */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFiltros({
                calzada: '',
                rangoIndice: '',
                rangoFisuracion: '',
                fechaDesde: '',
                fechaHasta: ''
              })}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* KPIs con valores reales */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-sky-600 to-sky-700 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-800">Indicadores de evaluación</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Estado de la Red - Bueno */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="text-sm font-medium text-gray-600">Bueno</h3>
                </div>
                <p className="text-xs text-gray-500 mb-2">Índice ≥ 4</p>
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  {firmesFiltrados.length > 0 ? Math.round((firmesFiltrados.filter(f => f.indGlobal >= 4).length / firmesFiltrados.length) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-500">de los tramos</div>
              </div>
            </div>

            {/* Estado de la Red - Atención */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <h3 className="text-sm font-medium text-gray-600">Atención</h3>
                </div>
                <p className="text-xs text-gray-500 mb-2">Índice 2-4</p>
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  {firmesFiltrados.length > 0 ? Math.round((firmesFiltrados.filter(f => f.indGlobal >= 2 && f.indGlobal < 4).length / firmesFiltrados.length) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-500">de los tramos</div>
              </div>
            </div>

            {/* Estado de la Red - Crítico */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <h3 className="text-sm font-medium text-gray-600">Crítico</h3>
                </div>
                <p className="text-xs text-gray-500 mb-2">Índice &lt; 2</p>
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  {firmesFiltrados.length > 0 ? Math.round((firmesFiltrados.filter(f => f.indGlobal < 2).length / firmesFiltrados.length) * 100) : 0}%
                </div>
                <div className="text-xs text-gray-500">de los tramos</div>
              </div>
            </div>

            {/* Fisuración Promedio */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Fisuración</h3>
                <p className="text-xs text-gray-500 mb-2">Promedio crítico</p>
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  {firmesFiltrados.length > 0 ? (firmesFiltrados.reduce((sum, f) => sum + f.fisuracion, 0) / firmesFiltrados.length).toFixed(1) : '0.0'}%
                </div>
                <div className="text-xs text-gray-500">de superficie</div>
              </div>
            </div>

            {/* Total de Tramos */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-1">Total tramos</h3>
                <p className="text-xs text-gray-500 mb-2">Analizados</p>
                <div className="text-2xl font-bold text-gray-600 mb-1">
                  {firmesFiltrados.length}
                </div>
                <div className="text-xs text-gray-500">tramos evaluados</div>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs de Índices Promedio */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-yellow-500 to-amber-500 rounded-full"></div>
            <h2 className="text-lg font-semibold text-slate-800">Índices promedio</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Reg.Long. */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <div className="text-xs font-medium text-gray-600">Reg.Long.</div>
                </div>
                <div className="text-lg font-bold text-gray-600">
                  {firmesFiltrados.length > 0 ? (firmesFiltrados.reduce((sum, f) => sum + f.regLong, 0) / firmesFiltrados.length).toFixed(1) : '0.0'}
                </div>
              </div>
            </div>

            {/* Reg.Transv */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <div className="text-xs font-medium text-gray-600">Reg.Transv</div>
                </div>
                <div className="text-lg font-bold text-gray-600">
                  {firmesFiltrados.length > 0 ? (firmesFiltrados.reduce((sum, f) => sum + f.regTransv, 0) / firmesFiltrados.length).toFixed(1) : '0.0'}
                </div>
              </div>
            </div>

            {/* Resist.Desliz. */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <div className="text-xs font-medium text-gray-600">Resist.Desliz.</div>
                </div>
                <div className="text-lg font-bold text-gray-600">
                  {firmesFiltrados.length > 0 ? (firmesFiltrados.reduce((sum, f) => sum + f.resistDesliz, 0) / firmesFiltrados.length).toFixed(1) : '0.0'}
                </div>
              </div>
            </div>

            {/* MacroTextura */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <div className="text-xs font-medium text-gray-600">MacroTextura</div>
                </div>
                <div className="text-lg font-bold text-gray-600">
                  {firmesFiltrados.length > 0 ? (firmesFiltrados.reduce((sum, f) => sum + f.macroTextura, 0) / firmesFiltrados.length).toFixed(1) : '0.0'}
                </div>
              </div>
            </div>

            {/* Capac.Portante */}
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  <div className="text-xs font-medium text-gray-600">Capac.Portante</div>
                </div>
                <div className="text-lg font-bold text-gray-600">
                  {firmesFiltrados.length > 0 ? (firmesFiltrados.reduce((sum, f) => sum + f.capacPortante, 0) / firmesFiltrados.length).toFixed(1) : '0.0'}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Sección Principal: Solo Pestañas */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          
          {/* Mapa oculto por ahora */}
          {/* <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-gray-100 rounded-md">
                <MapPin className="h-3.5 w-3.5 text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-600">Estado por ubicación</h3>
            </div>
            <div className="h-[600px] rounded-xl overflow-hidden shadow-lg">
              <MapContainer
                center={[43.1828, -3.9878]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {firmesConCoordenadas.map((firme, index) => (
                  <CircleMarker
                    key={index}
                    center={firme.coordenadas}
                    radius={8}
                    color={getColorByState(firme.indGlobal)}
                    fillOpacity={0.7}
                  >
                    <Popup>
                      <div className="p-3">
                        <h4 className="font-semibold text-gray-900 mb-2">{firme.carretera} - {firme.calzada}</h4>
                        <div className="space-y-1 text-sm">
                          <p><strong>Provincia:</strong> {firme.provincia}</p>
                          <p><strong>PK:</strong> {firme.pkIni} - {firme.pkFin}</p>
                          <p><strong>Índice Global:</strong> {firme.indGlobal}</p>
                          <p><strong>Seguridad:</strong> {firme.indSeguridad}</p>
                          <p><strong>Estructural:</strong> {firme.indEstructural}</p>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div> */}

          {/* Sistema de Pestañas - Ancho completo */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            {/* Pestañas */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('graficos')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                  activeTab === 'graficos'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className={`h-4 w-4 ${activeTab === 'graficos' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>Gráficos</span>
              </button>
              <button
                onClick={() => setActiveTab('tabla')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-200 ${
                  activeTab === 'tabla'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Table className={`h-4 w-4 ${activeTab === 'tabla' ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>Tabla</span>
              </button>
            </div>

            {/* Contenido de las Pestañas */}
            <div className="p-6">
              
              {/* Pestaña de Gráficos */}
              {activeTab === 'graficos' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Gráfico de Barras - Características Individuales con Umbrales */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Análisis de características</h3>
                        <p className="text-sm text-slate-600">Evaluación con umbrales de calidad</p>
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={graficoCaracteristicas} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="2 4" stroke="#cbd5e1" strokeOpacity={0.6} />
                        <XAxis 
                          dataKey="caracteristica" 
                          tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }}
                          angle={-45}
                          textAnchor="end"
                          height={90}
                          label={{ 
                            value: 'Características del firme', 
                            position: 'insideBottom', 
                            offset: -10, 
                            style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '13px', fontWeight: '600' } 
                          }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }}
                          domain={[0, 5]}
                          label={{ 
                            value: 'Valor de característica', 
                            angle: -90, 
                            position: 'insideLeft', 
                            style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '13px', fontWeight: '600' } 
                          }}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              const umbral = data.umbral;
                              const estado = data.valor >= umbral ? '✅ Bueno' : '⚠️ Crítico';
                              const colorEstado = data.valor >= umbral ? 'text-emerald-300' : 'text-rose-300';
                              return (
                                <div className="bg-black/80 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-700">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }}></div>
                                    <p className="font-semibold text-white text-sm">{data.caracteristica}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-gray-300">Valor:</span>
                                      <span className="font-semibold text-white text-sm">{data.valor}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <span className="text-xs text-gray-300">Umbral:</span>
                                      <span className="font-medium text-gray-200 text-sm">{umbral}</span>
                                    </div>
                                    <div className="pt-1 border-t border-gray-600">
                                      <p className={`text-xs font-medium ${colorEstado} text-center`}>
                                        {estado}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        {/* Líneas de umbral con colores pastel */}
                        <ReferenceLine 
                          y={2.5} 
                          stroke="#fecaca" 
                          strokeDasharray="8 4" 
                          strokeWidth={3} 
                          label={{ 
                            value: "Crítico", 
                            position: "right",
                            style: { fill: '#9ca3af', fontSize: '9px', fontWeight: '500' }
                          }} 
                        />
                        <ReferenceLine 
                          y={3.5} 
                          stroke="#fed7aa" 
                          strokeDasharray="8 4" 
                          strokeWidth={3} 
                          label={{ 
                            value: "Atención", 
                            position: "right",
                            style: { fill: '#9ca3af', fontSize: '9px', fontWeight: '500' }
                          }} 
                        />
                        <ReferenceLine 
                          y={4.0} 
                          stroke="#bbf7d0" 
                          strokeDasharray="8 4" 
                          strokeWidth={3} 
                          label={{ 
                            value: "Bueno", 
                            position: "right",
                            style: { fill: '#9ca3af', fontSize: '9px', fontWeight: '500' }
                          }} 
                        />
                        
                        <Bar 
                          dataKey="valor" 
                          radius={[6, 6, 0, 0]}
                          strokeWidth={1}
                          stroke="#ffffff"
                        >
                          {graficoCaracteristicas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    
                    {/* Leyenda de umbrales simplificada */}
                    <div className="mt-6 p-4">
                      <h4 className="text-sm font-semibold text-gray-500 mb-3">
                        Umbrales de evaluación
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                          <span className="text-gray-500"><strong>≥4.0:</strong> Bueno</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                          <span className="text-gray-500"><strong>3.5-3.9:</strong> Atención</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                          <span className="text-gray-500"><strong>&lt;3.5:</strong> Crítico</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico de Líneas - Evolución de Índices por PK */}
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                        <Activity className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Evolución de índices por PK</h3>
                        <p className="text-sm text-slate-600">Análisis de degradación a lo largo de la carretera</p>
                      </div>
                    </div>
                    
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={datosEvolucionPK} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="pk" 
                          tick={{ fontSize: 12, fill: '#9ca3af' }}
                          label={{ 
                            value: 'PK', 
                            position: 'insideBottom', 
                            offset: -5, 
                            style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '13px' } 
                          }}
                        />
                        <YAxis 
                          tick={{ fontSize: 12, fill: '#9ca3af' }}
                          domain={[0, 15]}
                          label={{ 
                            value: 'Índice', 
                            angle: -90, 
                            position: 'insideLeft', 
                            style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '13px' } 
                          }}
                        />
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-black/80 backdrop-blur-md p-3 rounded-lg shadow-xl border border-gray-700">
                                  <p className="font-semibold text-white text-sm mb-2">PK {data.pk}</p>
                                  <div className="space-y-1">
                                    <p className="text-xs text-gray-300">Global: <span className="text-white font-medium">{data.indGlobal}</span></p>
                                    <p className="text-xs text-gray-300">Seguridad: <span className="text-white font-medium">{data.indSeguridad}</span></p>
                                    <p className="text-xs text-gray-300">Estructural: <span className="text-white font-medium">{data.indEstructural}</span></p>
                                    <p className="text-xs text-gray-300">Confort: <span className="text-white font-medium">{data.indConfort}</span></p>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        {lineasVisibles.indGlobal && (
                          <Line 
                            type="monotone" 
                            dataKey="indGlobal" 
                            stroke="#EF4444" 
                            strokeWidth={3}
                            dot={false}
                          />
                        )}
                        {lineasVisibles.indSeguridad && (
                          <Line 
                            type="monotone" 
                            dataKey="indSeguridad" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            dot={false}
                          />
                        )}
                        {lineasVisibles.indConfort && (
                          <Line 
                            type="monotone" 
                            dataKey="indConfort" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            dot={false}
                          />
                        )}
                        {lineasVisibles.indEstructural && (
                          <Line 
                            type="monotone" 
                            dataKey="indEstructural" 
                            stroke="#F59E0B" 
                            strokeWidth={2}
                            dot={false}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                    
                    {/* Leyenda clickeable */}
                    <div className="mt-4 p-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Click en un índice para verlo solo:</span>
                        <button 
                          onClick={() => setLineasVisibles({
                            indGlobal: true,
                            indSeguridad: true,
                            indConfort: true,
                            indEstructural: true
                          })}
                          className="text-sm text-gray-600 hover:text-gray-800"
                        >
                          Mostrar todos
                        </button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                          onClick={() => mostrarSoloLinea('indGlobal')}
                        >
                          <div className={`w-3 h-3 rounded-full ${lineasVisibles.indGlobal ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                          <span className={`${lineasVisibles.indGlobal ? 'text-gray-700' : 'text-gray-400'}`}>Global</span>
                        </div>
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                          onClick={() => mostrarSoloLinea('indSeguridad')}
                        >
                          <div className={`w-3 h-3 rounded-full ${lineasVisibles.indSeguridad ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                          <span className={`${lineasVisibles.indSeguridad ? 'text-gray-700' : 'text-gray-400'}`}>Seguridad</span>
                        </div>
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                          onClick={() => mostrarSoloLinea('indConfort')}
                        >
                          <div className={`w-3 h-3 rounded-full ${lineasVisibles.indConfort ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <span className={`${lineasVisibles.indConfort ? 'text-gray-700' : 'text-gray-400'}`}>Confort</span>
                        </div>
                        <div 
                          className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
                          onClick={() => mostrarSoloLinea('indEstructural')}
                        >
                          <div className={`w-3 h-3 rounded-full ${lineasVisibles.indEstructural ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                          <span className={`${lineasVisibles.indEstructural ? 'text-gray-700' : 'text-gray-400'}`}>Estructural</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico de Evolución Temporal - Ancho completo */}
                  <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-sky-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">Evolución temporal de índices</h3>
                        <p className="text-sm text-slate-600">Tendencia de calidad por fecha de medición CRT</p>
                      </div>
                    </div>
                    
                    {datosEvolucionTemporal.length > 0 ? (
                      <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={datosEvolucionTemporal} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="2 4" stroke="#cbd5e1" strokeOpacity={0.6} />
                          <XAxis 
                            dataKey="fecha" 
                            tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }}
                            tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })}
                            label={{ 
                              value: 'Fecha de medición', 
                              position: 'insideBottom', 
                              offset: -10, 
                              style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '13px', fontWeight: '600' } 
                            }}
                          />
                          <YAxis 
                            tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 500 }}
                            domain={[0, 5]}
                            label={{ 
                              value: 'Valor del índice', 
                              angle: -90, 
                              position: 'insideLeft', 
                              style: { textAnchor: 'middle', fill: '#9ca3af', fontSize: '13px', fontWeight: '600' } 
                            }}
                          />
                          <Tooltip 
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                const fecha = new Date(label).toLocaleDateString('es-ES');
                                return (
                                  <div className="bg-black/80 text-white p-3 rounded-lg shadow-lg border border-white/20">
                                    <p className="font-semibold mb-2">{fecha}</p>
                                    {payload.map((entry, index) => (
                                      <p key={index} className="text-sm" style={{ color: entry.color }}>
                                        {entry.dataKey === 'indGlobal' && 'Global'}
                                        {entry.dataKey === 'indSeguridad' && 'Seguridad'}
                                        {entry.dataKey === 'indConfort' && 'Confort'}
                                        {entry.dataKey === 'indEstructural' && 'Estructural'}
                                        : {entry.value?.toFixed(2)}
                                      </p>
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          {lineasVisibles.indGlobal && (
                            <Line 
                              type="monotone" 
                              dataKey="indGlobal" 
                              stroke="#EF4444" 
                              strokeWidth={3}
                              dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                              name="Global"
                            />
                          )}
                          {lineasVisibles.indSeguridad && (
                            <Line 
                              type="monotone" 
                              dataKey="indSeguridad" 
                              stroke="#3B82F6" 
                              strokeWidth={2}
                              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                              name="Seguridad"
                            />
                          )}
                          {lineasVisibles.indConfort && (
                            <Line 
                              type="monotone" 
                              dataKey="indConfort" 
                              stroke="#10B981" 
                              strokeWidth={2}
                              dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                              name="Confort"
                            />
                          )}
                          {lineasVisibles.indEstructural && (
                            <Line 
                              type="monotone" 
                              dataKey="indEstructural" 
                              stroke="#F59E0B" 
                              strokeWidth={2}
                              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                              name="Estructural"
                            />
                          )}
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-64 text-gray-500">
                        <div className="text-center">
                          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>No hay datos de evolución temporal disponibles</p>
                          <p className="text-sm">Los datos se agrupan por fecha de medición</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Leyenda personalizada clickeable */}
                    <div className="mt-4 flex flex-wrap justify-center gap-4">
                      <button
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        onClick={() => mostrarSoloLinea('indGlobal')}
                      >
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        Global
                      </button>
                      <button
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        onClick={() => mostrarSoloLinea('indSeguridad')}
                      >
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        Seguridad
                      </button>
                      <button
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        onClick={() => mostrarSoloLinea('indConfort')}
                      >
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Confort
                      </button>
                      <button
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        onClick={() => mostrarSoloLinea('indEstructural')}
                      >
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        Estructural
                      </button>
                      <button
                        className="text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                        onClick={() => setLineasVisibles({
                          indGlobal: true,
                          indSeguridad: true,
                          indConfort: true,
                          indEstructural: true
                        })}
                      >
                        Mostrar todos
                      </button>
                    </div>
                  </div>
                  
                </div>
              )}

              {/* Pestaña de Tabla */}
              {activeTab === 'tabla' && (
                <div className="h-[600px] overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Carretera
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Provincia
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    PK
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Índice global
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Seguridad
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estructural
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Confort
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    IRI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {firmesFiltrados.map((firme, index) => (
                  <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {firme.carretera} - {firme.calzada}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {firme.provincia}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {firme.pkIni} - {firme.pkFin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          firme.indGlobal >= 8 ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
                          firme.indGlobal >= 6 ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200' :
                          firme.indGlobal >= 4 ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200' :
                          'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {firme.indGlobal}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {firme.indSeguridad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {firme.indEstructural}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {firme.indConfort}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {firme.iri}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                </div>
              )}
              
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DashboardFirmes;
