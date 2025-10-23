import React from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const ActuacionesTable = ({ fileName = '' }) => {
  // Datos completos basados en la tabla A-1 RM proporcionada
  const actuacionesData = [
    // EL-20 - SUPERFICIAL 2015
    {
      unidad: "ALICANTE",
      provincia: "ALICANTE",
      sector: "A-1",
      via: "EL-20",
      calzada: "1",
      carril: "1",
      pkInicial: "0,000",
      pkFinal: "2,800",
      anchoCalzada: "7",
      arcenDcho: "2,5",
      arcenIzqdo: "1",
      naturaleza: "INTERURBANO",
      nivelFreatico: "> 3 m",
      seccionTransversal: "Mixto (desmonte y terraplén)",
      fecha: "2015",
      tipoActuacion: "SUPERFICIAL",
      profundidad: "0",
      capaRodadura: "BBTM",
      tipoMezcla: "BBTM 11 B",
      ligante: "PMB 45/80-60 ≈ BM-3b",
      espesor: "3",
      clasificacion: "3 SR",
      seccionFirme: "E2",
      espesorTotal: "21",
      observaciones: "Reparación de deterioros en distintos puntos del tramo indicado, realizando reparaciones estructurales"
    },
    {
      unidad: "ALICANTE",
      provincia: "ALICANTE",
      sector: "A-1",
      via: "EL-20",
      calzada: "1",
      carril: "2",
      pkInicial: "0,000",
      pkFinal: "2,800",
      anchoCalzada: "7",
      arcenDcho: "2,5",
      arcenIzqdo: "1",
      naturaleza: "INTERURBANO",
      nivelFreatico: "> 3 m",
      seccionTransversal: "Mixto (desmonte y terraplén)",
      fecha: "2015",
      tipoActuacion: "SUPERFICIAL",
      profundidad: "0",
      capaRodadura: "BBTM",
      tipoMezcla: "BBTM 11 B",
      ligante: "PMB 45/80-60 ≈ BM-3b",
      espesor: "3",
      clasificacion: "3 SR",
      seccionFirme: "E2",
      espesorTotal: "21",
      observaciones: "Reparación de deterioros en distintos puntos del tramo indicado, realizando reparaciones estructurales"
    },
    {
      unidad: "ALICANTE",
      provincia: "ALICANTE",
      sector: "A-1",
      via: "EL-20",
      calzada: "2",
      carril: "1",
      pkInicial: "0,000",
      pkFinal: "2,800",
      anchoCalzada: "7",
      arcenDcho: "2,5",
      arcenIzqdo: "1",
      naturaleza: "INTERURBANO",
      nivelFreatico: "> 3 m",
      seccionTransversal: "Mixto (desmonte y terraplén)",
      fecha: "2015",
      tipoActuacion: "SUPERFICIAL",
      profundidad: "0",
      capaRodadura: "BBTM",
      tipoMezcla: "BBTM 11 B",
      ligante: "PMB 45/80-60 ≈ BM-3b",
      espesor: "3",
      clasificacion: "3 SR",
      seccionFirme: "E2",
      espesorTotal: "21",
      observaciones: "Reparación de deterioros en distintos puntos del tramo indicado, realizando reparaciones estructurales"
    },
    {
      unidad: "ALICANTE",
      provincia: "ALICANTE",
      sector: "A-1",
      via: "EL-20",
      calzada: "2",
      carril: "2",
      pkInicial: "0,000",
      pkFinal: "2,800",
      anchoCalzada: "7",
      arcenDcho: "2,5",
      arcenIzqdo: "1",
      naturaleza: "INTERURBANO",
      nivelFreatico: "> 3 m",
      seccionTransversal: "Mixto (desmonte y terraplén)",
      fecha: "2015",
      tipoActuacion: "SUPERFICIAL",
      profundidad: "0",
      capaRodadura: "BBTM",
      tipoMezcla: "BBTM 11 B",
      ligante: "PMB 45/80-60 ≈ BM-3b",
      espesor: "3",
      clasificacion: "3 SR",
      seccionFirme: "E2",
      espesorTotal: "21",
      observaciones: "Reparación de deterioros en distintos puntos del tramo indicado, realizando reparaciones estructurales"
    },
    // A-70 - ESTRUCTURAL 2018
    {
      unidad: "ALICANTE",
      provincia: "ALICANTE",
      sector: "A-1",
      via: "A-70",
      calzada: "1",
      carril: "0",
      pkInicial: "22,420",
      pkFinal: "31,210",
      anchoCalzada: "7",
      arcenDcho: "2,5",
      arcenIzqdo: "1",
      naturaleza: "INTERURBANO",
      nivelFreatico: "> 3 m",
      seccionTransversal: "Mixto (desmonte y terraplén)",
      fecha: "2018",
      tipoActuacion: "ESTRUCTURAL",
      profundidad: "10",
      capaBase: "AC 22 bin S",
      liganteBase: "35/50 ≈ B40/50",
      espesorBase: "3,5",
      capaIntermedia: "AC",
      tipoMezclaIntermedia: "AC 22 surf S",
      liganteIntermedia: "35/50 ≈ B40/50",
      espesorIntermedia: "5",
      capaRodadura: "AC 22 surf S",
      espesorRodadura: "3,5",
      clasificacion: "3 SF",
      seccionFirme: "E2",
      espesorTotal: "25",
      observaciones: "Reparación de deterioros en distintos puntos del tramo indicado, realizando tanto reparaciones estructurales como superficiales"
    },
    // A-7 - SUPERFICIAL 2018
    {
      unidad: "ALICANTE",
      provincia: "ALICANTE",
      sector: "A-1",
      via: "A-7",
      calzada: "1",
      carril: "1",
      pkInicial: "545,856",
      pkFinal: "549,700",
      anchoCalzada: "7",
      arcenDcho: "2,5",
      arcenIzqdo: "1",
      naturaleza: "INTERURBANO",
      nivelFreatico: "> 3 m",
      seccionTransversal: "Mixto (desmonte y terraplén)",
      fecha: "2018",
      tipoActuacion: "SUPERFICIAL",
      profundidad: "3",
      capaBase: "AC 22 bin S",
      liganteBase: "35/50 ≈ B40/50",
      espesorBase: "3,5",
      capaIntermedia: "BBTM",
      tipoMezclaIntermedia: "BBTM 11 B",
      liganteIntermedia: "PMB 45/80-60 ≈ BM-3b",
      espesorIntermedia: "6",
      capaRodadura: "BBTM",
      tipoMezcla: "BBTM 11 B",
      ligante: "PMB 45/80-60 ≈ BM-3b",
      espesor: "3",
      clasificacion: "3 SR",
      seccionFirme: "E2",
      espesorTotal: "30",
      observaciones: "Reparación de deterioros en distintos puntos del tramo indicado, realizando tanto reparaciones estructurales como superficiales"
    },
    // A-7 - ESTRUCTURAL 2018 (Carril 0)
    {
      unidad: "ALICANTE",
      provincia: "ALICANTE",
      sector: "A-1",
      via: "A-7",
      calzada: "1",
      carril: "0",
      pkInicial: "546,820",
      pkFinal: "553,030",
      anchoCalzada: "7",
      arcenDcho: "2,5",
      arcenIzqdo: "1",
      naturaleza: "INTERURBANO",
      nivelFreatico: "> 3 m",
      seccionTransversal: "Mixto (desmonte y terraplén)",
      fecha: "2018",
      tipoActuacion: "ESTRUCTURAL",
      profundidad: "9",
      capaBase: "AC 22 bin S",
      liganteBase: "35/50 ≈ B40/50",
      espesorBase: "3,5",
      capaIntermedia: "BBTM",
      tipoMezclaIntermedia: "BBTM 11 B",
      liganteIntermedia: "PMB 45/80-60 ≈ BM-3b",
      espesorIntermedia: "6",
      capaRodadura: "BBTM",
      tipoMezcla: "BBTM 11 B",
      ligante: "PMB 45/80-60 ≈ BM-3b",
      espesor: "3",
      clasificacion: "3 SR",
      seccionFirme: "E2",
      espesorTotal: "30",
      observaciones: "Reparación de deterioros en distintos puntos del tramo indicado, realizando tanto reparaciones estructurales como superficiales"
    },
    // A-7 - ESTRUCTURAL 2018 (Carril 1)
    {
      unidad: "ALICANTE",
      provincia: "ALICANTE",
      sector: "A-1",
      via: "A-7",
      calzada: "2",
      carril: "1",
      pkInicial: "553,030",
      pkFinal: "556,200",
      anchoCalzada: "7",
      arcenDcho: "2,5",
      arcenIzqdo: "1",
      naturaleza: "INTERURBANO",
      nivelFreatico: "> 3 m",
      seccionTransversal: "Mixto (desmonte y terraplén)",
      fecha: "2018",
      tipoActuacion: "ESTRUCTURAL",
      profundidad: "9",
      capaBase: "AC 22 bin S",
      liganteBase: "35/50 ≈ B40/50",
      espesorBase: "3,5",
      capaIntermedia: "BBTM",
      tipoMezclaIntermedia: "BBTM 11 B",
      liganteIntermedia: "PMB 45/80-60 ≈ BM-3b",
      espesorIntermedia: "6",
      capaRodadura: "BBTM",
      tipoMezcla: "BBTM 11 B",
      ligante: "PMB 45/80-60 ≈ BM-3b",
      espesor: "3",
      clasificacion: "3 SR",
      seccionFirme: "E2",
      espesorTotal: "30",
      observaciones: "Reparación de deterioros en distintos puntos del tramo indicado, realizando tanto reparaciones estructurales como superficiales"
    },
    // A-7 - ESTRUCTURAL 2018 (Carril 2)
    {
      unidad: "ALICANTE",
      provincia: "ALICANTE",
      sector: "A-1",
      via: "A-7",
      calzada: "2",
      carril: "2",
      pkInicial: "556,200",
      pkFinal: "559,500",
      anchoCalzada: "7",
      arcenDcho: "2,5",
      arcenIzqdo: "1",
      naturaleza: "INTERURBANO",
      nivelFreatico: "> 3 m",
      seccionTransversal: "Mixto (desmonte y terraplén)",
      fecha: "2018",
      tipoActuacion: "ESTRUCTURAL",
      profundidad: "9",
      capaBase: "AC 22 bin S",
      liganteBase: "35/50 ≈ B40/50",
      espesorBase: "3,5",
      capaIntermedia: "BBTM",
      tipoMezclaIntermedia: "BBTM 11 B",
      liganteIntermedia: "PMB 45/80-60 ≈ BM-3b",
      espesorIntermedia: "6",
      capaRodadura: "BBTM",
      tipoMezcla: "BBTM 11 B",
      ligante: "PMB 45/80-60 ≈ BM-3b",
      espesor: "3",
      clasificacion: "3 SR",
      seccionFirme: "E2",
      espesorTotal: "30",
      observaciones: "Reparación de deterioros en distintos puntos del tramo indicado, realizando tanto reparaciones estructurales como superficiales"
    }
  ];

  // Datos para gráficas
  const getChartData = () => {
    // Gráfica 1: Distribución por tipo de actuación
    const tipoActuacionData = actuacionesData.reduce((acc, item) => {
      const tipo = item.tipoActuacion;
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    // Asegurar orden específico: SUPERFICIAL primero (azul), ESTRUCTURAL segundo (verde)
    const tipoActuacionChart = [
      { tipo: 'SUPERFICIAL', cantidad: tipoActuacionData.SUPERFICIAL || 0 },
      { tipo: 'ESTRUCTURAL', cantidad: tipoActuacionData.ESTRUCTURAL || 0 }
    ].filter(item => item.cantidad > 0);

    // Gráfica 2: Actuaciones por año
    const actuacionesPorAno = actuacionesData.reduce((acc, item) => {
      const ano = item.fecha;
      acc[ano] = (acc[ano] || 0) + 1;
      return acc;
    }, {});

    const actuacionesPorAnoChart = Object.entries(actuacionesPorAno).map(([ano, count]) => ({
      año: ano,
      actuaciones: count
    }));

    // Gráfica 3: Distribución por vía
    const actuacionesPorVia = actuacionesData.reduce((acc, item) => {
      const via = item.via;
      acc[via] = (acc[via] || 0) + 1;
      return acc;
    }, {});

    const actuacionesPorViaChart = Object.entries(actuacionesPorVia).map(([via, count]) => ({
      vía: via,
      cantidad: count
    }));

    // Gráfica 4: Profundidad de fresado promedio por tipo
    const profundidadPorTipo = actuacionesData.reduce((acc, item) => {
      const tipo = item.tipoActuacion;
      if (!acc[tipo]) {
        acc[tipo] = { total: 0, count: 0 };
      }
      acc[tipo].total += parseInt(item.profundidad) || 0;
      acc[tipo].count += 1;
      return acc;
    }, {});

    const profundidadPromedioChart = Object.entries(profundidadPorTipo).map(([tipo, data]) => ({
      tipo,
      profundidadPromedio: (data.total / data.count).toFixed(1)
    }));

    return {
      tipoActuacionChart,
      actuacionesPorAnoChart,
      actuacionesPorViaChart,
      profundidadPromedioChart
    };
  };

  const chartData = getChartData();

  // Colores para las gráficas
  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Título general */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-700">
          Pre visualización de datos {fileName ? `- ${fileName}` : ''}
        </h2>
      </div>
      
      {/* Tabla de Actuaciones */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="h-[600px] overflow-y-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Provincia
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vía
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  PK Inicial
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  PK Final
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipo Actuación
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Profundidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Capa Rodadura
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Observaciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {actuacionesData.map((actuacion, index) => (
                <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {actuacion.provincia}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {actuacion.via}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {actuacion.pkInicial}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {actuacion.pkFinal}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {actuacion.fecha}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        actuacion.tipoActuacion === 'ESTRUCTURAL' 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                          : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {actuacion.tipoActuacion}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {actuacion.profundidad} cm
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {actuacion.capaRodadura}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {actuacion.observaciones}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sección de Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica 1: Distribución por tipo de actuación */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Distribución por Tipo de Actuación
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <style>
                {`
                  .recharts-pie-label-text {
                    fill: #6B7280 !important;
                    font-size: 12px !important;
                  }
                `}
              </style>
              <Pie
                data={chartData.tipoActuacionChart}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ tipo, cantidad, percent }) => `${tipo}: ${cantidad} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                dataKey="cantidad"
                labelStyle={{ fontSize: '12px', fill: '#6B7280' }}
              >
                {chartData.tipoActuacionChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica 2: Actuaciones por año */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Actuaciones por Año
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.actuacionesPorAnoChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="año" />
              <YAxis />
              <Bar dataKey="actuaciones">
                {chartData.actuacionesPorAnoChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ActuacionesTable;
