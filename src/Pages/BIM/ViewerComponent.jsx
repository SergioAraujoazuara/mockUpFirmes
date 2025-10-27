/**
 * @file ViewerComponent.jsx
 * @description
 * This component sets up a 3D BIM viewer using "openbim-components" and Three.js.
 * It loads an IFC model, allows users to select elements, and retrieves their properties.
 * When an element is selected, the component extracts its GlobalId and Name properties 
 * and passes them back up to the parent component via callback props.
 *
 * Key functionalities:
 * 1. Initializes the viewer and scene components.
 * 2. Loads an IFC model as fragments.
 * 3. Provides selection and highlighting of IFC elements.
 * 4. Retrieves properties of the selected element (e.g., GlobalId, Name).
 * 5. Uses callbacks `setSelectedGlobalId` and `setSelectedNameBim` to return the selected element's data.
 *
 * This component uses React.memo for optimization.
 */

import React, { useEffect, useState } from 'react';
import BimLoadingBar from '../../Components/BimLoadingBar';

const ViewerComponent = React.memo(({ setSelectedGlobalId, setSelectedNameBim, onLoadingChange }) => {
    const [modelCount, setModelCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingComponents, setIsLoadingComponents] = useState(true);
    const [loadingError, setLoadingError] = useState(null);
    const [showInspectionModal, setShowInspectionModal] = useState(false);
    const [selectedElementData, setSelectedElementData] = useState(null);
    const [inspectionData, setInspectionData] = useState({
        resultado: '',
        observaciones: '',
        imagen: null,
        imagen2: null,
        firma: null
    });
    const [firmaCapturada, setFirmaCapturada] = useState(false);
    const [firmaData, setFirmaData] = useState('');
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvasRef, setCanvasRef] = useState(null);

    // Funciones para manejar la firma digital
    const handleStartDrawing = (e) => {
        if (!canvasRef) return;
        setIsDrawing(true);
        const canvas = canvasRef;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        
        // Configurar el contexto del canvas
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleDraw = (e) => {
        if (!isDrawing || !canvasRef) return;
        const canvas = canvasRef;
        const rect = canvas.getBoundingClientRect();
        const ctx = canvas.getContext('2d');
        
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
    };

    const handleStopDrawing = () => {
        setIsDrawing(false);
    };

    const handleCapturarFirma = () => {
        const canvas = canvasRef;
        const dataURL = canvas.toDataURL();
        setFirmaData(dataURL);
        setFirmaCapturada(true);
        setInspectionData({...inspectionData, firma: dataURL});
    };

    const handleLimpiarFirma = () => {
        if (!canvasRef) return;
        const canvas = canvasRef;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setFirmaData('');
        setFirmaCapturada(false);
        setInspectionData({...inspectionData, firma: null});
    };

    // Configurar el canvas cuando se monta
    useEffect(() => {
        if (canvasRef) {
            const canvas = canvasRef;
            const ctx = canvas.getContext('2d');
            
            // Configurar el contexto del canvas
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
    }, [canvasRef]);

    // Cache para archivos WASM precargados
    const [wasmCache, setWasmCache] = useState({
        webIfcUrl: null,
        webIfcMtUrl: null,
        webIfcNodeUrl: null,
        loaded: false
    });

    // Función para precargar archivos WASM
    const preloadWasmFiles = async () => {
        try {
            console.log('🔄 Precargando archivos WASM...');
            
            const { getStorage, ref, getDownloadURL } = await import('firebase/storage');
            const { getApp } = await import('firebase/app');
            
            const app = getApp();
            const storage = getStorage(app);
            
            // Precargar URLs de archivos WASM en paralelo
            const [webIfcUrl, webIfcMtUrl, webIfcNodeUrl] = await Promise.all([
                getDownloadURL(ref(storage, 'web/web-ifc.wasm')),
                getDownloadURL(ref(storage, 'web/web-ifc-mt.wasm')),
                getDownloadURL(ref(storage, 'web/web-ifc-node.wasm'))
            ]);
            
            // Guardar en cache
            setWasmCache({
                webIfcUrl,
                webIfcMtUrl,
                webIfcNodeUrl,
                loaded: true
            });
            
            console.log('✅ Archivos WASM precargados exitosamente');
            return { webIfcUrl, webIfcMtUrl, webIfcNodeUrl };
        } catch (error) {
            console.warn('⚠️ Error precargando archivos WASM:', error);
            return null;
        }
    };

    // Función para cargar componentes BIM dinámicamente
    const loadBIMComponents = async () => {
        try {
            console.log('🔄 Cargando componentes BIM dinámicamente...');
            setIsLoadingComponents(true);
            setLoadingError(null);
            
            // Cargar componentes y precargar WASM en paralelo
            const [componentsResult, wasmResult] = await Promise.all([
                Promise.all([
                    import("openbim-components"),
                    import("three")
                ]),
                preloadWasmFiles()
            ]);
            
            const [OBC, THREE] = componentsResult;
            
            console.log('✅ Componentes BIM cargados exitosamente');
            setIsLoadingComponents(false);
            
            return { 
                OBC: OBC.default || OBC, 
                THREE: THREE.default || THREE,
                wasmUrls: wasmResult
            };
        } catch (error) {
            console.error('❌ Error cargando componentes BIM:', error);
            setLoadingError('Error al cargar los componentes BIM. Por favor, recarga la página.');
            setIsLoadingComponents(false);
            throw error;
        }
    };

    // Styles for the viewer container
    const viewerContainerStyle = {
        width: "100%",
        height: "100%",
        minHeight: "50",
        position: "relative",
        gridArea: "viewer",
    };

    // Initialize the main viewer components
    useEffect(() => {
        const initViewer = async () => {
            // Cargar componentes BIM dinámicamente
            const { OBC, THREE, wasmUrls } = await loadBIMComponents();
            
            const viewer = new OBC.Components();
            const viewerContainer = document.getElementById("viewerContainer");

            if (!viewerContainer) {
                console.error("Viewer container not found.");
                return;
            }
            // Set up the scene component (manages Three.js scene)
            const sceneComponent = new OBC.SimpleScene(viewer);
            sceneComponent.setup();
            viewer.scene = sceneComponent;
            const scene = sceneComponent.get();
            // Renderer configuration with postprocessing capabilities
            const rendererComponent = new OBC.PostproductionRenderer(viewer, viewerContainer);
            viewer.renderer = rendererComponent;
            // Camera component (OrthoPerspective provides both orthographic and perspective views)
            const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer);
            viewer.camera = cameraComponent;
            // Raycaster for selecting elements in the scene
            const raycasterComponent = new OBC.SimpleRaycaster(viewer);
            viewer.raycaster = raycasterComponent;
            // Initialize the viewer
            viewer.init();
            cameraComponent.updateAspect();
            rendererComponent.postproduction.enabled = true;
            // Add a simple grid to the scene
            const grid = new OBC.SimpleGrid(viewer, new THREE.Color(0x666666));
            // Exclude the grid from post-processing effects if necessary
            rendererComponent.postproduction.customEffects.excludedMeshes.push(grid.get());
            // FragmentManager handles loaded IFC fragments
            const fragmentManager = new OBC.FragmentManager(viewer);
            
            // Configure IFC Loader with WASM path
            const ifcLoader = new OBC.FragmentIfcLoader(viewer);
            
            // Configurar WASM files usando URLs precargadas
            await ifcLoader.setup();
            
            try {
                if (wasmUrls && wasmUrls.webIfcUrl) {
                    // Usar URLs precargadas para configuración rápida
                    ifcLoader.settings.wasm = {
                        path: wasmUrls.webIfcUrl,
                        absolute: true,
                        mt: wasmUrls.webIfcMtUrl,
                        node: wasmUrls.webIfcNodeUrl
                    };
                    console.log('✅ Archivos WASM configurados desde cache precargado');
                } else {
                    // Fallback: obtener URLs dinámicamente
                    const { getStorage, ref, getDownloadURL } = await import('firebase/storage');
                    const { getApp } = await import('firebase/app');
                    
                    const app = getApp();
                    const storage = getStorage(app);
                    
                    const [webIfcUrl, webIfcMtUrl, webIfcNodeUrl] = await Promise.all([
                        getDownloadURL(ref(storage, 'web/web-ifc.wasm')),
                        getDownloadURL(ref(storage, 'web/web-ifc-mt.wasm')),
                        getDownloadURL(ref(storage, 'web/web-ifc-node.wasm'))
                    ]);
                    
                    ifcLoader.settings.wasm = {
                        path: webIfcUrl,
                        absolute: true,
                        mt: webIfcMtUrl,
                        node: webIfcNodeUrl
                    };
                    console.log('✅ Archivos WASM configurados dinámicamente');
                }
            } catch (wasmError) {
                console.warn('⚠️ Error configurando archivos WASM:', wasmError);
                // Fallback a configuración local
                ifcLoader.settings.wasm = {
                    path: "/",
                    absolute: true
                };
            }
            
            // IFC Loader to load IFC models as fragments
            const highlighter = new OBC.FragmentHighlighter(viewer);
            highlighter.setup();
            
            // Crear nuestro propio sistema de iluminación
            let selectedElement = null;
            let originalMaterial = null;
            const highlightMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff, // Blanco brillante
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide,
                emissive: 0xffffff, // Emisión blanca para mayor brillo
                emissiveIntensity: 0.5
            });
            
            const hoverMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff, // Blanco brillante
                transparent: true,
                opacity: 0.7,
                side: THREE.DoubleSide,
                emissive: 0xffffff, // Emisión blanca para mayor brillo
                emissiveIntensity: 0.3
            });
            
            // Configurar el highlighter para que funcione correctamente
            try {
                // Habilitar hover y selección usando la API correcta
                if (highlighter.config) {
                    highlighter.config.hoverEnabled = true;
                    highlighter.config.selectEnabled = true;
                    console.log('✅ Highlighter habilitado');
                }
                
                // Configuración adicional para asegurar que funcione
                try {
                    // Intentar configurar materiales directamente
                    if (highlighter.hoverMaterial) {
                        highlighter.hoverMaterial.color.setHex(0xffffff);
                        highlighter.hoverMaterial.opacity = 0.9;
                        highlighter.hoverMaterial.transparent = true;
                        console.log('✅ Material de hover configurado inicialmente');
                    }
                    
                    if (highlighter.selectMaterial) {
                        highlighter.selectMaterial.color.setHex(0xffffff);
                        highlighter.selectMaterial.opacity = 1.0;
                        highlighter.selectMaterial.transparent = true;
                        console.log('✅ Material de selección configurado inicialmente');
                    }
                } catch (materialError) {
                    console.log('ℹ️ Materiales no disponibles inicialmente:', materialError.message);
                }
            } catch (error) {
                console.warn('⚠️ Error configurando highlighter:', error);
            }
        /**
                 * @function loadIfcAsFragments
                 * Loads an IFC model from a given path, converts it into fragments,
                 * and adds it to the scene.
                 *
                 * Complex logic:
                 * - Fetches IFC file data as an ArrayBuffer.
                 * - Uses FragmentIfcLoader to parse and create 3D fragments from IFC data.
                 * - Adds these fragments (representing IFC elements) to the Three.js scene.
                 */
        /**
         * @function loadIfcFromFirebase
         * Carga un modelo IFC desde Firebase Storage con streaming optimizado
         */
        async function loadIfcFromFirebase() {
            try {
                console.log(`🔄 Intentando cargar desde Firebase Storage`);
                setIsLoading(true);
                if (onLoadingChange) onLoadingChange(true);
                
                // Importar Firebase dinámicamente
                const { getStorage, ref, getDownloadURL } = await import('firebase/storage');
                const { getApp } = await import('firebase/app');
                
                // Obtener la instancia de Firebase
                const app = getApp();
                const storage = getStorage(app);
                
                // Referencia al archivo en Firebase Storage
                const fileRef = ref(storage, 'modelos/Polanco.ifc');
                
                // Obtener la URL de descarga
                const downloadURL = await getDownloadURL(fileRef);
                console.log(`🔗 URL de Firebase: ${downloadURL}`);
                
                // Descargar el archivo con streaming para mejor rendimiento
                const response = await fetch(downloadURL);
                if (!response.ok) {
                    throw new Error(`No se pudo cargar el archivo desde Firebase: ${response.status} ${response.statusText}`);
                }
                
                // Verificar si el navegador soporta streaming
                const reader = response.body?.getReader();
                if (reader) {
                    console.log('📡 Usando streaming para descarga optimizada');
                    
                    // Leer el stream en chunks
                    const chunks = [];
                    let receivedLength = 0;
                    const contentLength = +response.headers.get('Content-Length');
                    
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        
                        chunks.push(value);
                        receivedLength += value.length;
                        
                        // Actualizar progreso si tenemos información del tamaño
                        if (contentLength > 0) {
                            const progress = (receivedLength / contentLength) * 100;
                            console.log(`📊 Progreso de descarga: ${progress.toFixed(1)}%`);
                        }
                    }
                    
                    // Combinar chunks en un ArrayBuffer
                    const chunksAll = new Uint8Array(receivedLength);
                    let position = 0;
                    for (const chunk of chunks) {
                        chunksAll.set(chunk, position);
                        position += chunk.length;
                    }
                    
                    console.log(`✅ Descarga completada: ${receivedLength} bytes`);
                    const model = await ifcLoader.load(chunksAll, "Polanco");
                    scene.add(model);
                } else {
                    // Fallback a método tradicional
                    console.log('📦 Usando descarga tradicional');
                    const data = await response.arrayBuffer();
                    const buffer = new Uint8Array(data);
                    const model = await ifcLoader.load(buffer, "Polanco");
                    scene.add(model);
                }
                
                console.log(`✅ Modelo cargado exitosamente desde Firebase`);
                
                // Ajustar la cámara para enfocar el modelo
                setTimeout(() => {
                    // Calcular el bounding box del modelo
                    const bbox = new THREE.Box3();
                    model.traverse((child) => {
                        if (child.isMesh) {
                            bbox.expandByObject(child);
                        }
                    });
                    
                    const center = bbox.getCenter(new THREE.Vector3());
                    const size = bbox.getSize(new THREE.Vector3());
                    
                    // Calcular la distancia necesaria para ver todo el modelo
                    const maxDim = Math.max(size.x, size.y, size.z);
                    const distance = maxDim * 2;
                    
                    // Usar el método fit de la cámara si existe
                    if (cameraComponent.fit) {
                        cameraComponent.fit([model]);
                    } else {
                        // Fallback manual con rotación de 45 grados
                        const camera = cameraComponent.activeCamera;
                        const angle = Math.PI / 4;
                        const cos = Math.cos(angle);
                        const sin = Math.sin(angle);
                        
                        const x = center.x + distance;
                        const y = center.y + distance;
                        const z = center.z + distance;
                        
                        const rotatedX = x * cos - z * sin;
                        const rotatedZ = x * sin + z * cos;
                        
                        camera.position.set(rotatedX, y, rotatedZ);
                        camera.lookAt(center);
                        camera.updateProjectionMatrix();
                        
                        if (cameraComponent.controls) {
                            cameraComponent.controls.target.copy(center);
                            cameraComponent.controls.update();
                        }
                    }
                    
                    console.log(`📷 Cámara ajustada al modelo - Centro:`, center, `Tamaño:`, size);
                    
                    // Finalizar la carga
                    setIsLoading(false);
                    if (onLoadingChange) onLoadingChange(false);
                }, 100);
            } catch (error) {
                console.error(`❌ Error al cargar desde Firebase:`, error);
                setIsLoading(false);
                if (onLoadingChange) onLoadingChange(false);
                
                if (error.message && error.message.includes('IFC4X3_ADD2')) {
                    alert(`⚠️ ERROR: El modelo usa el esquema IFC4X3_ADD2 que no está soportado.\n\nSolución: Convierte el archivo a IFC4 o IFC2X3.`);
                } else {
                    alert(`Error al cargar el modelo desde Firebase: ${error.message}`);
                }
            }
        }
        
        // Cargar el modelo desde Firebase Storage
        loadIfcFromFirebase();
        // IfcPropertiesProcessor extracts IFC properties from selected elements
        const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer);
        // Event: Clear selection (no element highlighted)
        highlighter.events.select.onClear.add(() => {
            propertiesProcessor.cleanPropertiesList();
            setSelectedGlobalId(null);
            setSelectedNameBim(null) // Callback to clear the selected global ID
        });
        
        // Event: Hover over elements (highlight on mouse over)
        try {
            if (highlighter.events && highlighter.events.highlight) {
                highlighter.events.highlight.onHighlight.add((selection) => {
                    console.log('🟢 Elemento en hover:', selection);
                });
                
                highlighter.events.highlight.onClear.add(() => {
                    console.log('🟢 Hover limpiado');
                });
                console.log('✅ Eventos de hover configurados');
            }
        } catch (error) {
            console.warn('⚠️ Error configurando eventos de hover:', error);
        }
        
        // Event: Element selected
        try {
            if (highlighter.events && highlighter.events.select) {
                highlighter.events.select.onHighlight.add((selection) => {
                    console.log('🎯 Elemento seleccionado:', selection);
                });
                
                highlighter.events.select.onClear.add(() => {
                    console.log('🎯 Selección limpiada');
                });
                console.log('✅ Eventos de selección configurados');
            }
        } catch (error) {
            console.warn('⚠️ Error configurando eventos de selección:', error);
        }
        // When IFC is loaded successfully:
        ifcLoader.onIfcLoaded.add(model => {
            setModelCount(fragmentManager.groups.length);
            propertiesProcessor.process(model);
            
            // Configurar colores del highlighter después de cargar el modelo
            try {
                // Configurar materiales del highlighter de forma más robusta
                if (highlighter.config) {
                    // Intentar configurar materiales si existen
                    try {
                        if (highlighter.config.hoverMaterial) {
                            highlighter.config.hoverMaterial.color.setHex(0xffffff); // Blanco brillante
                            highlighter.config.hoverMaterial.opacity = 0.9;
                            highlighter.config.hoverMaterial.transparent = true;
                            if (highlighter.config.hoverMaterial.emissive) {
                                highlighter.config.hoverMaterial.emissive.setHex(0xffffff);
                                highlighter.config.hoverMaterial.emissiveIntensity = 0.5;
                            }
                            console.log('✅ Material de hover configurado (blanco brillante)');
                        }
                    } catch (hoverError) {
                        console.log('ℹ️ Material de hover no disponible:', hoverError.message);
                    }
                    
                    try {
                        if (highlighter.config.selectMaterial) {
                            highlighter.config.selectMaterial.color.setHex(0xffffff); // Blanco brillante
                            highlighter.config.selectMaterial.opacity = 1.0;
                            highlighter.config.selectMaterial.transparent = true;
                            if (highlighter.config.selectMaterial.emissive) {
                                highlighter.config.selectMaterial.emissive.setHex(0xffffff);
                                highlighter.config.selectMaterial.emissiveIntensity = 0.8;
                            }
                            console.log('✅ Material de selección configurado (blanco muy brillante)');
                        }
                    } catch (selectError) {
                        console.log('ℹ️ Material de selección no disponible:', selectError.message);
                    }
                    
                    // Asegurar que el highlighter esté habilitado
                    highlighter.config.hoverEnabled = true;
                    highlighter.config.selectEnabled = true;
                    
                    // Configuración adicional para asegurar que funcione
                    try {
                        if (highlighter.config.hover) {
                            highlighter.config.hover.enabled = true;
                        }
                        if (highlighter.config.select) {
                            highlighter.config.select.enabled = true;
                        }
                        console.log('✅ Highlighter configurado con API adicional');
                    } catch (apiError) {
                        console.log('ℹ️ API adicional no disponible, usando configuración básica');
                    }
                    
                    // Forzar la configuración del highlighter para que sea visible
                    try {
                        // Configurar colores directamente en el highlighter con colores más contrastantes
                        if (highlighter.hoverMaterial) {
                            highlighter.hoverMaterial.color.setHex(0xff0000); // Rojo brillante para hover
                            highlighter.hoverMaterial.opacity = 0.8;
                            highlighter.hoverMaterial.transparent = true;
                            console.log('✅ Material de hover directo configurado (rojo)');
                        }
                        
                        if (highlighter.selectMaterial) {
                            highlighter.selectMaterial.color.setHex(0x00ff00); // Verde brillante para selección
                            highlighter.selectMaterial.opacity = 0.9;
                            highlighter.selectMaterial.transparent = true;
                            console.log('✅ Material de selección directo configurado (verde)');
                        }
                        
                        // Intentar configurar también en config
                        if (highlighter.config) {
                            if (highlighter.config.hoverMaterial) {
                                highlighter.config.hoverMaterial.color.setHex(0xff0000);
                                highlighter.config.hoverMaterial.opacity = 0.8;
                                console.log('✅ Config hover material configurado (rojo)');
                            }
                            
                            if (highlighter.config.selectMaterial) {
                                highlighter.config.selectMaterial.color.setHex(0x00ff00);
                                highlighter.config.selectMaterial.opacity = 0.9;
                                console.log('✅ Config select material configurado (verde)');
                            }
                        }
                        
                        // Forzar la actualización del highlighter
                        try {
                            if (typeof highlighter.update === 'function') {
                                highlighter.update();
                                console.log('✅ Highlighter actualizado forzadamente');
                            } else {
                                // Intentar otros métodos de actualización
                                if (highlighter.refresh) {
                                    highlighter.refresh();
                                    console.log('✅ Highlighter refrescado');
                                } else if (highlighter.render) {
                                    highlighter.render();
                                    console.log('✅ Highlighter renderizado');
                                } else {
                                    console.log('ℹ️ No se encontró método de actualización del highlighter');
                                }
                            }
                        } catch (updateError) {
                            console.log('ℹ️ Error actualizando highlighter:', updateError.message);
                        }
                        
                        // Forzar la aplicación de materiales
                        try {
                            // Intentar aplicar materiales directamente
                            if (highlighter.materials) {
                                highlighter.materials.hover = highlighter.hoverMaterial;
                                highlighter.materials.select = highlighter.selectMaterial;
                                console.log('✅ Materiales aplicados directamente');
                            }
                            
                            // Intentar forzar la renderización
                            if (viewer.renderer && viewer.renderer.render) {
                                viewer.renderer.render();
                                console.log('✅ Renderer forzado a renderizar');
                            }
                        } catch (forceError) {
                            console.log('ℹ️ Error forzando aplicación de materiales:', forceError.message);
                        }
                    } catch (directError) {
                        console.log('ℹ️ Configuración directa no disponible:', directError.message);
                    }
                    
                    console.log('✅ Highlighter re-habilitado después de cargar modelo');
                }
            } catch (error) {
                console.warn('⚠️ No se pudieron configurar los colores del highlighter:', error);
            }
            
            // Sistema de selección personalizado con raycasting
            const handleClick = (event) => {
                const rect = viewerContainer.getBoundingClientRect();
                const mouse = new THREE.Vector2();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                
                // Crear raycaster
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, cameraComponent.activeCamera);
                
                // Obtener todos los objetos del modelo
                const objects = [];
                scene.traverse((child) => {
                    if (child.isMesh) {
                        objects.push(child);
                    }
                });
                
                // Realizar intersección
                const intersects = raycaster.intersectObjects(objects);
                
                if (intersects.length > 0) {
                    const intersected = intersects[0].object;
                    
                    // Restaurar material anterior si existe
                    if (selectedElement && originalMaterial) {
                        selectedElement.material = originalMaterial;
                    }
                    
                    // Guardar material original y aplicar nuevo
                    originalMaterial = intersected.material;
                    selectedElement = intersected;
                    intersected.material = highlightMaterial;
                    
                    // Simular datos de elemento seleccionado
                    const mockGlobalId = `GID_${Math.random().toString(36).substr(2, 9)}`;
                    const mockName = `Elemento_${Math.floor(Math.random() * 1000)}`;
                    
                    // Datos del elemento seleccionado
                    const elementData = {
                        globalId: mockGlobalId,
                        name: mockName,
                        type: 'Pared',
                        material: 'Hormigón',
                        dimensions: '3.5m x 2.8m x 0.2m'
                    };
                    
                    setSelectedElementData(elementData);
                    setSelectedGlobalId(mockGlobalId);
                    setSelectedNameBim(mockName);
                    
                    // Esperar 1 segundo para ver la iluminación, luego abrir el modal
                    setTimeout(() => {
                        setShowInspectionModal(true);
                    }, 1000);
                    
                    console.log('🎯 Elemento seleccionado con raycasting personalizado:', { 
                        mockGlobalId, 
                        mockName,
                        object: intersected
                    });
                }
            };
            
            // Agregar event listener para clicks
            // Agregar event listener para clicks
            viewerContainer.addEventListener('click', handleClick);
            /**
             * @event onHighlight
             * Triggered when the user selects (highlights) an element in the 3D scene.
             * Complex logic:
             * - Extracts the selected fragment and element ID.
             * - Uses IfcPropertiesProcessor to retrieve all properties of the selected element.
             * - From these properties, finds the GlobalId and Name.
             * - Calls the provided callback functions to update selectedGlobalId and selectedNameBim states in the parent.
             */
            highlighter.events.select.onHighlight.add((selection) => {
                try {
                    console.log('🎯 Elemento seleccionado:', selection);
                    
                    const fragmentID = Object.keys(selection)[0];
                    const expressID = Number([...selection[fragmentID]][0]);
                    const properties = propertiesProcessor.getProperties(model, expressID.toString());
                    console.log(properties, '******** properties'); // Esto debería mostrarte todas las propiedades del objeto seleccionado.

                    if (properties) {
                        // Convert properties to array if it's not already
                        const propertiesArray = Array.isArray(properties) ? properties : Object.values(properties);
                        
                        // Attempt to find GlobalId property
                        const globalIdProperty = propertiesArray.find(prop => 
                            prop && (prop.Name === 'GlobalId' || (prop.GlobalId && prop.GlobalId.value))
                        );
                        // Attempt to find Name property
                        const nameProperty = propertiesArray.find(prop => 
                            prop && (prop.Name === 'Name' || (prop.Name && prop.Name.value))
                        );
                        
                        const globalId = globalIdProperty ? 
                            (globalIdProperty.GlobalId?.value || globalIdProperty.value || 'No disponible') : 
                            'No disponible';
                        const name = nameProperty ? 
                            (nameProperty.Name?.value || nameProperty.value || 'No disponible') : 
                            'No disponible';

                        console.log('🔍 Global ID:', globalId);
                        console.log('📝 Nombre:', name);

                        // Update parent states with the selected element's globalId and name
                        setSelectedGlobalId(globalId);
                        setSelectedNameBim(name);
                        
                        // Feedback visual adicional
                        console.log('✅ Elemento iluminado y seleccionado correctamente');
                    } else {
                        // If no properties found, set default values
                        console.log('⚠️ No se encontraron propiedades, usando valores por defecto');
                        setSelectedGlobalId('No disponible');
                        setSelectedNameBim('Elemento seleccionado');
                    }
                } catch (error) {
                    console.error('❌ Error processing element selection:', error);
                    // Set default values on error
                    setSelectedGlobalId('Error al obtener datos');
                    setSelectedNameBim('Elemento seleccionado');
                }
            });
        });
            // Add a toolbar with IFC properties UI
            const mainToolbar = new OBC.Toolbar(viewer);
            mainToolbar.addChild(

                propertiesProcessor.uiElement.get("main")
            );
            viewer.ui.addToolbar(mainToolbar);
            
            return viewer; // Retornar el viewer para el cleanup
        }; // Fin de la función initViewer
        
        // Llamar a la función async de inicialización
        let viewerInstance;
        initViewer().then(viewer => {
            viewerInstance = viewer;
        });
        
        // Cleanup function to dispose the viewer on component unmount
        return () => {
            if (viewerInstance) {
                viewerInstance.dispose();
            }
        };
    }, [setSelectedGlobalId, setSelectedNameBim]);

    return (
        <>
            <BimLoadingBar isLoading={isLoading || isLoadingComponents} />
            
            {/* Mostrar error si hay problema cargando componentes */}
            {loadingError && (
                <div className="flex items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-center">
                        <div className="text-red-600 text-lg font-semibold mb-2">Error de Carga</div>
                        <div className="text-red-500 text-sm mb-4">{loadingError}</div>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Recargar Página
                        </button>
                    </div>
                </div>
            )}
            
            {/* Mostrar mensaje de carga de componentes */}
            {isLoadingComponents && !loadingError && (
                <div className="flex items-center justify-center h-64 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <div className="text-blue-600 text-lg font-semibold mb-2">Cargando Visor BIM</div>
                        <div className="text-blue-500 text-sm mb-2">Descargando componentes necesarios...</div>
                        <div className="text-blue-400 text-xs">Precargando archivos WASM para mejor rendimiento</div>
                    </div>
                </div>
            )}
            
            {/* Contenedor del visor - solo visible cuando no hay errores */}
            {!loadingError && (
                <div className='container' id="viewerContainer" style={viewerContainerStyle}></div>
            )}
            
            {/* Modal de inspección completo */}
            {showInspectionModal && selectedElementData && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-hidden">
                        {/* Header del modal con gradiente */}
                        <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Inspección BIM</h3>
                                        <p className="text-sky-100 text-sm">Elemento: {selectedElementData.name}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowInspectionModal(false)}
                                    className="w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {/* Contenido del modal */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                        
                            {/* Información del elemento */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4">
                                    Información del Elemento
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Global</label>
                                        <p className="text-sm text-gray-900 bg-white p-2 rounded-lg border">{selectedElementData.globalId}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                        <p className="text-sm text-gray-900 bg-white p-2 rounded-lg border">{selectedElementData.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                        <p className="text-sm text-gray-900 bg-white p-2 rounded-lg border">{selectedElementData.type}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                                        <p className="text-sm text-gray-900 bg-white p-2 rounded-lg border">{selectedElementData.material}</p>
                                    </div>
                                </div>
                            </div>
                        
                            {/* Formulario de inspección */}
                            <form className="space-y-6">
                                {/* Resultado de inspección */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                                        Resultado de la inspección:
                                    </label>
                                    <div className="flex space-x-6">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="resultado"
                                                value="apto"
                                                checked={inspectionData.resultado === 'apto'}
                                                onChange={(e) => setInspectionData({...inspectionData, resultado: e.target.value})}
                                                className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                                            />
                                            <span className="ml-2 text-green-600 font-semibold text-sm">Apto</span>
                                        </label>
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="resultado"
                                                value="no_apto"
                                                checked={inspectionData.resultado === 'no_apto'}
                                                onChange={(e) => setInspectionData({...inspectionData, resultado: e.target.value})}
                                                className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                                            />
                                            <span className="ml-2 text-red-600 font-semibold text-sm">No Apto</span>
                                        </label>
                                    </div>
                                </div>
                            
                                {/* Observaciones */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                                        Observaciones:
                                    </label>
                                    <textarea
                                        value={inspectionData.observaciones}
                                        onChange={(e) => setInspectionData({...inspectionData, observaciones: e.target.value})}
                                        rows={4}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="Describe las observaciones de la inspección..."
                                    />
                                </div>
                                
                                {/* Subida de imágenes */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                                        Imágenes:
                                    </label>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">Imagen 1</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setInspectionData({...inspectionData, imagen: e.target.files[0]})}
                                                className="w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-2">Imagen 2</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setInspectionData({...inspectionData, imagen2: e.target.files[0]})}
                                                className="w-full text-xs text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Firma digital */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                                        Firma Digital:
                                    </label>
                                    {firmaCapturada ? (
                                        <div className="border-2 border-gray-300 rounded-xl p-4 bg-gray-50">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Firma capturada</span>
                                                <button
                                                    onClick={handleLimpiarFirma}
                                                    className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                                >
                                                    Limpiar
                                                </button>
                                            </div>
                                            <img src={firmaData} alt="Firma digital" className="w-full h-32 object-contain bg-white rounded border" />
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50">
                                            <canvas
                                                ref={setCanvasRef}
                                                width={400}
                                                height={150}
                                                className="w-full h-32 bg-white rounded border cursor-crosshair"
                                                onMouseDown={handleStartDrawing}
                                                onMouseMove={handleDraw}
                                                onMouseUp={handleStopDrawing}
                                                onMouseLeave={handleStopDrawing}
                                                style={{ touchAction: 'none' }}
                                            />
                                            <div className="mt-4 flex justify-center">
                                                <button
                                                    onClick={handleCapturarFirma}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                >
                                                    Capturar Firma
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                        
                        {/* Footer del modal */}
                        <div className="bg-white px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    <span className="font-medium">Carretera A-67</span> • Campaña de Auscultación BIM
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setShowInspectionModal(false)}
                                        className="px-6 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log('💾 Guardando inspección:', {
                                                elemento: selectedElementData,
                                                inspeccion: inspectionData
                                            });
                                            setShowInspectionModal(false);
                                        }}
                                        className="px-6 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all duration-200 font-medium"
                                    >
                                        Guardar Inspección
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

export default ViewerComponent;
