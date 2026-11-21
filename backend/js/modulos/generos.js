import { iniciarCatalogo } from './catalogo.js';

export function abrir(contenido) {
  return iniciarCatalogo(contenido, {
    titulo: 'Géneros', ruta: '/generos', campos: [
      { campo: 'nombre', etiqueta: 'Nombre', requerido: true },
      { campo: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea', completo: true },
      { campo: 'estado', etiqueta: 'Estado', tipo: 'estado' }
    ], columnas: [{ campo: 'nombre', etiqueta: 'Nombre' }, 
      { campo: 'descripcion', etiqueta: 'Descripción' }, 
      { campo: 'estado', etiqueta: 'Estado' }]
  });
}
