# 📋 Instrucciones para Integración del Iframe con Panel Externo

## 🎯 Objetivo
Permitir que los filtros externos (Indicador, Provincia, Carretera) controlen el contenido del iframe de indicadores mediante mensajes PostMessage.

---

## 🚨 Problema Actual
CORS (Cross-Origin Resource Sharing) está bloqueando el acceso directo al DOM del iframe desde la aplicación principal. Esto es **normal y esperado** por razones de seguridad.

**Errores actuales:**
```
⚠️ No se puede acceder al DOM del iframe (CORS)
⚠️ No se puede inyectar script (CORS)
⚠️ Error al disparar eventos: Blocked a frame with origin
```

---

## ✅ Solución: PostMessage API

La aplicación principal ya está enviando mensajes al iframe usando `postMessage`. El iframe necesita **escuchar y procesar** estos mensajes.

---

## 📨 Mensajes que Enviamos

### 1. **Cambio de Índice/Indicador**
```javascript
{
  type: 'CHANGE_INDEX',
  source: 'external_panel',
  data: {
    indicator: 'Índice General' | 'Índice Seguridad' | 'Índice Confort' | 'Índice Estructural',
    action: 'change_index',
    timestamp: 1234567890
  }
}
```

### 2. **Cambio de Provincia**
```javascript
{
  type: 'CHANGE_PROVINCE',
  source: 'external_panel',
  data: {
    province: 'Todas las provincias' | 'Madrid' | 'Barcelona' | ...,
    action: 'change_province',
    timestamp: 1234567890
  }
}
```

### 3. **Actualización General de Filtros**
```javascript
{
  type: 'FILTER_UPDATE',
  source: 'external_panel',
  data: {
    indicator: 'Índice General',
    province: 'Todas las provincias',
    road: 'Todas las carreteras',
    interoperability: false,
    timestamp: 1234567890
  }
}
```

### 4. **Formatos Alternativos (por compatibilidad)**
```javascript
// Formato simple
{
  action: 'updateFilters',
  indicator: 'Índice General',
  province: 'Madrid',
  road: 'A-1'
}

// Formato ArcGIS
{
  type: 'esriWebMap',
  filter: {
    indicator: 'Índice General',
    province: 'Madrid',
    road: 'A-1'
  }
}
```

---

## 💻 Código que Debe Agregarse al Iframe

### Opción 1: Listener Básico (Mínimo Requerido)

Agregar este código en el **archivo principal del iframe** (por ejemplo, en `index.html` o en el script principal):

```javascript
// Escuchar mensajes desde la aplicación principal
window.addEventListener('message', function(event) {
  console.log('📩 Mensaje recibido en iframe:', event.data);
  
  // Verificar que el mensaje viene de una fuente confiable
  // IMPORTANTE: En producción, verificar event.origin
  
  try {
    const message = event.data;
    
    // Procesar cambio de índice/indicador
    if (message.type === 'CHANGE_INDEX') {
      const indicator = message.data.indicator;
      console.log('🔄 Cambiando indicador a:', indicator);
      
      // AQUÍ: Implementar la lógica para cambiar el indicador
      // Por ejemplo:
      // - Actualizar el valor del dropdown de indicadores
      // - Llamar a la función que actualiza el mapa
      // - Aplicar el filtro correspondiente
      
      // Ejemplo (ajustar según su código):
      // document.getElementById('indicatorSelect').value = mapIndicatorValue(indicator);
      // updateMapWithIndicator(indicator);
    }
    
    // Procesar cambio de provincia
    if (message.type === 'CHANGE_PROVINCE') {
      const province = message.data.province;
      console.log('🔄 Cambiando provincia a:', province);
      
      // AQUÍ: Implementar la lógica para cambiar la provincia
      // Ejemplo:
      // document.getElementById('provinceSelect').value = province;
      // updateMapWithProvince(province);
    }
    
    // Procesar actualización general de filtros
    if (message.type === 'FILTER_UPDATE') {
      const filters = message.data;
      console.log('🔄 Actualizando todos los filtros:', filters);
      
      // AQUÍ: Implementar la lógica para aplicar todos los filtros
      // Ejemplo:
      // applyFilters(filters.indicator, filters.province, filters.road);
    }
    
    // Procesar formato simple
    if (message.action === 'updateFilters') {
      console.log('🔄 Formato simple recibido:', message);
      // Implementar lógica aquí
    }
    
  } catch (error) {
    console.error('❌ Error al procesar mensaje:', error);
  }
});

console.log('✅ Listener de mensajes PostMessage inicializado');
```

### Opción 2: Listener Avanzado (Con Mapeo de Valores)

Si los nombres de los indicadores/provincias en el iframe son diferentes a los del panel externo:

