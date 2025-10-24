import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Table, BarChart3 } from 'lucide-react';

const CantabriaViewer = ({ data }) => {
  const [firmes, setFirmes] = useState([]);
  const [lineasVisibles, setLineasVisibles] = useState({
    indGlobal: true,
    indSeguridad: true,
    indConfort: true,
    indEstructural: true
  });

  // Transformar datos del JSON de Cantabria (igual que en DashboardFirmes)
  useEffect(() => {
    if (data && data.length > 0) {
      const datosTransformados = data.map((item, index) => ({
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
    }
  }, [data]);

  // Mostrar todos los datos sin filtros
  const firmesFiltrados = firmes;

  // Procesar datos para gráfica de evolución temporal (igual que en DashboardFirmes)
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

  // Función para mostrar solo una línea (igual que en DashboardFirmes)
  const mostrarSoloLinea = (linea) => {
    setLineasVisibles({
      indGlobal: false,
      indSeguridad: false,
      indConfort: false,
      indEstructural: false,
      [linea]: true
    });
  };


  return (
    <div className="space-y-6">
      {/* Título general */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Pre visualización de datos</h2>
      </div>
      
      {/* Layout lado a lado: Tabla izquierda, Gráfica derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Tabla - Lado Izquierdo */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="h-[400px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Carretera
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    PK
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Índice
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    IRI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {firmesFiltrados.map((firme, index) => (
                  <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {firme.carretera}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {firme.pkIni}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          firme.indGlobal >= 8 ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' :
                          firme.indGlobal >= 6 ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200' :
                          firme.indGlobal >= 4 ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200' :
                          'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {firme.indGlobal}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {firme.iri}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gráfica - Lado Derecho */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-sky-100 to-blue-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-sky-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Evolución temporal de índices</h3>
                <p className="text-sm text-slate-600">Tendencia de calidad por fecha de medición CRT</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            {datosEvolucionTemporal.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
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
              <div className="flex items-center justify-center h-48 text-gray-500">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay datos de evolución temporal disponibles</p>
                  <p className="text-sm">Los datos se agrupan por fecha de medición</p>
                </div>
              </div>
            )}
            
            {/* Leyenda personalizada clickeable */}
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => mostrarSoloLinea('indGlobal')}
              >
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Global</span>
              </button>
              <button
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => mostrarSoloLinea('indSeguridad')}
              >
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>Seguridad</span>
              </button>
              <button
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => mostrarSoloLinea('indConfort')}
              >
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Confort</span>
              </button>
              <button
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
                onClick={() => mostrarSoloLinea('indEstructural')}
              >
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>Estructural</span>
              </button>
              <button
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
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
      </div>
    </div>
  );
};

export default CantabriaViewer;