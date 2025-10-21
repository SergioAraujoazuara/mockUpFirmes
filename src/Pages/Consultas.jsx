import React, { useState } from 'react';
import { FaSearch, FaArrowLeft, FaFilter, FaDownload, FaEye, FaChevronLeft, FaChevronRight, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Consultas() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCarretera, setFilterCarretera] = useState('');
  const [filterProvincia, setFilterProvincia] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Datos sintéticos de inventario (expandidos para paginación)
  const inventarioData = [
    { id: 1, carretera: 'A-1', pk: '12+500', provincia: 'Madrid', tipo: 'Flexible', estado: 'Bueno', año: 2020, espesor: '25 cm' },
    { id: 2, carretera: 'A-2', pk: '45+200', provincia: 'Zaragoza', tipo: 'Rígido', estado: 'Regular', año: 2018, espesor: '30 cm' },
    { id: 3, carretera: 'A-3', pk: '78+800', provincia: 'Valencia', tipo: 'Flexible', estado: 'Excelente', año: 2022, espesor: '22 cm' },
    { id: 4, carretera: 'A-4', pk: '34+150', provincia: 'Sevilla', tipo: 'Semirígido', estado: 'Bueno', año: 2019, espesor: '28 cm' },
    { id: 5, carretera: 'A-5', pk: '56+900', provincia: 'Badajoz', tipo: 'Flexible', estado: 'Regular', año: 2017, espesor: '24 cm' },
    { id: 6, carretera: 'A-6', pk: '23+400', provincia: 'León', tipo: 'Rígido', estado: 'Bueno', año: 2021, espesor: '32 cm' },
    { id: 7, carretera: 'A-7', pk: '67+300', provincia: 'Murcia', tipo: 'Flexible', estado: 'Excelente', año: 2023, espesor: '26 cm' },
    { id: 8, carretera: 'A-8', pk: '89+600', provincia: 'Vizcaya', tipo: 'Semirígido', estado: 'Regular', año: 2016, espesor: '27 cm' },
    { id: 9, carretera: 'A-1', pk: '102+200', provincia: 'Burgos', tipo: 'Flexible', estado: 'Bueno', año: 2020, espesor: '25 cm' },
    { id: 10, carretera: 'A-2', pk: '134+700', provincia: 'Barcelona', tipo: 'Rígido', estado: 'Excelente', año: 2022, espesor: '30 cm' },
    { id: 11, carretera: 'A-3', pk: '89+400', provincia: 'Cuenca', tipo: 'Flexible', estado: 'Bueno', año: 2019, espesor: '24 cm' },
    { id: 12, carretera: 'A-4', pk: '156+800', provincia: 'Córdoba', tipo: 'Rígido', estado: 'Regular', año: 2018, espesor: '29 cm' },
    { id: 13, carretera: 'A-5', pk: '78+300', provincia: 'Cáceres', tipo: 'Flexible', estado: 'Excelente', año: 2023, espesor: '26 cm' },
    { id: 14, carretera: 'A-6', pk: '145+600', provincia: 'Lugo', tipo: 'Semirígido', estado: 'Bueno', año: 2021, espesor: '27 cm' },
    { id: 15, carretera: 'A-7', pk: '234+200', provincia: 'Almería', tipo: 'Flexible', estado: 'Regular', año: 2017, espesor: '23 cm' },
    { id: 16, carretera: 'A-8', pk: '67+100', provincia: 'Cantabria', tipo: 'Rígido', estado: 'Excelente', año: 2022, espesor: '31 cm' },
    { id: 17, carretera: 'A-1', pk: '178+900', provincia: 'Valladolid', tipo: 'Flexible', estado: 'Bueno', año: 2020, espesor: '25 cm' },
    { id: 18, carretera: 'A-2', pk: '267+400', provincia: 'Lleida', tipo: 'Semirígido', estado: 'Regular', año: 2019, espesor: '28 cm' },
  ];

  // Filtrado de datos
  const filteredData = inventarioData.filter(item => {
    const matchSearch = item.carretera.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.pk.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.provincia.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCarretera = filterCarretera === '' || item.carretera === filterCarretera;
    const matchProvincia = filterProvincia === '' || item.provincia === filterProvincia;
    
    return matchSearch && matchCarretera && matchProvincia;
  });

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset page cuando cambian los filtros
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCarretera, filterProvincia]);

  // Obtener opciones únicas para filtros
  const carreteras = [...new Set(inventarioData.map(item => item.carretera))].sort();
  const provincias = [...new Set(inventarioData.map(item => item.provincia))].sort();

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                <FaSearch className="inline mr-2" />
                Búsqueda
              </label>
              <input
                type="text"
                placeholder="Buscar por carretera, PK o provincia..."
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Carretera</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PK</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Provincia</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipo Firme</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Año</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Espesor</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.length > 0 ? (
                  currentData.map((item, index) => (
                    <tr key={item.id} className={`hover:bg-sky-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.carretera}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.pk}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.provincia}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.tipo}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getEstadoIcon(item.estado)}`}></div>
                          <span className={`text-sm ${getEstadoColor(item.estado)}`}>
                            {item.estado}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.año}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.espesor}</td>
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

export default Consultas;

