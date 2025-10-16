export default async function handler(req, res) {
  // Si es una petición de recurso (CSS, JS, imagen), hacer proxy directo
  if (req.query.resource) {
    try {
      // Intentar diferentes rutas posibles para el recurso
      const possiblePaths = [
        `http://212.128.194.13/gestionfirmes/indicadores/${req.query.resource}`,
        `http://212.128.194.13/gestionfirmes/indicadores/resources/${req.query.resource}`,
        `http://212.128.194.13/gestionfirmes/indicadores/css/${req.query.resource}`,
        `http://212.128.194.13/gestionfirmes/indicadores/js/${req.query.resource}`,
        `http://212.128.194.13/gestionfirmes/indicadores/images/${req.query.resource}`,
        `http://212.128.194.13/gestionfirmes/${req.query.resource}`,
        `http://212.128.194.13/${req.query.resource}`
      ];
      
      let response = null;
      for (const url of possiblePaths) {
        try {
          response = await fetch(url);
          if (response.ok) {
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!response || !response.ok) {
        console.log(`Resource not found: ${req.query.resource}`);
        return res.status(404).send('Resource not found');
      }
      
      const content = await response.text();
      const contentType = response.headers.get('content-type') || 'text/plain';
      
      res.setHeader('Content-Type', contentType);
      res.status(200).send(content);
      return;
    } catch (error) {
      console.error('Error loading resource:', error);
      return res.status(500).send('Error loading resource');
    }
  }
  
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
    
    // Reescribir las rutas para que usen nuestro proxy
    const proxyBase = '/api/proxy/indicadores?resource=';
    
    // Reemplazar rutas relativas por nuestro proxy
    html = html.replace(/src="\.\/([^"]+)"/g, `src="${proxyBase}$1"`);
    html = html.replace(/href="\.\/([^"]+)"/g, `href="${proxyBase}$1"`);
    html = html.replace(/url\(\.\/([^)]+)\)/g, `url(${proxyBase}$1)`);
    
    // También reemplazar rutas absolutas del servidor
    html = html.replace(/src="http:\/\/212\.128\.194\.13\/gestionfirmes\/indicadores\/([^"]+)"/g, `src="${proxyBase}$1"`);
    html = html.replace(/href="http:\/\/212\.128\.194\.13\/gestionfirmes\/indicadores\/([^"]+)"/g, `href="${proxyBase}$1"`);
    
    // Devolver el contenido HTML modificado
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
