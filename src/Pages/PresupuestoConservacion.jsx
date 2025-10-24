import React, { useState, useEffect } from 'react';
import HeaderPage from '../Components/HeaderPage';
import { 
  FaFilter, 
  FaEdit, 
  FaSave, 
  FaTimes,
  FaChartBar,
  FaChartPie,
  FaCalculator,
  FaRoad,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const PresupuestoConservacion = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [filtros, setFiltros] = useState({
    tipoIntervencion: '',
    carretera: '',
    tramo: ''
  });
  
  // Tabla lateral editable
  const [costes, setCostes] = useState({
    estructural: 978860.00,
    mixta: 628330.00,
    superficial: 268740.00
  });
  
  const [editingCostes, setEditingCostes] = useState(false);
  
  // Deslizante para seleccionar año (0-10)
  const [añoSeleccionado, setAñoSeleccionado] = useState(0);
  
  // Presupuesto calculado
  const [presupuesto, setPresupuesto] = useState(0);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  // Función para limpiar datos NaN
  const cleanData = (data) => {
    return data.map(item => {
      const cleaned = {};
      Object.keys(item).forEach(key => {
        const value = item[key];
        if (value === 'NaN' || value === null || value === undefined) {
          cleaned[key] = null;
        } else if (typeof value === 'string' && value.trim() === '') {
          cleaned[key] = null;
        } else {
          cleaned[key] = value;
        }
      });
      return cleaned;
    });
  };

  // Cargar datos del JSON
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Cargando datos de presupuesto...');
        const response = await fetch('/presupuesto/presupuesto.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const rawData = await response.text();
        console.log('Datos raw cargados, procesando...');
        
        // Limpiar valores NaN antes de parsear
        const cleanedRawData = rawData.replace(/:\s*NaN\s*([,}])/g, ': null$1');
        const jsonData = JSON.parse(cleanedRawData);
        
        // Limpiar datos adicionales
        const cleanedData = cleanData(jsonData);
        
        console.log('Datos cargados:', cleanedData.length, 'registros');
        console.log('Primer registro:', cleanedData[0]);
        console.log('PK Inicio del primer registro:', cleanedData[0]?.pkini);
        console.log('PK Fin del primer registro:', cleanedData[0]?.pkfin);
        console.log('Tipo de pkini:', typeof cleanedData[0]?.pkini);
        console.log('Tipo de pkfin:', typeof cleanedData[0]?.pkfin);
        
        setData(cleanedData);
        setFilteredData(cleanedData);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = data;
    
    if (filtros.tipoIntervencion) {
      filtered = filtered.filter(item => 
        item.rehabilitacion && item.rehabilitacion.toLowerCase().includes(filtros.tipoIntervencion.toLowerCase())
      );
    }
    
    if (filtros.carretera) {
      filtered = filtered.filter(item => 
        item.carretera && item.carretera.toLowerCase().includes(filtros.carretera.toLowerCase())
      );
    }
    
    if (filtros.tramo) {
      filtered = filtered.filter(item => 
        `${item.pkini}-${item.pkfin}`.includes(filtros.tramo)
      );
    }
    
    setFilteredData(filtered);
  }, [filtros, data]);

  // Calcular presupuesto basado en año seleccionado (Fase 2)
  useEffect(() => {
    // Calcular la longitud total de los tramos filtrados en kilómetros
    const longitudTotal = filteredData.reduce((sum, item) => {
      const longitud = (item.pkfindist - item.pkinidist) / 1000; // Convertir metros a km
      return sum + longitud;
    }, 0);
    
    // Obtener la columna de coste según el año seleccionado
    const columnaCoste = `cote_ano_${añoSeleccionado}`;
    
    // Calcular el coste promedio de la columna del año seleccionado
    const costePromedio = filteredData.length > 0 ? 
      filteredData.reduce((sum, item) => sum + (item[columnaCoste] || 0), 0) / filteredData.length : 0;
    
    // Calcular presupuesto: longitud x coste promedio del año seleccionado
    const presupuestoCalculado = longitudTotal * costePromedio;
    setPresupuesto(presupuestoCalculado);
  }, [filteredData, añoSeleccionado]);

  // Obtener opciones únicas para filtros
  const tiposIntervencion = [...new Set(data.map(item => item.rehabilitacion).filter(Boolean))];
  const carreteras = [...new Set(data.map(item => item.carretera).filter(Boolean))];

  // Cálculos de paginación
  const totalPages = Math.ceil(filteredData.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Funciones de paginación
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filtros]);

  // Datos para gráfico de barras (Índice Global)
  const getIndiceData = () => {
    const crt = filteredData.reduce((sum, item) => sum + (item.crt || 0), 0) / filteredData.length || 0;
    const iri = filteredData.reduce((sum, item) => sum + (item.iri || 0), 0) / filteredData.length || 0;
    const detur = filteredData.reduce((sum, item) => sum + (item.fisuracion || 0), 0) / filteredData.length || 0;
    
    return [
      { name: 'CRT', valor: crt, color: '#3B82F6' }, // Azul
      { name: 'IRI', valor: iri, color: '#10B981' }, // Verde
      { name: 'DETUR', valor: detur, color: '#F59E0B' } // Amarillo
    ];
  };

  // Mapeo fijo de colores por tipo de rehabilitación
  const REHABILITACION_COLORS = {
    'ESTRUCTURAL': '#3B82F6',  // Azul
    'MIXTA': '#10B981',        // Verde
    'SUPERFICIAL': '#F59E0B',  // Amarillo
    'SIN_DATOS': '#8B5CF6'     // Púrpura
  };

  // Datos para gráfico circular (Tipos de Intervención)
  const getIntervencionData = () => {
    const intervenciones = {};
    filteredData.forEach(item => {
      const tipo = item.rehabilitacion || 'SIN_DATOS';
      intervenciones[tipo] = (intervenciones[tipo] || 0) + 1;
    });
    
    return Object.entries(intervenciones).map(([tipo, cantidad]) => ({
      tipo,
      cantidad,
      color: REHABILITACION_COLORS[tipo] || '#8B5CF6'
    }));
  };

  const handleCosteChange = (campo, valor) => {
    setCostes(prev => ({
      ...prev,
      [campo]: parseFloat(valor) || 0
    }));
  };

  const saveCostes = () => {
    setEditingCostes(false);
    // Aquí podrías guardar en localStorage o enviar a un servidor
    localStorage.setItem('costesPresupuesto', JSON.stringify(costes));
  };

  const loadCostes = () => {
    const saved = localStorage.getItem('costesPresupuesto');
    if (saved) {
      setCostes(JSON.parse(saved));
    }
  };

  useEffect(() => {
    loadCostes();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <HeaderPage 
          title="Presupuesto de Conservación"
          showBackButton={true}
          backPath="/"
        />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando datos de presupuesto...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeaderPage 
        title="Presupuesto de Conservación"
        showBackButton={true}
        backPath="/"
      />

      <div className="px-14 py-6">
        {/* Información de datos */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 mb-4">
                <FaFilter className="text-sky-600" />
                <h3 className="text-sm font-semibold text-gray-800">Filtros de Búsqueda</h3>
              </div>
            <div className="text-xs text-gray-600">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {data.length} registros cargados
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                <FaChartPie className="inline mr-2" />
                Tipos de intervención
              </label>
              <select
                value={filtros.tipoIntervencion}
                onChange={(e) => setFiltros(prev => ({ ...prev, tipoIntervencion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">Todos los tipos</option>
                {tiposIntervencion.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                <FaRoad className="inline mr-2" />
                Carretera
              </label>
              <select
                value={filtros.carretera}
                onChange={(e) => setFiltros(prev => ({ ...prev, carretera: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">Todas las carreteras</option>
                {carreteras.map(carr => (
                  <option key={carr} value={carr}>{carr}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Tramo (PK)
              </label>
              <input
                type="text"
                placeholder="Ej: 146-147"
                value={filtros.tramo}
                onChange={(e) => setFiltros(prev => ({ ...prev, tramo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tabla principal de datos */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaChartBar className="text-sky-600" />
                TABLA → DATOS
              </h3>
              
              <div 
                className="overflow-x-auto max-h-[400px] overflow-y-auto"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#d1d5db #f3f4f6'
                }}
              >
                <table className="w-full text-xs">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-50">
                      <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">Provincia</th>
                      <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">Carretera</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Calzada</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">PK Inicio</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">PK Fin</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">CRT</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Fisuracion</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">IRI</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">MPD</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Rodera</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Deflexion</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">IMDP</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">IMD Total</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">I Reg Long</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">I Reg Transv</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">I Resist Desliz</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">I Macrotextura</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">I Capac Portante</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">I Fisuracion</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Ind Seguridad</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Ind Confort</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Ind Estructural</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Ind Global</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Rehabilitacion</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste/K</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste Año 0</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste Año 1</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste Año 2</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste Año 3</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste Año 4</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste Año 5</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste Año 6</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste Año 7</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste Año 8</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste Año 9</th>
                      <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700">Coste Año 10</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-2 py-2 text-xs text-left">{item.provincia || 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-left">{item.carretera || 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.calzada || 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">
                          {item.pkini !== null && item.pkini !== undefined ? 
                            (typeof item.pkini === 'number' ? item.pkini.toFixed(0) : item.pkini) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center">
                          {item.pkfin !== null && item.pkfin !== undefined ? 
                            (typeof item.pkfin === 'number' ? item.pkfin.toFixed(0) : item.pkfin) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center">{item.crt !== null && item.crt !== undefined ? item.crt.toFixed(2) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.fisuracion !== null && item.fisuracion !== undefined ? item.fisuracion.toFixed(2) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.iri !== null && item.iri !== undefined ? item.iri.toFixed(2) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.mpd !== null && item.mpd !== undefined ? item.mpd.toFixed(2) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.rodera !== null && item.rodera !== undefined ? item.rodera.toFixed(2) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.deflexion !== null && item.deflexion !== undefined ? item.deflexion.toFixed(2) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.imdp !== null && item.imdp !== undefined ? item.imdp.toFixed(2) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.imd_total !== null && item.imd_total !== undefined ? item.imd_total.toFixed(2) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.i_reglong !== null && item.i_reglong !== undefined ? item.i_reglong.toFixed(3) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.i_reg_transv !== null && item.i_reg_transv !== undefined ? item.i_reg_transv.toFixed(3) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.i_resistdesliz !== null && item.i_resistdesliz !== undefined ? item.i_resistdesliz.toFixed(2) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.i_macrotextura !== null && item.i_macrotextura !== undefined ? item.i_macrotextura.toFixed(3) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.i_capacportante !== null && item.i_capacportante !== undefined ? item.i_capacportante.toFixed(3) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.i_fisuracion !== null && item.i_fisuracion !== undefined ? item.i_fisuracion.toFixed(3) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.indseguridad !== null && item.indseguridad !== undefined ? item.indseguridad.toFixed(2) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.indconfort !== null && item.indconfort !== undefined ? item.indconfort.toFixed(3) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center">{item.indestructural !== null && item.indestructural !== undefined ? item.indestructural.toFixed(3) : 'N/A'}</td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.indglobal !== null && item.indglobal !== undefined ? item.indglobal.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center">
                          <span className={`px-1 py-1 rounded text-xs font-semibold ${
                            item.rehabilitacion === 'ESTRUCTURAL' ? 'bg-blue-100 text-blue-800' :
                            item.rehabilitacion === 'MIXTA' ? 'bg-green-100 text-green-800' :
                            item.rehabilitacion === 'SUPERFICIAL' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {item.rehabilitacion || 'N/A'}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.costekm !== null && item.costekm !== undefined ? 
                            item.costekm.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.cote_ano_0 !== null && item.cote_ano_0 !== undefined ? 
                            item.cote_ano_0.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.cote_ano_1 !== null && item.cote_ano_1 !== undefined ? 
                            item.cote_ano_1.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.cote_ano_2 !== null && item.cote_ano_2 !== undefined ? 
                            item.cote_ano_2.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.cote_ano_3 !== null && item.cote_ano_3 !== undefined ? 
                            item.cote_ano_3.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.cote_ano_4 !== null && item.cote_ano_4 !== undefined ? 
                            item.cote_ano_4.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.cote_ano_5 !== null && item.cote_ano_5 !== undefined ? 
                            item.cote_ano_5.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.cote_ano_6 !== null && item.cote_ano_6 !== undefined ? 
                            item.cote_ano_6.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.cote_ano_7 !== null && item.cote_ano_7 !== undefined ? 
                            item.cote_ano_7.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.cote_ano_8 !== null && item.cote_ano_8 !== undefined ? 
                            item.cote_ano_8.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.cote_ano_9 !== null && item.cote_ano_9 !== undefined ? 
                            item.cote_ano_9.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-2 py-2 text-xs text-center text-gray-700">
                          {item.cote_ano_10 !== null && item.cote_ano_10 !== undefined ? 
                            item.cote_ano_10.toFixed(2) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Información de registros */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 mb-4">
                  Mostrando {startIndex + 1} - {Math.min(endIndex, filteredData.length)} de {filteredData.length} registros
                </p>
                
                {/* Controles de paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    {/* Botón Anterior */}
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-sky-600 text-white hover:bg-sky-700'
                      }`}
                    >
                      Anterior
                    </button>
                    
                    {/* Números de página */}
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-3 py-1 rounded-md text-xs font-medium ${
                              currentPage === pageNum
                                ? 'bg-sky-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Botón Siguiente */}
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-sky-600 text-white hover:bg-sky-700'
                      }`}
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel lateral derecho */}
          <div className="lg:col-span-1">
            {/* Tabla de costes editable */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <FaCalculator className="text-sky-600" />
                  Costes (E/K)
                </h3>
                {editingCostes ? (
                  <div className="flex gap-2">
                    <button
                      onClick={saveCostes}
                      className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={() => setEditingCostes(false)}
                      className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingCostes(true)}
                    className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                  >
                    <FaEdit />
                  </button>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700">ESTRUCTURAL</span>
                  {editingCostes ? (
                    <input
                      type="number"
                      value={costes.estructural}
                      onChange={(e) => handleCosteChange('estructural', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  ) : (
                    <span className="text-md font-semibold text-gray-900">
                      {costes.estructural.toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR',
                        minimumFractionDigits: 2 
                      })}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700">MIXTA</span>
                  {editingCostes ? (
                    <input
                      type="number"
                      value={costes.mixta}
                      onChange={(e) => handleCosteChange('mixta', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  ) : (
                    <span className="text-md font-semibold text-gray-900">
                      {costes.mixta.toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR',
                        minimumFractionDigits: 2 
                      })}
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700">SUPERFICIAL</span>
                  {editingCostes ? (
                    <input
                      type="number"
                      value={costes.superficial}
                      onChange={(e) => handleCosteChange('superficial', e.target.value)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  ) : (
                    <span className="text-md font-semibold text-gray-900">
                      {costes.superficial.toLocaleString('es-ES', { 
                        style: 'currency', 
                        currency: 'EUR',
                        minimumFractionDigits: 2 
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Deslizante para seleccionar año */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Selección de Año
              </h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-md font-bold text-sky-600">Año {añoSeleccionado}</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={añoSeleccionado}
                  onChange={(e) => setAñoSeleccionado(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(añoSeleccionado / 10) * 100}%, #e5e7eb ${(añoSeleccionado / 10) * 100}%, #e5e7eb 100%)`
                  }}
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0</span>
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                </div>
              </div>
            </div>

            {/* Casilla resultado - Presupuesto */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-800 mb-4">
                Presupuesto de Conservación
              </h3>
              
              <div className="text-center">
                <div className="rounded-lg p-4 border border-green-200">
                  <div className="text-md font-bold text-green-700">
                    {presupuesto.toLocaleString('es-ES', { 
                      style: 'currency', 
                      currency: 'EUR',
                      minimumFractionDigits: 2 
                    })}
                  </div>
                 
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Gráfico de barras - Índice Global */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaChartBar className="" />
              Índice Global
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getIndiceData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 60]} />
                <Tooltip />
                <Bar dataKey="valor" fill="#8884d8">
                  {getIndiceData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico circular - Tipos de Intervención */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <FaChartPie className="" />
              Tipos de Intervención
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={getIntervencionData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {getIntervencionData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <style jsx>{`
                  .recharts-pie-label-text {
                    fill: #6B7280 !important;
                    font-size: 12px !important;
                  }
                  .recharts-text {
                    fill: #6B7280 !important;
                  }
                `}</style>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresupuestoConservacion;
