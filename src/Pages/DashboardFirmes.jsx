import React, { useState, useEffect } from 'react';
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
  Scatter
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
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
import firmesData from '../data/firmes_sinteticos.json';

const DashboardFirmes = () => {
  const [firmes, setFirmes] = useState(firmesData);
  const [filtros, setFiltros] = useState({
    provincia: '',
    carretera: '',
    sector: ''
  });
  const [activeTab, setActiveTab] = useState('graficos'); // 'graficos' o 'tabla'

  // Filtrar datos según los filtros aplicados
  const firmesFiltrados = firmes.filter(firme => {
    const cumpleProvincia = !filtros.provincia || firme.provincia === filtros.provincia;
    const cumpleCarretera = !filtros.carretera || firme.carretera === filtros.carretera;
    
    let cumpleEstado = true;
    if (filtros.sector) {
      switch(filtros.sector) {
        case 'excelente':
          cumpleEstado = firme.indGlobal >= 8;
          break;
        case 'bueno':
          cumpleEstado = firme.indGlobal >= 6 && firme.indGlobal < 8;
          break;
        case 'regular':
          cumpleEstado = firme.indGlobal >= 4 && firme.indGlobal < 6;
          break;
        case 'malo':
          cumpleEstado = firme.indGlobal < 4;
          break;
      }
    }
    
    return cumpleProvincia && cumpleCarretera && cumpleEstado;
  });

  // Calcular KPIs principales
  const calcularKPIs = () => {
    const totalFirmes = firmesFiltrados.length;
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

  // Datos para gráficos
  const datosPorProvincia = firmes.reduce((acc, firme) => {
    const provincia = firme.provincia;
    if (!acc[provincia]) {
      acc[provincia] = {
        provincia,
        indGlobal: 0,
        indSeguridad: 0,
        indEstructural: 0,
        indConfort: 0,
        count: 0
      };
    }
    acc[provincia].indGlobal += firme.indGlobal;
    acc[provincia].indSeguridad += firme.indSeguridad;
    acc[provincia].indEstructural += firme.indEstructural;
    acc[provincia].indConfort += firme.indConfort;
    acc[provincia].count += 1;
    return acc;
  }, {});

  const graficoProvincias = Object.values(datosPorProvincia).map(item => ({
    provincia: item.provincia,
    indGlobal: (item.indGlobal / item.count).toFixed(1),
    indSeguridad: (item.indSeguridad / item.count).toFixed(1),
    indEstructural: (item.indEstructural / item.count).toFixed(1),
    indConfort: (item.indConfort / item.count).toFixed(1)
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
    'Madrid': [40.4168, -3.7038],
    'Barcelona': [41.3851, 2.1734],
    'Valencia': [39.4699, -0.3763],
    'Sevilla': [37.3891, -5.9845],
    'Bilbao': [43.2627, -2.9253]
  };

  const firmesConCoordenadas = firmesFiltrados.map(firme => ({
    ...firme,
    coordenadas: coordenadasProvincias[firme.provincia] || [40.0, -3.0]
  }));

  const getColorByState = (indGlobal) => {
    if (indGlobal >= 8) return '#10B981';
    if (indGlobal >= 6) return '#3B82F6';
    if (indGlobal >= 4) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header moderno */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center justify-between pb-4 border-b-2 border-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-sky-600 to-sky-700 rounded-full"></div>
              <h1 className="text-base font-semibold text-gray-600">Dashboard</h1>
            </div>
            <Link 
              to="/" 
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-200"
            >
              <FaArrowLeft className="text-xs" />
              <span>Volver</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
          {/* KPIs Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div className="text-right flex-1 ml-3">
                <p className="text-sm font-medium text-gray-600 leading-tight">Red buen estado</p>
                <p className="text-3xl font-bold text-gray-600">{kpis.redBuenEstado}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full transition-all duration-1000" style={{width: `${kpis.redBuenEstado}%`}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">De la red total</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="text-right flex-1 ml-3">
                <p className="text-sm font-medium text-gray-600 leading-tight">Red regular</p>
                <p className="text-3xl font-bold text-gray-600">{kpis.redNecesitaAtencion}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-600 h-2 rounded-full transition-all duration-1000" style={{width: `${kpis.redNecesitaAtencion}%`}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">De la red total</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="text-right flex-1 ml-3">
                <p className="text-sm font-medium text-gray-600 leading-tight">Red crítica</p>
                <p className="text-3xl font-bold text-gray-600">{kpis.redCritica}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-600 h-2 rounded-full transition-all duration-1000" style={{width: `${kpis.redCritica}%`}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">De la red total</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-sky-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Gauge className="h-6 w-6 text-white" />
              </div>
              <div className="text-right flex-1 ml-3">
                <p className="text-sm font-medium text-gray-600 leading-tight">Índice global</p>
                <p className="text-3xl font-bold text-gray-600">{kpis.promedioGlobal}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-sky-600 h-2 rounded-full transition-all duration-1000" style={{width: `${(kpis.promedioGlobal / 10) * 100}%`}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">Escala 0-10</p>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-sky-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div className="text-right flex-1 ml-3">
                <p className="text-sm font-medium text-gray-600 leading-tight">IRI promedio</p>
                <p className="text-3xl font-bold text-gray-600">{kpis.promedioIRI}</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-sky-600 h-2 rounded-full transition-all duration-1000" style={{width: `${(kpis.promedioIRI / 5) * 100}%`}}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-right">Escala 0-5</p>
          </div>
        </div>

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Provincia */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Provincia</label>
              <select 
                value={filtros.provincia}
                onChange={(e) => setFiltros({...filtros, provincia: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
              >
                <option value="">Todas las provincias</option>
                {[...new Set(firmes.map(f => f.provincia))].map(provincia => (
                  <option key={provincia} value={provincia}>{provincia}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Carretera */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Carretera</label>
              <select 
                value={filtros.carretera}
                onChange={(e) => setFiltros({...filtros, carretera: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
              >
                <option value="">Todas las carreteras</option>
                {[...new Set(firmes.map(f => f.carretera))].map(carretera => (
                  <option key={carretera} value={carretera}>{carretera}</option>
                ))}
              </select>
            </div>

            {/* Filtro por Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Estado</label>
              <select 
                value={filtros.sector}
                onChange={(e) => setFiltros({...filtros, sector: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm"
              >
                <option value="">Todos los estados</option>
                <option value="excelente">Excelente (8-10)</option>
                <option value="bueno">Bueno (6-8)</option>
                <option value="regular">Regular (4-6)</option>
                <option value="malo">Malo (0-4)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sección Principal: Mapa + Pestañas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* IZQUIERDA: Mapa Interactivo */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-gray-100 rounded-md">
                <MapPin className="h-3.5 w-3.5 text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-600">Estado por ubicación</h3>
            </div>
            <div className="h-[600px] rounded-xl overflow-hidden shadow-lg">
              <MapContainer
                center={[40.0, -3.0]}
                zoom={6}
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
          </div>

          {/* DERECHA: Sistema de Pestañas */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            
            {/* Pestañas */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('graficos')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all duration-200 ${
                  activeTab === 'graficos'
                    ? 'bg-sky-600 text-white border-b-2 border-sky-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Gráficos</span>
              </button>
              <button
                onClick={() => setActiveTab('tabla')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-all duration-200 ${
                  activeTab === 'tabla'
                    ? 'bg-sky-600 text-white border-b-2 border-sky-700'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Table className="h-5 w-5" />
                <span>Tabla</span>
              </button>
            </div>

            {/* Contenido de las Pestañas */}
            <div className="p-6">
              
              {/* Pestaña de Gráficos */}
              {activeTab === 'graficos' && (
                <div className="space-y-6">
                  
                  {/* Gráfico Circular */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <Target className="h-3.5 w-3.5 text-gray-600" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-600">Distribución por estado</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={datosEstado}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {datosEstado.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Gráfico de Barras */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <BarChart3 className="h-3.5 w-3.5 text-gray-600" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-600">Índice global por provincia</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={graficoProvincias}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="provincia" 
                          tick={{ fontSize: 11, fill: '#6b7280' }}
                        />
                        <YAxis 
                          tick={{ fontSize: 11, fill: '#6b7280' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Bar 
                          dataKey="indGlobal" 
                          fill="#0284C7"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
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
