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
import * as OBC from "openbim-components";
import * as THREE from "three";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { auth } from '../../../firebase_config';
import BimLoadingBar from '../../Components/BimLoadingBar';

const ViewerComponent = React.memo(({ setSelectedGlobalId, setSelectedNameBim, onLoadingChange }) => {
    const [modelCount, setModelCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

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
            
            // Set the path for web-ifc WASM files
            await ifcLoader.setup();
            ifcLoader.settings.wasm = {
                path: "/", // Los archivos WASM están en la carpeta public
                absolute: true
            };
            
            // IFC Loader to load IFC models as fragments
            const highlighter = new OBC.FragmentHighlighter(viewer);
            highlighter.setup();
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
         * Carga un modelo IFC desde Firebase Storage
         * @param {string} storagePath - Ruta del archivo en Firebase Storage (ej: 'modelos/Polanco.ifc')
         */
        async function loadIfcFromFirebase(storagePath) {
            try {
                console.log(`🔄 Intentando cargar desde Firebase Storage: ${storagePath}`);
                setIsLoading(true);
                if (onLoadingChange) onLoadingChange(true);
                
                // Obtener la URL de descarga desde Firebase Storage
                const storage = getStorage();
                const storageRef = ref(storage, storagePath);
                const downloadURL = await getDownloadURL(storageRef);
                
                console.log(`🔗 URL obtenida de Firebase: ${downloadURL}`);
                
                // Descargar el archivo desde la URL
                const file = await fetch(downloadURL);
                const data = await file.arrayBuffer();
                const buffer = new Uint8Array(data);
                const model = await ifcLoader.load(buffer, "example");
                scene.add(model);
                console.log(`✅ Modelo cargado exitosamente desde Firebase Storage`);
                
                // Ajustar la cámara para enfocar el modelo usando el método de openbim-components
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
                    const distance = maxDim * 2; // Multiplicador para dar espacio
                    
                    // Usar el método fit de la cámara de openbim-components si existe
                    if (cameraComponent.fit) {
                        cameraComponent.fit([model]);
                    } else {
                        // Fallback manual con rotación de 45 grados a la izquierda
                        const camera = cameraComponent.activeCamera;
                        
                        // Calcular posición con rotación de 45 grados (π/4 radianes)
                        const angle = Math.PI / 4; // 45 grados
                        const cos = Math.cos(angle);
                        const sin = Math.sin(angle);
                        
                        // Posición inicial
                        const x = center.x + distance;
                        const y = center.y + distance;
                        const z = center.z + distance;
                        
                        // Aplicar rotación de 45 grados alrededor del eje Y
                        const rotatedX = x * cos - z * sin;
                        const rotatedZ = x * sin + z * cos;
                        
                        camera.position.set(rotatedX, y, rotatedZ);
                        camera.lookAt(center);
                        camera.updateProjectionMatrix();
                        
                        // Actualizar los controles si existen
                        if (cameraComponent.controls) {
                            cameraComponent.controls.target.copy(center);
                            cameraComponent.controls.update();
                        }
                    }
                    
                    console.log(`📷 Cámara ajustada al modelo - Centro:`, center, `Tamaño:`, size);
                    
                    // Finalizar la carga
                    setIsLoading(false);
                    if (onLoadingChange) onLoadingChange(false);
                }, 100); // Pequeño delay para asegurar que el modelo esté renderizado
            } catch (error) {
                console.error(`❌ Error al cargar desde Firebase:`, error);
                setIsLoading(false);
                if (onLoadingChange) onLoadingChange(false);
                
                if (error.message && error.message.includes('IFC4X3_ADD2')) {
                    alert(`⚠️ ERROR: El modelo usa el esquema IFC4X3_ADD2 que no está soportado.\n\nSolución: Convierte el archivo a IFC4 o IFC2X3.`);
                } else if (error.code === 'storage/object-not-found') {
                    alert(`❌ ERROR: No se encontró el archivo en Firebase Storage.\n\nVerifica que la ruta sea correcta: ${storagePath}`);
                } else {
                    alert(`Error al cargar el modelo desde Firebase: ${error.message}`);
                }
            }
        }
        
        // Cargar el modelo desde Firebase Storage
        // Cambia 'modelos/Polanco.ifc' por la ruta donde subiste el archivo en Firebase Storage
        loadIfcFromFirebase('/modelos/Polanco.ifc');
        // IfcPropertiesProcessor extracts IFC properties from selected elements
        const propertiesProcessor = new OBC.IfcPropertiesProcessor(viewer);
        // Event: Clear selection (no element highlighted)
        highlighter.events.select.onClear.add(() => {
            propertiesProcessor.cleanPropertiesList();
            setSelectedGlobalId(null);
            setSelectedNameBim(null) // Callback to clear the selected global ID
        });
        // When IFC is loaded successfully:
        ifcLoader.onIfcLoaded.add(model => {
            setModelCount(fragmentManager.groups.length);
            propertiesProcessor.process(model);
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
                const fragmentID = Object.keys(selection)[0];
                const expressID = Number([...selection[fragmentID]][0]);
                const properties = propertiesProcessor.getProperties(model, expressID.toString());
                console.log(properties, '******** properties'); // Esto debería mostrarte todas las propiedades del objeto seleccionado.

                if (properties) {
                    // Attempt to find GlobalId property
                    const globalIdProperty = properties.find(prop => prop.Name === 'GlobalId' || (prop.GlobalId && prop.GlobalId.value));
                    // Attempt to find Name property
                    const nameProperty = properties.find(prop => prop.Name === 'Name' || (prop.Name && prop.Name.value));
                    const globalId = globalIdProperty ? globalIdProperty.GlobalId.value : 'No disponible';
                    const name = nameProperty ? nameProperty.Name.value : 'No disponible';



                    console.log(globalId, 'global id');
                    console.log(name);

                    // Update parent states with the selected element's globalId and name
                    setSelectedGlobalId(globalId);
                    setSelectedNameBim(name)
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
            <BimLoadingBar isLoading={isLoading} />
            <div className='container' id="viewerContainer" style={viewerContainerStyle}></div>
        </>
    );
});

export default ViewerComponent;
