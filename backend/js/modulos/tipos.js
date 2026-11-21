import { iniciarCatalogo } from './catalogo.js';
export function abrir(contenido) {
  return iniciarCatalogo(contenido, {
    titulo: 'Tipos de contenido', ruta: '/tipos', campos: [
      { campo: 'nombre', etiqueta: 'Nombre del tipo', requerido: true },
      { campo: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea', completo: true }
    ], columnas: [{ campo: 'nombre', etiqueta: 'Nombre' }, { campo: 'descripcion', etiqueta: 'Descripción' }]
  });
}
