/**
 * Component: Projects
 * 
 * Description:
 * This component retrieves and displays a project from the Firestore database. 
 * Users can edit project details, including uploading a new logo and client logo.
 * 
 * Key Features:
 * 1. **Fetch Project**: Loads project details from Firestore when the component is mounted.
 * 2. **Edit Project**: Allows editing project fields (name, work site, section, contract) and uploading new logos.
 * 3. **Update Project**: Updates project details in Firestore and Storage.
 * 4. **Responsive UI**: Displays project details in a table and opens a modal for editing.
 * 5. **Navigate Back**: Users can navigate back to the previous page.
 * 
 * Component Flow:
 * 1. **Data Fetching**: 
 *    - `fetchProyecto` fetches the project from Firestore's "proyectos" collection.
 * 2. **Edit Modal**:
 *    - Clicking "Edit" opens a modal with pre-filled fields from the selected project.
 * 3. **Update Workflow**:
 *    - If a new logo or client logo is uploaded, it is stored in Firebase Storage.
 *    - Updates are saved to Firestore via `updateDoc`.
 * 4. **UI Interaction**:
 *    - Editing opens the modal, and saving updates the project.
 *    - Users can cancel editing to close the modal without changes.
 */



import React, { useState, useEffect } from "react";
import { db, storage } from "../../../firebase_config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { FaArrowRight } from "react-icons/fa";
import { IoArrowBackCircle } from "react-icons/io5";

function Projects() {
  const [proyecto, setProyecto] = useState(null); // Proyecto existente
  const [isEditing, setIsEditing] = useState(false); // Para mostrar el modal de edición

  // Editable project fields
  const [nombre, setNombre] = useState("");
  const [obra, setObra] = useState("");
  const [tramo, setTramo] = useState("");
  const [contrato, setContrato] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoCliente, setLogoCliente] = useState(null);

  // Function: Fetch project data from Firestore
  const fetchProyecto = async () => {
    const proyectosCollection = collection(db, "proyectos");
    const proyectosSnapshot = await getDocs(proyectosCollection);

    if (!proyectosSnapshot.empty) {
      const doc = proyectosSnapshot.docs[0];
      setProyecto({ id: doc.id, ...doc.data() });
    }
  };

  // Load project data when the component mounts
  useEffect(() => {
    fetchProyecto();
  }, []);

  // Function: Open the edit modal and pre-fill fields with current project data
  const openEditModal = () => {
    setIsEditing(true);
    setNombre(proyecto.nombre);
    setObra(proyecto.obra);
    setTramo(proyecto.tramo);
    setContrato(proyecto.contrato);
    setLogo(null); // No se selecciona nuevo logo por defecto
    setLogoCliente(null); // No se selecciona nuevo logoCliente por defecto
  };

  // Function: Update project data in Firestore
  const actualizarProyecto = async () => {
    if (!nombre || !obra || !contrato) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      // Update project details in Firestore
      const projectRef = doc(db, "proyectos", proyecto.id);

      let updatedLogoURL = proyecto.logo;
      if (logo) {
        const logoRef = ref(storage, `logos/${logo.name}`);
        await uploadBytes(logoRef, logo);
        updatedLogoURL = await getDownloadURL(logoRef);
      }

      let updatedLogoClienteURL = proyecto.logoCliente || null;
      if (logoCliente) {
        const logoClienteRef = ref(storage, `logos_clientes/${logoCliente.name}`);
        await uploadBytes(logoClienteRef, logoCliente);
        updatedLogoClienteURL = await getDownloadURL(logoClienteRef);
      }
      // Update project details in Firestore
      await updateDoc(projectRef, {
        nombre,
        obra,
        tramo,
        contrato,
        logo: updatedLogoURL,
        logoCliente: updatedLogoClienteURL,
      });

      // Update local state with the updated project data
      setProyecto({ ...proyecto, nombre, obra, tramo, contrato, logo: updatedLogoURL, logoCliente: updatedLogoClienteURL });
      setIsEditing(false);
    } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
    }
  };
  // Function: Navigate back to the previous page
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); // Esto navega hacia atrás en la historia
  };

  return (
    <div className="container mx-auto p-8 min-h-screen">
      <div className="flex gap-2 items-center justify-between px-4 py-3 text-base">
        {/* Header Navigation */}
        <div className="flex gap-2 items-center">
          <GoHomeFill style={{ width: 15, height: 15, fill: "#d97706" }} />
          <Link to={"/admin"}>
            <h1 className="text-gray-500">Administración</h1>
          </Link>
          <FaArrowRight style={{ width: 12, height: 12, fill: "#d97706" }} />
          <Link to={"#"}>
            <h1 className="text-amber-500 font-medium">Información de proyectos</h1>
          </Link>
        </div>

        <div className="flex items-center">
          <button className="text-amber-600 text-3xl">
            <IoArrowBackCircle onClick={handleGoBack} />
          </button>
        </div>
      </div>
      {/* Project Details Table */}
      {proyecto ? (
        <div className="overflow-x-auto text-gray-500">
          <h2 className="text-lg font-bold text-gray-500 mb-4 mt-4">Proyecto</h2>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Obra</th>
                <th className="px-4 py-2">Tramo</th>
                <th className="px-4 py-2">Contrato</th>
                <th className="px-4 py-2">Logo</th>
                <th className="px-4 py-2">Logo Cliente</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">{proyecto.nombre}</td>
                <td className="px-4 py-2">{proyecto.obra}</td>
                <td className="px-4 py-2">{proyecto.tramo}</td>
                <td className="px-4 py-2">{proyecto.contrato}</td>
                <td className="px-4 py-2">
                  <img src={proyecto.logo} alt="Logo" className="w-16 h-16" />
                </td>
                <td className="px-4 py-2">
                  {proyecto.logoCliente && (
                    <img src={proyecto.logoCliente} alt="Logo Cliente" className="w-16 h-16" />
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={openEditModal}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Edit Modal */}
          {isEditing && (
            <div className="fixed inset-0 z-10 flex justify-center items-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg w-full max-w-lg">
                <h2 className="text-lg font-bold mb-4">Editar Proyecto</h2>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre"
                  className="block w-full mb-4 px-4 py-2 border rounded"
                />
                <input
                  type="text"
                  value={obra}
                  onChange={(e) => setObra(e.target.value)}
                  placeholder="Obra"
                  className="block w-full mb-4 px-4 py-2 border rounded"
                />
                <input
                  type="text"
                  value={tramo}
                  onChange={(e) => setTramo(e.target.value)}
                  placeholder="Tramo"
                  className="block w-full mb-4 px-4 py-2 border rounded"
                />
                <input
                  type="text"
                  value={contrato}
                  onChange={(e) => setContrato(e.target.value)}
                  placeholder="Contrato"
                  className="block w-full mb-4 px-4 py-2 border rounded"
                />
                <input
                  type="file"
                  onChange={(e) => setLogo(e.target.files[0])}
                  className="block w-full mb-4"
                />
                <input
                  type="file"
                  onChange={(e) => setLogoCliente(e.target.files[0])}
                  className="block w-full mb-4"
                />
                <div className="flex justify-end gap-4">
                  <button
                    onClick={actualizarProyecto}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Cargando proyecto...</p>
      )}
    </div>
  );
}

export default Projects;
