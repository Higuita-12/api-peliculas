import { iniciarCatalogo } from './catalogo.js';
export function abrir(contenido) {

  return iniciarCatalogo(contenido, {
    titulo: 'Directores', ruta: '/directores', campos: [
      { campo: 'nombres', etiqueta: 'Nombres', requerido: true },
      { campo: 'estado', etiqueta: 'Estado', tipo: 'estado' }
    ], columnas: [{ campo: 'nombres', etiqueta: 'Nombres' },
       { campo: 'estado', etiqueta: 'Estado' }]
  });
}