```javascript
// Mapeo de nombres externos a valores internos
const indicatorMapping = {
  'Índice General': 'general',
  'Índice Seguridad': 'seguridad',
  'Índice Confort': 'confort',
  'Índice Estructural': 'estructural'
};

const provinceMapping = {
  'Todas las provincias': 'all',
  'Madrid': 'madrid',
  'Barcelona': 'barcelona',
  // ... agregar todas las provincias
};

window.addEventListener('message', function(event) {
  console.log('📩 Mensaje recibido:', event.data);
  
  // Verificar origen en producción
  // if (event.origin !== 'https://tu-dominio.com') return;
  
  const message = event.data;
  
  if (message.type === 'CHANGE_INDEX') {
    const externalIndicator = message.data.indicator;
    const internalIndicator = indicatorMapping[externalIndicator] || externalIndicator;
    
    console.log(`🔄 Cambiando de "${externalIndicator}" a valor interno "${internalIndicator}"`);
    
    // Aplicar el cambio
    applyIndicatorFilter(internalIndicator);
  }
  
  if (message.type === 'CHANGE_PROVINCE') {
    const externalProvince = message.data.province;
    const internalProvince = provinceMapping[externalProvince] || externalProvince;
    
    console.log(`🔄 Cambiando de "${externalProvince}" a valor interno "${internalProvince}"`);
    
    // Aplicar el cambio
    applyProvinceFilter(internalProvince);
  }
});

// Funciones auxiliares (implementar según su código)
function applyIndicatorFilter(indicator) {
  // Ejemplo con ArcGIS Web AppBuilder
  // Si usan widgets, pueden acceder a ellos así:
  // var widget = dijit.byId('widgetId');
  // widget.setFilter(indicator);
  
  // O si usan select HTML:
  // document.getElementById('indicatorSelect').value = indicator;
  // document.getElementById('changeIndicatorButton').click();
}

function applyProvinceFilter(province) {
  // Implementar según su código
}
```

### Opción 3: Para ArcGIS Web AppBuilder Específicamente

Si el iframe es una aplicación de ArcGIS Web AppBuilder:

```javascript
// Esperar a que la aplicación de ArcGIS esté lista
require(['dojo/ready', 'jimu/WidgetManager'], function(ready, WidgetManager) {
  ready(function() {
    console.log('✅ ArcGIS Web AppBuilder listo');
    
    // Escuchar mensajes
    window.addEventListener('message', function(event) {
      const message = event.data;
      
      if (message.type === 'CHANGE_INDEX' || message.type === 'FILTER_UPDATE') {
        const indicator = message.data.indicator || message.data.data?.indicator;
        
        // Obtener el widget de filtros (ajustar el ID según su configuración)
        WidgetManager.getInstance().getWidgetsByName('Filter').then(function(widgets) {
          if (widgets && widgets.length > 0) {
            var filterWidget = widgets[0];
            // Aplicar el filtro
            filterWidget.applyFilter({
              indicator: indicator
            });
          }
        });
      }
    });
  });
});
```

---

## 🧪 Cómo Probar

### Paso 1: Agregar el código al iframe
1. Localizar el archivo principal del iframe (probablemente `index.html` o un archivo JS principal)
2. Agregar el código del listener antes del cierre de `</body>` o en el archivo JS principal
3. Guardar y recargar la aplicación

### Paso 2: Verificar que funciona
1. Abrir las DevTools del navegador (F12)
2. Ir a la pestaña "Console"
3. Debería ver: `✅ Listener de mensajes PostMessage inicializado`
4. En la aplicación principal, cambiar un filtro y hacer clic en "Cambiar Índice"
5. En la consola, debería ver: `📩 Mensaje recibido en iframe: {...}`

### Paso 3: Implementar la lógica
1. Una vez que confirmes que los mensajes se reciben
2. Implementar la lógica específica para actualizar el mapa/filtros
3. Probar que el mapa se actualiza correctamente

---

## 🔒 Seguridad en Producción

**IMPORTANTE:** En producción, siempre verificar el origen del mensaje:

```javascript
window.addEventListener('message', function(event) {
  // Verificar que el mensaje viene de tu dominio
  const allowedOrigins = [
    'https://tu-dominio.com',
    'https://app.tu-dominio.com',
    'http://localhost:5173' // Solo para desarrollo
  ];
  
  if (!allowedOrigins.includes(event.origin)) {
    console.warn('⚠️ Mensaje rechazado de origen no confiable:', event.origin);
    return;
  }
  
  // Procesar el mensaje...
});
```

---

## 📞 Contacto

Si necesitan ayuda para implementar esto o tienen preguntas sobre la estructura de los mensajes, contactar al equipo de desarrollo de la aplicación principal.

---

## 📚 Referencias

- [MDN: Window.postMessage()](https://developer.mozilla.org/es/docs/Web/API/Window/postMessage)
- [MDN: Listening to messages](https://developer.mozilla.org/es/docs/Web/API/Window/message_event)
- [ArcGIS Web AppBuilder Developer Guide](https://developers.arcgis.com/web-appbuilder/)

---

## ✅ Checklist de Implementación

- [ ] Agregar listener de mensajes al iframe
- [ ] Verificar que los mensajes se reciben en la consola
- [ ] Implementar mapeo de valores (si es necesario)
- [ ] Implementar lógica para actualizar indicador
- [ ] Implementar lógica para actualizar provincia
- [ ] Implementar lógica para actualizar carretera
- [ ] Probar todos los filtros
- [ ] Agregar verificación de origen para producción
- [ ] Documentar el código agregado
- [ ] Desplegar a producción

---

**Fecha de creación:** 2025-10-15  
**Versión:** 1.0  
**Estado:** Pendiente de implementación en el iframe

