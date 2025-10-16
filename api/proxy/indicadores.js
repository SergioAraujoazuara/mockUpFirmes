export default async function handler(req, res) {
  // Configurar headers para permitir iframe
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  try {
    // Hacer fetch al contenido HTTP original
    const response = await fetch('http://212.128.194.13/gestionfirmes/indicadores/');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Obtener el contenido HTML
    let html = await response.text();
    
    // Agregar meta tag para permitir contenido mixto (solo para desarrollo)
    html = html.replace('<head>', '<head><meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">');
    
    // Devolver el contenido HTML sin modificaciones
    res.status(200).send(html);
    
  } catch (error) {
    console.error('Error fetching content:', error);
    
    // Devolver una página de error amigable
    res.status(500).send(`
      <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
          <h2>⚠️ Error al cargar el contenido</h2>
          <p>No se pudo conectar con el servidor de indicadores.</p>
          <p>Por favor, inténtalo más tarde.</p>
        </body>
      </html>
    `);
  }
}
