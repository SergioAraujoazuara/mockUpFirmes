import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown, FaMapMarkerAlt, FaRoad, FaCog } from "react-icons/fa";

const IndicadoresIframe = () => {
  const iframeRef = useRef(null);
  const [selectedIndicator, setSelectedIndicator] = useState('Índice General');
  const [selectedProvince, setSelectedProvince] = useState('Todas las provincias');
  const [selectedRoad, setSelectedRoad] = useState('Todas las carreteras');
  const [showInteroperability, setShowInteroperability] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [debugCoords, setDebugCoords] = useState({ x: 150, y: 50 });

  const indicators = [
    'Índice General',
    'Índice Seguridad', 
    'Índice Confort',
    'Índice Estructural'
  ];

  const provinces = [
    'Todas las provincias',
    'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz',
    'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real',
    'Córdoba', 'Cuenca', 'Girona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva',
    'Huesca', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lleida',
    'Lugo', 'Madrid', 'Málaga', 'Murcia', 'Navarra', 'Ourense', 'Palencia',
    'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla',
    'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya',
    'Zamora', 'Zaragoza'
  ];

  // Mapeo de coordenadas aproximadas para controles del iframe
  const iframeControlCoordinates = {
    indicatorDropdown: { x: 150, y: 50 },
    indicatorButton: { x: 150, y: 120 },
    provinceDropdown: { x: 350, y: 50 },
    provinceButton: { x: 350, y: 120 },
    roadDropdown: { x: 550, y: 50 },
    roadButton: { x: 550, y: 120 }
  };

  // Función para simular clics dentro del iframe
  const simulateClickInIframe = (x, y, controlName) => {
    if (!iframeRef.current) return;
    
    console.log(`🖱️ Simulando clic en "${controlName}" en coordenadas (${x}, ${y})`);
    console.log('⚠️ CORS está bloqueando el acceso directo al iframe');
    console.log('📨 Enviando mensaje PostMessage como alternativa...');
    
    try {
      const iframe = iframeRef.current;
      const iframeWindow = iframe.contentWindow;
      
      // Como CORS bloquea el acceso directo, solo enviamos mensajes PostMessage
      iframeWindow.postMessage({
        type: 'SIMULATE_CLICK',
        source: 'external_panel',
        data: {
          x: x,
          y: y,
          control: controlName,
          timestamp: Date.now()
        }
      }, '*');
      
      console.log('✅ Mensaje de simulación de clic enviado al iframe');
      
    } catch (error) {
      console.log('❌ Error al enviar mensaje:', error);
    }
  };

  // Función para comunicar cambios al iframe usando múltiples estrategias
  const updateIframeFilters = () => {
    if (iframeRef.current) {
      try {
        const iframe = iframeRef.current;
        
        // ESTRATEGIA 1: PostMessage con múltiples formatos
        const messages = [
          // Formato estructurado
          {
            type: 'FILTER_UPDATE',
            source: 'external_panel',
            data: {
              indicator: selectedIndicator,
              province: selectedProvince,
              road: selectedRoad,
              interoperability: showInteroperability,
              timestamp: Date.now()
            }
          },
          // Formato simple
          {
            action: 'updateFilters',
            indicator: selectedIndicator,
            province: selectedProvince,
            road: selectedRoad
          },
          // Formato compatible con ArcGIS
          {
            type: 'esriWebMap',
            filter: {
              indicator: selectedIndicator,
              province: selectedProvince,
              road: selectedRoad
            }
          }
        ];
        
        // Enviar todos los formatos de mensaje
        messages.forEach((message, index) => {
          iframe.contentWindow.postMessage(message, 'http://212.128.194.13');
          iframe.contentWindow.postMessage(message, '*');
        });
        
        console.log('🎯 Múltiples formatos de mensaje enviados al iframe');
        
      } catch (error) {
        console.log('❌ Error al comunicar con el iframe:', error);
      }
    }
  };

  // Función específica para cambiar índice
  const handleChangeIndex = () => {
    console.log('🎯 Botón "Cambiar Índice" presionado');
    console.log('📊 Indicador seleccionado:', selectedIndicator);
    
    // Enviar mensaje específico para cambiar índice
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const changeIndexMessage = {
        type: 'CHANGE_INDEX',
        source: 'external_panel',
        data: {
          indicator: selectedIndicator,
          action: 'change_index',
          timestamp: Date.now()
        }
      };
      
      // Enviar mensaje al iframe
      iframe.contentWindow.postMessage(changeIndexMessage, 'http://212.128.194.13');
      iframe.contentWindow.postMessage(changeIndexMessage, '*');
      console.log('🔄 Mensaje de cambio de índice enviado:', changeIndexMessage);
      
      // ESTRATEGIA ADICIONAL: Simular clics en los controles del iframe
      console.log('🎯 Intentando simular clics en controles internos del iframe...');
      
      // Simular clic en el dropdown de indicadores
      setTimeout(() => {
        simulateClickInIframe(
          iframeControlCoordinates.indicatorDropdown.x,
          iframeControlCoordinates.indicatorDropdown.y,
          'dropdown de indicadores'
        );
      }, 100);
      
      // Simular clic en el botón de cambiar índice
      setTimeout(() => {
        simulateClickInIframe(
          iframeControlCoordinates.indicatorButton.x,
          iframeControlCoordinates.indicatorButton.y,
          'botón cambiar índice'
        );
      }, 500);
    }
    
    // Actualizar el iframe con todos los filtros
    updateIframeFilters();
    
    // Mostrar feedback visual en el botón externo
    const externalButton = document.querySelector('button[onclick*="handleChangeIndex"]');
    if (externalButton) {
      externalButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      externalButton.textContent = '✅ Índice Cambiado';
      setTimeout(() => {
        externalButton.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
        externalButton.textContent = 'Cambiar Índice';
      }, 2000);
    }
  };

  // Función específica para cambiar provincia
  const handleChangeProvince = () => {
    console.log('🎯 Botón "Actualizar Provincia" presionado');
    console.log('📍 Provincia seleccionada:', selectedProvince);
    
    // Enviar mensaje específico para cambiar provincia
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const changeProvinceMessage = {
        type: 'CHANGE_PROVINCE',
        source: 'external_panel',
        data: {
          province: selectedProvince,
          action: 'change_province',
          timestamp: Date.now()
        }
      };
      
      // Enviar mensaje al iframe
      iframe.contentWindow.postMessage(changeProvinceMessage, 'http://212.128.194.13');
      iframe.contentWindow.postMessage(changeProvinceMessage, '*');
      console.log('🔄 Mensaje de cambio de provincia enviado:', changeProvinceMessage);
      
      // ESTRATEGIA ADICIONAL: Simular clics en los controles del iframe
      console.log('🎯 Intentando simular clics en controles de provincia del iframe...');
      
      // Simular clic en el dropdown de provincias
      setTimeout(() => {
        simulateClickInIframe(
          iframeControlCoordinates.provinceDropdown.x,
          iframeControlCoordinates.provinceDropdown.y,
          'dropdown de provincias'
        );
      }, 100);
      
      // Simular clic en el botón de actualizar provincia
      setTimeout(() => {
        simulateClickInIframe(
          iframeControlCoordinates.provinceButton.x,
          iframeControlCoordinates.provinceButton.y,
          'botón actualizar provincia'
        );
      }, 500);
    }
    
    // Actualizar el iframe con todos los filtros
    updateIframeFilters();
    
    // Mostrar feedback visual en el botón externo
    const externalButton = document.querySelector('button[onclick*="handleChangeProvince"]');
    if (externalButton) {
      externalButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      externalButton.textContent = '✅ Provincia Actualizada';
      setTimeout(() => {
        externalButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        externalButton.textContent = 'Actualizar Provincia';
      }, 2000);
    }
  };

  // Función de utilidad para inspeccionar el contenido del iframe (para debugging)
  const inspectIframeContent = () => {
    if (!iframeRef.current) return;
    
    console.log('🔍 Inspeccionando contenido del iframe...');
    
    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      
      // Intentar encontrar selectores y botones en el iframe
      const selects = iframeDoc.querySelectorAll('select');
      const buttons = iframeDoc.querySelectorAll('button');
      const inputs = iframeDoc.querySelectorAll('input');
      
      console.log('📋 Selectores encontrados:', selects.length);
      console.log('🔘 Botones encontrados:', buttons.length);
      console.log('📝 Inputs encontrados:', inputs.length);
      
      // Listar los IDs y clases de los elementos
      selects.forEach((select, index) => {
        console.log(`Select ${index}: id="${select.id}", class="${select.className}"`);
      });
      
      buttons.forEach((button, index) => {
        console.log(`Button ${index}: id="${button.id}", class="${button.className}", text="${button.textContent}"`);
      });
      
    } catch (error) {
      console.log('⚠️ No se puede inspeccionar el iframe (CORS):', error.message);
      console.log('💡 Sugerencia: Abre la consola del iframe en las DevTools para ver su estructura');
    }
  };

  // useEffect para inspeccionar el iframe cuando se carga
  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      
      // Esperar a que el iframe se cargue completamente
      iframe.addEventListener('load', () => {
        console.log('✅ Iframe cargado completamente');
        
        // Intentar inspeccionar el contenido después de 2 segundos
        setTimeout(() => {
          inspectIframeContent();
        }, 2000);
      });
    }
  }, []);

  return (
    <div className="relative py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
            Indicadores de Red
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-600 mb-6">
            Análisis de <span className="text-gray-600">Indicadores</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Consulta y analiza los indicadores de estado, seguridad, confort y estructural de la red
          </p>
        </div>
        
        {/* Panel de Filtros Moderno */}
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Indicador a analizar */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaChartBar className="text-blue-600" />
                Indicador a analizar
              </h3>
              <div className="relative">
                <select
                  value={selectedIndicator}
                  onChange={(e) => setSelectedIndicator(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer text-gray-700 font-medium"
                >
                  {indicators.map((indicator) => (
                    <option key={indicator} value={indicator} className="py-2">
                      {indicator}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button 
                onClick={handleChangeIndex}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Cambiar Índice
              </button>
            </div>

            {/* Provincias */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-600" />
                Provincias
              </h3>
              <div className="relative">
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer text-gray-700 font-medium"
                >
                  {provinces.map((province) => (
                    <option key={province} value={province} className="py-2">
                      {province}
                    </option>
                  ))}
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button 
                onClick={handleChangeProvince}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Actualizar Provincia
              </button>
            </div>

            {/* Carreteras */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaRoad className="text-blue-600" />
                Carreteras
              </h3>
              <div className="relative">
                <select
                  value={selectedRoad}
                  onChange={(e) => setSelectedRoad(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer text-gray-700 font-medium"
                >
                  <option value="Todas las carreteras">Todas las carreteras</option>
                  <option value="A-1">A-1</option>
                  <option value="A-2">A-2</option>
                  <option value="A-3">A-3</option>
                  <option value="A-4">A-4</option>
                  <option value="A-5">A-5</option>
                  <option value="A-6">A-6</option>
                  <option value="A-7">A-7</option>
                  <option value="A-8">A-8</option>
                </select>
                <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:-translate-y-0.5">
                Actualizar
              </button>
            </div>

            {/* Panel Interoperabilidad */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaCog className="text-blue-600" />
                Interoperabilidad
              </h3>
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-700 font-medium">Mostrar Panel</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInteroperability}
                    onChange={(e) => setShowInteroperability(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Área de Visualización con Iframe */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Mapa Interactivo de Indicadores
              </h3>
              <div className="text-sm text-gray-500">
                Configuración: {selectedIndicator} • {selectedProvince} • {selectedRoad}
              </div>
            </div>
          </div>
          
          {/* Iframe embebido */}
          <div className="relative">
            <iframe 
              ref={iframeRef}
              src="http://212.128.194.13/gestionfirmes/indicadores/"
              width="100%" 
              height="600px"
              frameBorder="0"
              style={{
                border: 'none',
                borderRadius: '12px',
                backgroundColor: 'transparent'
              }}
              className="modern-iframe"
            />
            
            {/* Overlay sutil para modernizar */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 51, 234, 0.02) 100%)',
              borderRadius: '12px',
              pointerEvents: 'none',
              zIndex: 1
            }}></div>
          </div>
          
          {/* Información de estado */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Mapa cargado
                </span>
                <span className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Filtros activos
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                  className="text-sky-600 hover:text-sky-800 font-medium flex items-center gap-2"
                >
                  <FaCog />
                  {showDebugPanel ? 'Ocultar' : 'Mostrar'} Panel de Debug
                </button>
                <button 
                  onClick={() => window.open('http://212.128.194.13/gestionfirmes/indicadores/', '_blank')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Abrir en nueva ventana
                </button>
              </div>
            </div>
          </div>

          {/* Panel de Debug (colapsable) */}
          {showDebugPanel && (
            <div className="mt-4 p-6 bg-sky-50 rounded-lg border border-sky-200">
              <h4 className="text-lg font-semibold text-sky-800 mb-4 flex items-center gap-2">
                <FaCog />
                Panel de Debugging - Simulación de Clics
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Controles de coordenadas */}
                <div className="space-y-4">
                  <h5 className="font-medium text-sky-700">Coordenadas de Prueba</h5>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">Coordenada X:</label>
                    <input
                      type="number"
                      value={debugCoords.x}
                      onChange={(e) => setDebugCoords({ ...debugCoords, x: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-700">Coordenada Y:</label>
                    <input
                      type="number"
                      value={debugCoords.y}
                      onChange={(e) => setDebugCoords({ ...debugCoords, y: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <button
                    onClick={() => simulateClickInIframe(debugCoords.x, debugCoords.y, 'prueba manual')}
                    className="w-full bg-gradient-to-r from-sky-600 to-sky-700 text-white py-2 px-4 rounded-lg font-medium hover:from-sky-700 hover:to-sky-800"
                  >
                    🖱️ Probar Clic en ({debugCoords.x}, {debugCoords.y})
                  </button>
                  
                  <button
                    onClick={inspectIframeContent}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800"
                  >
                    🔍 Inspeccionar Iframe
                  </button>
                </div>
                
                {/* Coordenadas configuradas */}
                <div className="space-y-4">
                  <h5 className="font-medium text-sky-700">Coordenadas Actuales</h5>
                  
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-white rounded border border-sky-100">
                      <strong>Dropdown Indicador:</strong> ({iframeControlCoordinates.indicatorDropdown.x}, {iframeControlCoordinates.indicatorDropdown.y})
                    </div>
                    <div className="p-3 bg-white rounded border border-sky-100">
                      <strong>Botón Indicador:</strong> ({iframeControlCoordinates.indicatorButton.x}, {iframeControlCoordinates.indicatorButton.y})
                    </div>
                    <div className="p-3 bg-white rounded border border-sky-100">
                      <strong>Dropdown Provincia:</strong> ({iframeControlCoordinates.provinceDropdown.x}, {iframeControlCoordinates.provinceDropdown.y})
                    </div>
                    <div className="p-3 bg-white rounded border border-sky-100">
                      <strong>Botón Provincia:</strong> ({iframeControlCoordinates.provinceButton.x}, {iframeControlCoordinates.provinceButton.y})
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded text-sm">
                <strong className="text-yellow-800 text-base">⚠️ CORS está bloqueando el acceso directo al iframe</strong>
                <p className="text-yellow-700 mt-2 mb-3">
                  Esto es <strong>normal y esperado</strong> por razones de seguridad. Los mensajes PostMessage se están enviando correctamente, 
                  pero el <strong>iframe necesita código para escucharlos y procesarlos</strong>.
                </p>
                
                <div className="bg-white p-3 rounded border border-yellow-200 mb-3">
                  <strong className="text-gray-800">✅ Lo que SÍ funciona:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-700 space-y-1">
                    <li>Envío de mensajes PostMessage al iframe</li>
                    <li>Múltiples formatos de mensajes (3 tipos diferentes)</li>
                    <li>Feedback visual en los botones externos</li>
                    <li>Logs detallados en la consola</li>
                  </ul>
                </div>
                
                <div className="bg-white p-3 rounded border border-yellow-200">
                  <strong className="text-gray-800">❌ Lo que NO funciona (por CORS):</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-700 space-y-1">
                    <li>Acceso directo al DOM del iframe</li>
                    <li>Inyección de scripts en el iframe</li>
                    <li>Simulación de clics en elementos del iframe</li>
                    <li>Lectura de elementos internos del iframe</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded text-sm">
                <strong className="text-blue-800 text-base">📋 Próximos Pasos:</strong>
                <ol className="list-decimal list-inside mt-2 space-y-2 text-blue-700">
                  <li>
                    <strong>Hablar con el equipo que desarrolló el iframe</strong>
                    <br />
                    <span className="text-sm">Mostrarles el archivo <code className="bg-blue-100 px-1 rounded">INSTRUCCIONES_IFRAME_INTEGRATION.md</code></span>
                  </li>
                  <li>
                    <strong>Pedir que agreguen un listener de mensajes</strong>
                    <br />
                    <span className="text-sm">Solo necesitan agregar ~30 líneas de código JavaScript</span>
                  </li>
                  <li>
                    <strong>Probar la integración</strong>
                    <br />
                    <span className="text-sm">Una vez implementado, los filtros externos controlarán el iframe</span>
                  </li>
                </ol>
              </div>
              
              <div className="mt-4 p-4 bg-sky-100 rounded text-sm text-sky-800">
                <strong>🛠️ Instrucciones de Debug:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Abre las DevTools del navegador (F12)</li>
                  <li>Ve a la pestaña "Console" para ver los logs detallados</li>
                  <li>Haz clic en "Cambiar Índice" o "Actualizar Provincia"</li>
                  <li>Verás los mensajes que se envían al iframe</li>
                  <li>Una vez que el iframe tenga el listener, verás que procesa los mensajes</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndicadoresIframe;
