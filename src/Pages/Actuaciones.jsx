import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFile, 
  FaDatabase, 
  FaMicrosoft, 
  FaHistory, 
  FaUpload, 
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
  FaTable,
  FaCloud,
  FaServer,
  FaArrowLeft
} from 'react-icons/fa';

const Actuaciones = () => {
  const [activeTab, setActiveTab] = useState('ifc');
  const [uploadStatus, setUploadStatus] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [tempFiles, setTempFiles] = useState({});

  // Datos mock para el historial
  const mockHistory = {
    ifc: [
      { id: 1, name: 'Modelo_estructura_vial.ifc', size: '2.4 MB', date: '2024-01-15', status: 'success' },
      { id: 2, name: 'Puente_principal.ifc', size: '5.1 MB', date: '2024-01-12', status: 'success' },
      { id: 3, name: 'Tunel_acceso.ifc', size: '3.8 MB', date: '2024-01-10', status: 'error' }
    ],
    microsoft365: [
      { id: 1, name: 'Informe_estado_red.docx', size: '1.5 MB', date: '2024-01-16', status: 'success' },
      { id: 2, name: 'Presentacion_reunion.pptx', size: '4.2 MB', date: '2024-01-15', status: 'success' },
      { id: 3, name: 'Planificacion_obras.xlsx', size: '2.8 MB', date: '2024-01-14', status: 'success' }
    ],
    data: [
      { id: 1, name: 'datos_trafico_2024.csv', size: '1.2 MB', date: '2024-01-14', status: 'success' },
      { id: 2, name: 'sensores_firmes.json', size: '856 KB', date: '2024-01-13', status: 'success' },
      { id: 3, name: 'exportacion_mediciones.xml', size: '2.1 MB', date: '2024-01-11', status: 'success' }
    ],
    informes: [
      { id: 1, name: 'Informe_Técnico_Q1.pdf', size: '4.2 MB', date: '2024-01-16', status: 'success' },
      { id: 2, name: 'Plano_General_v2.dwg', size: '8.7 MB', date: '2024-01-15', status: 'success' },
      { id: 3, name: 'Memoria_Proyecto.pdf', size: '1.8 MB', date: '2024-01-14', status: 'error' }
    ]
  };

  const tabs = [
    { id: 'ifc', name: 'Archivos IFC', icon: FaFile, description: 'Modelos BIM y archivos IFC' },
    { id: 'microsoft365', name: 'Microsoft 365', icon: FaMicrosoft, description: 'Word, Excel y PowerPoint' },
    { id: 'data', name: 'Data', icon: FaTable, description: 'CSV, JSON, XML y otros formatos de datos' },
    { id: 'informes', name: 'Documentación técnica', icon: FaFileAlt, description: 'Informes, planos y memorias técnicas' }
  ];

  const handleFileSelect = (tabId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    
    // Configurar tipos de archivo según la pestaña
    switch (tabId) {
      case 'ifc':
        input.accept = '.ifc,.IFC';
        break;
      case 'microsoft365':
        input.accept = '.docx,.xlsx,.pptx,.doc,.xls,.ppt';
        break;
      case 'data':
        input.accept = '.csv,.json,.xml,.xlsx,.xls,.txt';
        break;
      case 'informes':
        input.accept = '.pdf,.dwg,.dxf,.doc,.docx';
        break;
      default:
        input.accept = '*';
    }
    
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length > 0) {
        handleFileUpload(tabId, files);
      }
    };
    
    input.click();
  };

  const handleFileUpload = (tabId, files) => {
    setUploadStatus({ ...uploadStatus, [tabId]: 'uploading' });
    setUploadProgress({ ...uploadProgress, [tabId]: 0 });
    
    // Simular progreso de upload
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[tabId] || 0;
        const newProgress = Math.min(currentProgress + Math.random() * 15, 100);
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          // Agregar archivos a la lista temporal
          const newFiles = files.map((file, index) => ({
            id: Date.now() + index,
            name: file.name,
            size: formatFileSize(file.size),
            date: new Date().toISOString().split('T')[0],
            status: 'success',
            isNew: true
          }));
          
          setTempFiles(prev => ({
            ...prev,
            [tabId]: [...(prev[tabId] || []), ...newFiles]
          }));
          
          setUploadStatus({ ...uploadStatus, [tabId]: 'success' });
          setTimeout(() => {
            setUploadStatus(prev => ({ ...prev, [tabId]: null }));
            setUploadProgress(prev => ({ ...prev, [tabId]: 0 }));
          }, 3000);
        }
        
        return { ...prev, [tabId]: newProgress };
      });
    }, 200);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header moderno */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center justify-between pb-4 border-b-2 border-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-gradient-to-b from-sky-600 to-sky-700 rounded-full"></div>
              <h1 className="text-base font-semibold text-gray-600">Carga de Datos</h1>
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
        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="text-lg" />
                  <div className="text-left">
                    <div>{tab.name}</div>
                    <div className="text-xs text-gray-500 font-normal">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isUploading = uploadStatus[tab.id] === 'uploading';
              const isSuccess = uploadStatus[tab.id] === 'success';

              return (
                <div key={tab.id} className={isActive ? 'block' : 'hidden'}>
                  {/* Upload Area */}
                  <div className="mb-8">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-sky-400 transition-colors duration-200">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                          <Icon className="text-2xl text-sky-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Cargar {tab.name}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                          Arrastra y suelta tus archivos aquí o haz clic para seleccionar
                        </p>
                        
                        {isUploading ? (
                          <div className="w-full max-w-md">
                            <div className="flex items-center gap-3 text-sky-600 mb-3">
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-600"></div>
                              <span>Subiendo archivos...</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress[tab.id] || 0}%` }}
                              ></div>
                            </div>
                            <div className="text-sm text-gray-600 mt-2 text-center">
                              {Math.round(uploadProgress[tab.id] || 0)}% completado
                            </div>
                          </div>
                        ) : isSuccess ? (
                          <div className="flex items-center gap-3 text-green-600">
                            <FaCheckCircle className="text-xl" />
                            <span>¡Archivos subidos correctamente!</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleFileSelect(tab.id)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors duration-200"
                          >
                            <FaUpload />
                            Seleccionar archivos
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* History Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <FaHistory className="text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Historial de archivos</h3>
                    </div>

                    <div className="space-y-3">
                      {/* Archivos temporales (nuevos) */}
                      {tempFiles[tab.id]?.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:shadow-sm transition-shadow duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Icon className="text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                                {file.name}
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  Nuevo
                                </span>
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{file.size}</span>
                                <span>{file.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-green-200 bg-green-100 text-green-800">
                            {getStatusIcon(file.status)}
                            Completado
                          </div>
                        </div>
                      ))}
                      {/* Archivos mock (historial) */}
                      {mockHistory[tab.id].map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Icon className="text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">{file.name}</h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{file.size}</span>
                                <span>{file.date}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(file.status)}`}>
                            {getStatusIcon(file.status)}
                            {file.status === 'success' ? 'Completado' : file.status === 'error' ? 'Error' : 'Pendiente'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <FaFile className="text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Archivos IFC</h3>
            </div>
            <p className="text-sm text-gray-600">
              Modelos BIM y archivos de construcción para análisis estructural
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <FaMicrosoft className="text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Microsoft 365</h3>
            </div>
            <p className="text-sm text-gray-600">
              Documentos, presentaciones y hojas de cálculo desde la nube
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <FaTable className="text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Data</h3>
            </div>
            <p className="text-sm text-gray-600">
              CSV, JSON, XML y otros formatos de datos estructurados
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <FaFileAlt className="text-sky-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Documentación técnica</h3>
            </div>
            <p className="text-sm text-gray-600">
              Informes, planos DWG y memorias técnicas de proyectos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Actuaciones;
