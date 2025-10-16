import React from 'react';
import { FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';

const ProductionMessage = ({ title, directUrl }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
      <div className="flex items-center justify-center mb-4">
        <FaInfoCircle className="text-blue-500 text-2xl mr-3" />
        <h3 className="text-lg font-semibold text-blue-800">{title}</h3>
      </div>
      
      <p className="text-blue-700 mb-4">
        Esta funcionalidad está disponible solo en la versión de desarrollo local.
      </p>
      
      <p className="text-sm text-blue-600 mb-4">
        Para acceder a esta herramienta, puedes usar el enlace directo:
      </p>
      
      <a
        href={directUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaExternalLinkAlt className="text-sm" />
        Abrir en nueva ventana
      </a>
    </div>
  );
};

export default ProductionMessage;
