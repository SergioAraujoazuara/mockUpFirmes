import React, { useState } from 'react';
import { FaSearch, FaArrowLeft, FaFilter, FaDownload, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import ordenesData from './ordenes_estudio.json';

function OrdenesEstudio() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnidad, setFilterUnidad] = useState('');
  const [filterSituacion, setFilterSituacion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Datos del JSON - aplanar la estructura por provincias
  const ordenes = Object.values(ordenesData.provincias).flat();

  // Filtrado de datos
  const filteredData = ordenes.filter(item => {
    const matchSearch = item.clave.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchUnidad = filterUnidad === '' || Object.keys(ordenesData.provincias).find(provincia => 
      ordenesData.provincias[provincia].includes(item)
    ) === filterUnidad;
    const matchSituacion = filterSituacion === '' || item.situacion === filterSituacion;
    
    return matchSearch && matchUnidad && matchSituacion;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset page cuando cambian los filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterUnidad, filterSituacion]);

  // Obtener opciones únicas para filtros
  const unidades = Object.keys(ordenesData.provincias).sort();
  const situaciones = [...new Set(ordenes.map(item => item.situacion))].sort();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getSituacionColor = (situacion) => {
    switch(situacion) {
      case 'ADJUDICADA': return 'bg-green-100 text-green-800';
      case 'PROGRAMADA': return 'bg-blue-100 text-blue-800';
      case 'VIVA': return 'bg-yellow-100 text-yellow-800';
      case 'EJECUTADA': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPresupuesto = (presupuesto) => {
    if (!presupuesto || presupuesto === '') return '-';
    return `${presupuesto} €`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center justify-between pb-4 border-b-2 border-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-sky-500 to-sky-600 rounded-full"></div>
              <h1 className="text-base font-semibold text-gray-800">Órdenes de estudio (GECO)</h1>
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
        
        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                <FaSearch className="inline mr-2" />
                Búsqueda
              </label>
              <input
                type="text"
                placeholder="Buscar por clave, título o unidad..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Filtro Unidad */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                <FaFilter className="inline mr-2" />
                Unidad
              </label>
              <select
                value={filterUnidad}
                onChange={(e) => setFilterUnidad(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todas</option>
                {unidades.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            {/* Filtro Situación */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">
                <FaFilter className="inline mr-2" />
                Situación
              </label>
              <select
                value={filterSituacion}
                onChange={(e) => setFilterSituacion(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Todas</option>
                {situaciones.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Mostrando <strong>{filteredData.length}</strong> de <strong>{ordenes.length}</strong> registros
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors">
              <FaDownload />
              Exportar resultados
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-xs text-gray-600 mb-1">Total Órdenes</div>
            <div className="text-2xl font-bold text-gray-600">{ordenes.length}</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-xs text-gray-600 mb-1">Adjudicadas</div>
            <div className="text-2xl font-bold text-gray-600">
              {ordenes.filter(o => o.situacion === 'ADJUDICADA').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-xs text-gray-600 mb-1">Programadas</div>
            <div className="text-2xl font-bold text-gray-600">
              {ordenes.filter(o => o.situacion === 'PROGRAMADA').length}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="text-xs text-gray-600 mb-1">Vivas</div>
            <div className="text-2xl font-bold text-gray-600">
              {ordenes.filter(o => o.situacion === 'VIVA').length}
            </div>
          </div>
        </div>

        {/* Tabla de resultados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-sky-50 to-sky-100 border-b border-sky-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Clave</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Título</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Unidad</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Situación</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Fechas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Presupuesto OE</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Presupuesto Vigente</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.clave} className={`hover:bg-sky-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.clave}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                        <div className="truncate" title={item.titulo}>
                          {item.titulo}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {Object.keys(ordenesData.provincias).find(provincia => 
                          ordenesData.provincias[provincia].includes(item)
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSituacionColor(item.situacion)}`}>
                          {item.situacion}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="text-xs">
                          <div>Inicio: {item.fecha_inicio || '-'}</div>
                          <div>Fin: {item.fecha_fin || '-'}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatPresupuesto(item.presupuesto_oe)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatPresupuesto(item.presupuesto_vigente)}</td>
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
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
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

export default OrdenesEstudio;
