import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderPage from '../Components/HeaderPage';
import ViewerComponent from './BIM/ViewerComponent';
import BimLoadingBar from '../Components/BimLoadingBar';
import ActuacionesTable from '../Components/ActuacionesTable';
import P2RMTable from '../Components/P2RMTable';
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
  FaClipboardList,
  FaEye,
  FaTimes
} from 'react-icons/fa';

const Actuaciones = () => {
  const [activeTab, setActiveTab] = useState('ifc');
  const [uploadStatus, setUploadStatus] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [tempFiles, setTempFiles] = useState({});
  const [showViewer, setShowViewer] = useState(false);
  const [selectedGlobalId, setSelectedGlobalId] = useState(null);
  const [selectedNameBim, setSelectedNameBim] = useState(null);
  const [isBimLoading, setIsBimLoading] = useState(false);
  const [showActuacionesTable, setShowActuacionesTable] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  // Función para limpiar el visor BIM al cambiar de pestaña
  const handleTabChange = (tabId) => {
    // Si estamos saliendo de la pestaña IFC, limpiar el visor
    if (activeTab === 'ifc' && tabId !== 'ifc') {
      setShowViewer(false);
      setSelectedGlobalId(null);
      setSelectedNameBim(null);
      setIsBimLoading(false);
    }
    
    // Si estamos saliendo de la pestaña Microsoft 365, limpiar el visualizador
    if (activeTab === 'microsoft365' && tabId !== 'microsoft365') {
      setShowActuacionesTable(false);
      setSelectedFileName('');
    }
    
    setActiveTab(tabId);
  };

  // Datos mock para el historial
  const mockHistory = {
    ifc: [
      { id: 1, name: 'Modelo_estructura_vial.ifc', size: '2.4 MB', date: '2024-01-15', status: 'success' },
      { id: 2, name: 'Puente_principal.ifc', size: '5.1 MB', date: '2024-01-12', status: 'success' },
      { id: 3, name: 'Tunel_acceso.ifc', size: '3.8 MB', date: '2024-01-10', status: 'success' }
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
      { id: 3, name: 'Memoria_Proyecto.pdf', size: '1.8 MB', date: '2024-01-14', status: 'success' }
    ],
    plantilla: [
      { id: 1, name: 'Plantilla_Inspeccion_Firmes.docx', size: '2.1 MB', date: '2024-01-16', status: 'success' },
      { id: 2, name: 'Formulario_Estado_Vial.xlsx', size: '1.5 MB', date: '2024-01-15', status: 'success' },
      { id: 3, name: 'Informe_Mantenimiento_Preventivo.pdf', size: '3.2 MB', date: '2024-01-14', status: 'success' }
    ]
  };

  const tabs = [
    { id: 'ifc', name: 'Archivos IFC', icon: FaFile, description: 'Modelos BIM y archivos IFC' },
    { id: 'microsoft365', name: 'Microsoft 365', icon: FaMicrosoft, description: 'Word, Excel y PowerPoint' },
    { id: 'data', name: 'Data', icon: FaTable, description: 'CSV, JSON, XML y otros formatos de datos' },
    { id: 'informes', name: 'Documentación técnica', icon: FaFileAlt, description: 'Informes, planos y memorias técnicas' },
  //   { id: 'plantilla', name: 'Plantilla de carga de datos', icon: FaClipboardList, description: 'Configurar plantillas y subir informes personalizados' }
 ];

  const handleBimLoadingChange = (loading) => {
    setIsBimLoading(loading);
  };

  const loadActuacionesData = (fileName = '') => {
    // Simular carga de datos de actuaciones
    setTimeout(() => {
      setSelectedFileName(fileName);
      setShowActuacionesTable(true);
    }, 500);
  };

  // Función para determinar qué tabla mostrar según el nombre del archivo
  const getTableComponent = () => {
    if (!selectedFileName) return null;
    
    const fileName = selectedFileName.toLowerCase();
    
    if (fileName.includes('p-2_rm') || fileName.includes('p2_rm')) {
      return <P2RMTable fileName={selectedFileName} />;
    } else if (fileName.includes('a-1_rm') || fileName.includes('a1_rm')) {
      return <ActuacionesTable fileName={selectedFileName} />;
    } else {
      // Por defecto mostrar la tabla A-1 RM
      return <ActuacionesTable fileName={selectedFileName} />;
    }
  };

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
          
          // Si es la pestaña IFC, mostrar el viewer después de un delay
          if (tabId === 'ifc') {
            setTimeout(() => {
              setIsBimLoading(true);
              setShowViewer(true);
            }, 1500);
          }
          
          // Si es la pestaña Microsoft 365, cargar datos de actuaciones
          if (tabId === 'microsoft365') {
            setTimeout(() => {
              // Obtener el nombre del primer archivo cargado
              const fileName = files.length > 0 ? files[0].name : '';
              loadActuacionesData(fileName);
            }, 1500);
          }
          
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
    return 'text-gray-600';
  };

  const getStatusIconColor = (status) => {
    return 'bg-green-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Barra de progreso para carga de modelos BIM */}
      <BimLoadingBar isLoading={isBimLoading} />
      
      {/* Header usando componente reutilizable */}
      <HeaderPage 
        title="Carga de datos"
        showBackButton={true}
        backPath="/"
        backText="Volver"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6">
        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-wrap border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
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
                  {/* Layout vertical para pestaña IFC */}
                  {tab.id === 'ifc' ? (
                    <div className="space-y-6 mb-8">
                      {/* Área de carga */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-sky-400 transition-colors duration-200">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                            <Icon className="text-2xl text-sky-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Visualizador BIM
                          </h3>
                          <p className="text-gray-600 mb-6 max-w-md">
                            Selecciona un archivo IFC para visualizar el modelo 3D
                          </p>
                          
                          {isUploading ? (
                            <div className="w-full max-w-md">
                              <div className="flex items-center justify-center gap-3 text-sky-600 mb-3">
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
                              <span>¡Archivo cargado correctamente!</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleFileSelect(tab.id)}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors duration-200"
                            >
                              <FaUpload />
                              Seleccionar archivo IFC
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Visualizador */}
                      {showViewer && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <FaEye className="text-sky-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Modelo 3D</h3>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4 h-[500px]">
                            <ViewerComponent 
                              setSelectedGlobalId={setSelectedGlobalId}
                              setSelectedNameBim={setSelectedNameBim}
                              onLoadingChange={handleBimLoadingChange}
                            />
                          </div>
                          
                          {(selectedGlobalId || selectedNameBim) && (
                            <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-lg">
                              <h4 className="font-medium text-sky-800 mb-2">Elemento seleccionado:</h4>
                              <div className="text-sm text-sky-700">
                                {selectedNameBim && <p><strong>Nombre:</strong> {selectedNameBim}</p>}
                                {selectedGlobalId && <p><strong>Global ID:</strong> {selectedGlobalId}</p>}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : tab.id === 'microsoft365' ? (
                    /* Layout vertical para pestaña Microsoft 365 */
                    <div className="space-y-6 mb-8">
                      {/* Área de carga */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-sky-400 transition-colors duration-200">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                            <Icon className="text-2xl text-sky-600" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Visualizador de Datos
                          </h3>
                          <p className="text-gray-600 mb-6 max-w-md">
                            Selecciona un archivo Excel para visualizar datos de inspección
                          </p>
                          
                          {isUploading ? (
                            <div className="w-full max-w-md">
                              <div className="flex items-center justify-center gap-3 text-sky-600 mb-3">
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
                              <span>¡Archivo cargado correctamente!</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleFileSelect(tab.id)}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors duration-200"
                            >
                              <FaUpload />
                              Seleccionar archivo Excel
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Visualizador de datos */}
                      {showActuacionesTable && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                          {getTableComponent()}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Layout original para otras pestañas */
                  <div className="mb-8">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-sky-400 transition-colors duration-200">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                          <Icon className="text-2xl text-sky-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Cargar archivos
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
                            Seleccionar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  )}

                  {/* Plantilla Configuration Section - Solo para la pestaña plantilla */}
                  {tab.id === 'plantilla' && (
                    <div className="mb-8">
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <FaClipboardList className="text-sky-600" />
                          <h3 className="text-lg font-semibold text-gray-800">Configurar Plantilla</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                          Personaliza tu formulario de carga de datos según tus necesidades específicas.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Nombre de la plantilla
                            </label>
                            <input
                              type="text"
                              placeholder="Ej: Inspección de Firmes"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Tipo de informe
                            </label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500">
                              <option>Inspección de firmes</option>
                              <option>Mantenimiento preventivo</option>
                              <option>Estado de vías</option>
                              <option>Mediciones técnicas</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-800">Campos del formulario</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                              <span className="text-sm text-gray-700">Fecha de inspección</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                              <span className="text-sm text-gray-700">Ubicación (PK)</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                              <span className="text-sm text-gray-700">Estado del firme</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input type="checkbox" className="rounded border-gray-300" />
                              <span className="text-sm text-gray-700">Temperatura ambiente</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input type="checkbox" className="rounded border-gray-300" />
                              <span className="text-sm text-gray-700">Humedad relativa</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <input type="checkbox" className="rounded border-gray-300" />
                              <span className="text-sm text-gray-700">Observaciones</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                          <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancelar
                          </button>
                          <button className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors">
                            Guardar plantilla
                          </button>
                        </div>
                      </div>
                    </div>
                  )}


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
                          <div className="flex items-center gap-3">
                            {/* Botón de visualizar solo para archivos IFC */}
                            {tab.id === 'ifc' && (
                              <button
                                onClick={() => setShowViewer(true)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors"
                              >
                                <FaEye />
                                Visualizar
                              </button>
                            )}
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-700 rounded-full"></div>
                              <span className="text-xs text-gray-600">Completado</span>
                            </div>
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
                          <div className="flex items-center gap-3">
                            {/* Botón de visualizar solo para archivos IFC */}
                            {tab.id === 'ifc' && (
                              <button
                                onClick={() => setShowViewer(true)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors"
                              >
                                <FaEye />
                                Visualizar
                              </button>
                            )}
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusIconColor(file.status)}`}></div>
                              <span className={`text-xs ${getStatusColor(file.status)}`}>
                                Completado
                              </span>
                            </div>
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
