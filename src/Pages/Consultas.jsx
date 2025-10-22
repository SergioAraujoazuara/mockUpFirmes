import React, { useState, useEffect } from 'react';
import { FaSearch, FaArrowLeft, FaFilter, FaDownload, FaEye, FaChevronLeft, FaChevronRight, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import carreterasData from '../../public/catalogo_carreteras/carreteras_tablas.json';

function Consultas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCarretera, setFilterCarretera] = useState('');
  const [filterProvincia, setFilterProvincia] = useState('');
  const [filterCCAA, setFilterCCAA] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Cargar datos del JSON y agregar estados aleatorios para simular
  const [inventarioData, setInventarioData] = useState([]);

  useEffect(() => {
    // Obtener registros de la hoja "Auxiliar"
    const auxiliarSheet = carreterasData.tables.find(table => table.sheet === 'Auxiliar');
    
    if (auxiliarSheet && auxiliarSheet.records) {
      // Agregar ID y estados aleatorios a cada registro
      const estados = ['Excelente', 'Bueno', 'Regular'];
      const dataWithState = auxiliarSheet.records.map((record, index) => ({
        id: index + 1,
        carretera: record.Via || 'N/A',
        ccaa: record.CCAA || 'N/A',
        provincia: record.Provincia || 'N/A',
        pkInicio: record['P.K. inicio'] || 'N/A',
        pkFin: record['P.K. fin'] || 'N/A',
        longitud: record['Longitud (km)'] || 'N/A',
        inicio: record.Inicio || 'N/A',
        fin: record.Fin || 'N/A',
        tipo: record['Tipo de vía'] || 'N/A',
        estado: estados[Math.floor(Math.random() * estados.length)]
      }));
      setInventarioData(dataWithState);
    }
  }, []);

  // Filtrado de datos
  const filteredData = inventarioData.filter(item => {
    const matchSearch = item.carretera.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.provincia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.ccaa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.inicio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.fin.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCarretera = filterCarretera === '' || item.carretera === filterCarretera;
    const matchProvincia = filterProvincia === '' || item.provincia === filterProvincia;
    const matchCCAA = filterCCAA === '' || item.ccaa === filterCCAA;
    
    return matchSearch && matchCarretera && matchProvincia && matchCCAA;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset page cuando cambian los filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCarretera, filterProvincia, filterCCAA]);

  // Obtener opciones únicas para filtros
  const carreteras = [...new Set(inventarioData.map(item => item.carretera))].sort();
  const provincias = [...new Set(inventarioData.map(item => item.provincia))].sort();
  const ccaas = [...new Set(inventarioData.map(item => item.ccaa))].sort();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Excelente': return 'text-gray-600';
      case 'Bueno': return 'text-gray-600';
      case 'Regular': return 'text-gray-600';
      case 'Malo': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case 'Excelente': return 'bg-green-700';
      case 'Bueno': return 'bg-yellow-700';
      case 'Regular': return 'bg-orange-700';
      case 'Malo': return 'bg-red-700';
      default: return 'bg-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center justify-between pb-4 border-b-2 border-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-sky-500 to-sky-600 rounded-full"></div>
              <h1 className="text-base font-semibold text-gray-800">Consultas - Inventario de firmes</h1>
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

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="text-xs text-gray-600">Total Registros</div>
            </div>
            <div className="text-2xl font-bold text-gray-600">{inventarioData.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-700 rounded-full"></div>
              <div className="text-xs text-gray-600 font-light">Excelente</div>
            </div>
            <div className="text-2xl font-bold text-gray-600">
              {inventarioData.filter(i => i.estado === 'Excelente').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-yellow-700 rounded-full"></div>
              <div className="text-xs text-gray-600 font-light">Bueno</div>
            </div>
            <div className="text-2xl font-bold text-gray-600">
              {inventarioData.filter(i => i.estado === 'Bueno').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-orange-700 rounded-full"></div>
              <div className="text-xs text-gray-600 font-light">Regular</div>
            </div>
            <div className="text-2xl font-bold text-gray-600">
              {inventarioData.filter(i => i.estado === 'Regular').length}
            </div>
          </div>
        </div>
        
        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                <FaSearch className="inline mr-2" />
                Búsqueda
              </label>
              <input
                type="text"
                placeholder="Buscar por carretera, provincia, CCAA..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Filtro Carretera */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                <FaFilter className="inline mr-2" />
                Carretera
              </label>
              <select
                value={filterCarretera}
                onChange={(e) => setFilterCarretera(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todas</option>
                {carreteras.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Filtro CCAA */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                <FaFilter className="inline mr-2" />
                CCAA
              </label>
              <select
                value={filterCCAA}
                onChange={(e) => setFilterCCAA(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todas</option>
                {ccaas.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Filtro Provincia */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                <FaFilter className="inline mr-2" />
                Provincia
              </label>
              <select
                value={filterProvincia}
                onChange={(e) => setFilterProvincia(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todas</option>
                {provincias.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Mostrando <strong>{filteredData.length}</strong> de <strong>{inventarioData.length}</strong> registros
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors">
              <FaDownload />
              Exportar resultados
            </button>
          </div>
        </div>

        {/* Tabla de resultados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-sky-50 to-sky-100 border-b border-sky-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Vía</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">CCAA</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Provincia</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Longitud (km)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Inicio</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Fin</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Tipo de vía</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Estado</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-sky-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.carretera}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.ccaa}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.provincia}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.longitud}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.inicio}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.fin}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.tipo}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getEstadoIcon(item.estado)}`}></div>
                          <span className={`text-sm ${getEstadoColor(item.estado)}`}>
                            {item.estado}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          className="inline-flex items-center gap-1 px-3 py-1 text-xs text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded transition-colors"
                          title="Ver detalles"
                        >
                          <FaEye />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {filteredData.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Mostrando {startIndex + 1} - {Math.min(endIndex, filteredData.length)} de {filteredData.length} registros
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-sky-50 hover:text-sky-600 border border-gray-300'
                    }`}
                  >
                    <FaChevronLeft className="text-xs" />
                    Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      // Mostrar solo algunas páginas para no saturar
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-sky-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-sky-50 hover:text-sky-600 border border-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-sky-50 hover:text-sky-600 border border-gray-300'
                    }`}
                  >
                    Siguiente
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Consultas;

