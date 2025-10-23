import React from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const P2RMTable = ({ fileName = '' }) => {
  // Datos expandidos basados en la tabla P-2_RM proporcionada
  const p2rmData = [
    // PALENCIA - A-67
    { unidad: "1", provincia: "PALENCIA", sector: "P-2", via: "A-67", calzada: "1", carril: "1", pkInicial: "3,35", pkFinal: "4,05", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "Carriles y arcenes", fechaActuacion: "11/08/2014", tipoActuacion: "SUPERFICIAL", profundidadFresado: "0", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "3 SR", observacionesGenerales: "Rectificación de ondulaciones en pavimento" },
    { unidad: "2", provincia: "PALENCIA", sector: "P-2", via: "A-67", calzada: "1", carril: "2", pkInicial: "1,6", pkFinal: "6", anchoCalzada: "5", arcenDcho: "0", arcenIzqdo: "0,2", naturaleza: "ZONA INDUSTRIAL", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "3er carril", fechaActuacion: "05/10/2017", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "6", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "AC 16 surt S", tipoMezclaRodadura: "Otros", liganteRodadura: "50/70 - B80/70", espesorRodadura: "6", clasificacion: "6 F", observacionesGenerales: "Andenes Partidos" },
    { unidad: "3", provincia: "PALENCIA", sector: "P-2", via: "A-67", calzada: "2", carril: "1", pkInicial: "7,2", pkFinal: "8,1", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "INTERURBANO", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "", fechaActuacion: "15/03/2016", tipoActuacion: "SUPERFICIAL", profundidadFresado: "0", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "3 SR", observacionesGenerales: "Mantenimiento superficial" },
    { unidad: "4", provincia: "PALENCIA", sector: "P-2", via: "A-67", calzada: "2", carril: "2", pkInicial: "8,1", pkFinal: "9,5", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "INTERURBANO", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "", fechaActuacion: "15/03/2016", tipoActuacion: "SUPERFICIAL", profundidadFresado: "0", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "3 SR", observacionesGenerales: "Mantenimiento superficial" },
    
    // VALLADOLID - A-65
    { unidad: "5", provincia: "VALLADOLID", sector: "P-2", via: "A-65", calzada: "1", carril: "3", pkInicial: "80,1", pkFinal: "80,55", anchoCalzada: "1,5", arcenDcho: "0,2", arcenIzqdo: "0,2", naturaleza: "INTERURBANO", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "", fechaActuacion: "01/06/2014", tipoActuacion: "SUPERFICIAL", profundidadFresado: "7", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "AC 16 surt S Silíceo", tipoMezclaRodadura: "AC 16 surt S Silíceo", liganteRodadura: "50/70 - B80/70", espesorRodadura: "17", clasificacion: "17 SR", observacionesGenerales: "Recrecido 35cm de calzada por ser zona inundable" },
    { unidad: "6", provincia: "VALLADOLID", sector: "P-2", via: "A-65", calzada: "1", carril: "1", pkInicial: "81,2", pkFinal: "82,8", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "22/09/2015", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "8", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural completa" },
    { unidad: "7", provincia: "VALLADOLID", sector: "P-2", via: "A-65", calzada: "1", carril: "2", pkInicial: "82,8", pkFinal: "84,3", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "22/09/2015", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "8", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural completa" },
    
    // PALENCIA - N-622
    { unidad: "8", provincia: "PALENCIA", sector: "P-2", via: "N-622", calzada: "1", carril: "7", pkInicial: "100,87", pkFinal: "107,57", anchoCalzada: "10,5", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "15/03/2016", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "8", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural completa del tramo" },
    { unidad: "9", provincia: "PALENCIA", sector: "P-2", via: "N-622", calzada: "1", carril: "1", pkInicial: "108,2", pkFinal: "110,5", anchoCalzada: "10,5", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "15/03/2016", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "8", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural completa del tramo" },
    { unidad: "10", provincia: "PALENCIA", sector: "P-2", via: "N-622", calzada: "1", carril: "2", pkInicial: "110,5", pkFinal: "112,8", anchoCalzada: "10,5", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "15/03/2016", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "8", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural completa del tramo" },
    
    // VALLADOLID - A-62
    { unidad: "11", provincia: "VALLADOLID", sector: "P-2", via: "A-62", calzada: "1", carril: "1", pkInicial: "112", pkFinal: "112,2", anchoCalzada: "6", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "INTERURBANO", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "", fechaActuacion: "22/09/2015", tipoActuacion: "SUPERFICIAL", profundidadFresado: "0", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "5 F", observacionesGenerales: "Mantenimiento preventivo de superficie" },
    { unidad: "12", provincia: "VALLADOLID", sector: "P-2", via: "A-62", calzada: "1", carril: "2", pkInicial: "112,2", pkFinal: "113,5", anchoCalzada: "6", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "INTERURBANO", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "", fechaActuacion: "22/09/2015", tipoActuacion: "SUPERFICIAL", profundidadFresado: "0", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "5 F", observacionesGenerales: "Mantenimiento preventivo de superficie" },
    { unidad: "13", provincia: "VALLADOLID", sector: "P-2", via: "A-62", calzada: "2", carril: "1", pkInicial: "113,5", pkFinal: "115,2", anchoCalzada: "6", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "INTERURBANO", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "", fechaActuacion: "22/09/2015", tipoActuacion: "SUPERFICIAL", profundidadFresado: "0", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "5 F", observacionesGenerales: "Mantenimiento preventivo de superficie" },
    { unidad: "14", provincia: "VALLADOLID", sector: "P-2", via: "A-62", calzada: "2", carril: "2", pkInicial: "115,2", pkFinal: "117,8", anchoCalzada: "6", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "INTERURBANO", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "", fechaActuacion: "22/09/2015", tipoActuacion: "SUPERFICIAL", profundidadFresado: "0", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "5 F", observacionesGenerales: "Mantenimiento preventivo de superficie" },
    
    // Más tramos de PALENCIA - A-67
    { unidad: "15", provincia: "PALENCIA", sector: "P-2", via: "A-67", calzada: "1", carril: "1", pkInicial: "10,2", pkFinal: "11,8", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "", fechaActuacion: "18/04/2016", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "7", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural por deterioro" },
    { unidad: "16", provincia: "PALENCIA", sector: "P-2", via: "A-67", calzada: "1", carril: "2", pkInicial: "11,8", pkFinal: "13,2", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "", fechaActuacion: "18/04/2016", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "7", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural por deterioro" },
    { unidad: "17", provincia: "PALENCIA", sector: "P-2", via: "A-67", calzada: "2", carril: "1", pkInicial: "13,2", pkFinal: "14,8", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "", fechaActuacion: "18/04/2016", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "7", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural por deterioro" },
    { unidad: "18", provincia: "PALENCIA", sector: "P-2", via: "A-67", calzada: "2", carril: "2", pkInicial: "14,8", pkFinal: "16,5", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Terraplén < 2 m", observaciones: "", fechaActuacion: "18/04/2016", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "7", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural por deterioro" },
    
    // Más tramos de VALLADOLID - A-65
    { unidad: "19", provincia: "VALLADOLID", sector: "P-2", via: "A-65", calzada: "1", carril: "1", pkInicial: "85,1", pkFinal: "86,8", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "12/07/2014", tipoActuacion: "SUPERFICIAL", profundidadFresado: "0", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "3 SR", observacionesGenerales: "Mantenimiento superficial preventivo" },
    { unidad: "20", provincia: "VALLADOLID", sector: "P-2", via: "A-65", calzada: "1", carril: "2", pkInicial: "86,8", pkFinal: "88,5", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "12/07/2014", tipoActuacion: "SUPERFICIAL", profundidadFresado: "0", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "3 SR", observacionesGenerales: "Mantenimiento superficial preventivo" },
    { unidad: "21", provincia: "VALLADOLID", sector: "P-2", via: "A-65", calzada: "2", carril: "1", pkInicial: "88,5", pkFinal: "90,2", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "12/07/2014", tipoActuacion: "SUPERFICIAL", profundidadFresado: "0", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "3 SR", observacionesGenerales: "Mantenimiento superficial preventivo" },
    { unidad: "22", provincia: "VALLADOLID", sector: "P-2", via: "A-65", calzada: "2", carril: "2", pkInicial: "90,2", pkFinal: "92,1", anchoCalzada: "7", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "12/07/2014", tipoActuacion: "SUPERFICIAL", profundidadFresado: "0", capaIntermedia: "AC", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "6", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "3 SR", observacionesGenerales: "Mantenimiento superficial preventivo" },
    
    // Más tramos de PALENCIA - N-622
    { unidad: "23", provincia: "PALENCIA", sector: "P-2", via: "N-622", calzada: "1", carril: "3", pkInicial: "112,8", pkFinal: "115,2", anchoCalzada: "10,5", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "08/11/2017", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "9", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural por fallos en firme" },
    { unidad: "24", provincia: "PALENCIA", sector: "P-2", via: "N-622", calzada: "1", carril: "4", pkInicial: "115,2", pkFinal: "117,8", anchoCalzada: "10,5", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "08/11/2017", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "9", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural por fallos en firme" },
    { unidad: "25", provincia: "PALENCIA", sector: "P-2", via: "N-622", calzada: "2", carril: "1", pkInicial: "117,8", pkFinal: "120,5", anchoCalzada: "10,5", arcenDcho: "2,5", arcenIzqdo: "1", naturaleza: "VARIANTE", nivelFreatico: "de 2 a 3 m", seccionTransversal: "Mixto (desmonte y terraplén)", observaciones: "", fechaActuacion: "08/11/2017", tipoActuacion: "ESTRUCTURAL", profundidadFresado: "9", capaIntermedia: "BBTM", tipoMezclaIntermedia: "AC 22 bin S", liganteIntermedia: "50/70 - B80/70", espesorIntermedia: "7", capaRodadura: "BBTM 11", tipoMezclaRodadura: "BBTM 11 B", liganteRodadura: "PMB 45/80-65 - BM-3c", espesorRodadura: "3", clasificacion: "BR", observacionesGenerales: "Reparación estructural por fallos en firme" }
  ];

  // Datos para gráficas
  const getChartData = () => {
    // Gráfica 1: Distribución por tipo de actuación
    const tipoActuacionData = p2rmData.reduce((acc, item) => {
      const tipo = item.tipoActuacion;
      acc[tipo] = (acc[tipo] || 0) + 1;
      return acc;
    }, {});

    // Asegurar orden específico: SUPERFICIAL primero (azul), ESTRUCTURAL segundo (verde)
    const tipoActuacionChart = [
      { tipo: 'SUPERFICIAL', cantidad: tipoActuacionData.SUPERFICIAL || 0 },
      { tipo: 'ESTRUCTURAL', cantidad: tipoActuacionData.ESTRUCTURAL || 0 }
    ].filter(item => item.cantidad > 0);

    // Gráfica 2: Actuaciones por provincia
    const actuacionesPorProvincia = p2rmData.reduce((acc, item) => {
      const provincia = item.provincia;
      acc[provincia] = (acc[provincia] || 0) + 1;
      return acc;
    }, {});

    const actuacionesPorProvinciaChart = Object.entries(actuacionesPorProvincia).map(([provincia, count]) => ({
      provincia,
      cantidad: count
    }));

    // Gráfica 3: Distribución por vía
    const actuacionesPorVia = p2rmData.reduce((acc, item) => {
      const via = item.via;
      acc[via] = (acc[via] || 0) + 1;
      return acc;
    }, {});

    const actuacionesPorViaChart = Object.entries(actuacionesPorVia).map(([via, count]) => ({
      vía: via,
      cantidad: count
    }));

    // Gráfica 4: Profundidad de fresado promedio por tipo
    const profundidadPorTipo = p2rmData.reduce((acc, item) => {
      const tipo = item.tipoActuacion;
      if (!acc[tipo]) {
        acc[tipo] = { total: 0, count: 0 };
      }
      acc[tipo].total += parseInt(item.profundidadFresado) || 0;
      acc[tipo].count += 1;
      return acc;
    }, {});

    const profundidadPromedioChart = Object.entries(profundidadPorTipo).map(([tipo, data]) => ({
      tipo,
      profundidadPromedio: (data.total / data.count).toFixed(1)
    }));

    // Gráfica 5: Clasificación del firme
    const clasificacionData = p2rmData.reduce((acc, item) => {
      const clasificacion = item.clasificacion;
      acc[clasificacion] = (acc[clasificacion] || 0) + 1;
      return acc;
    }, {});

    const clasificacionChart = Object.entries(clasificacionData).map(([clasificacion, count]) => ({
      clasificacion,
      cantidad: count
    }));

    return {
      tipoActuacionChart,
      actuacionesPorProvinciaChart,
      actuacionesPorViaChart,
      profundidadPromedioChart,
      clasificacionChart
    };
  };

  const chartData = getChartData();

  // Colores para las gráficas
  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899', '#84CC16'];

  return (
    <div className="space-y-6">
      {/* Título general */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-700">
          Pre visualización de datos {fileName ? `- ${fileName}` : ''}
        </h2>
      </div>
      
      {/* Tabla P-2_RM */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="h-[600px] overflow-y-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Provincia
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vía
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  PK Inicial
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  PK Final
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha Actuación
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipo Actuación
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Prof. Fresado
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Capa Intermedia
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Capa Rodadura
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Clasificación
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {p2rmData.map((item, index) => (
                <tr key={index} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.provincia}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    {item.via}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    {item.pkInicial}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    {item.pkFinal}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    {item.fechaActuacion}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        item.tipoActuacion === 'ESTRUCTURAL' 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                          : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {item.tipoActuacion}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    {item.profundidadFresado} cm
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    {item.capaIntermedia}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    {item.capaRodadura}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-semibold shadow-sm ${
                        item.clasificacion.includes('SR') 
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200'
                          : item.clasificacion.includes('F')
                          ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200'
                          : 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200'
                      }`}
                    >
                      {item.clasificacion}
                    </span>
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

        {/* Gráfica 2: Actuaciones por provincia */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Actuaciones por Provincia
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.actuacionesPorProvinciaChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="provincia" />
              <YAxis />
              <Bar dataKey="cantidad">
                {chartData.actuacionesPorProvinciaChart.map((entry, index) => (
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

export default P2RMTable;
