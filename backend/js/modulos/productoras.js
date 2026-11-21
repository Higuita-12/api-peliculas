import { iniciarCatalogo } from './catalogo.js';
export function abrir(contenido) {
  return iniciarCatalogo(contenido, { titulo: 'Productoras', ruta: '/productoras', campos: [
    { campo: 'nombre', etiqueta: 'Nombre', requerido: true },
    { campo: 'slogan', etiqueta: 'Slogan' },
    { campo: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea', completo: true },
    { campo: 'estado', etiqueta: 'Estado', tipo: 'estado' }
  ], columnas: [{ campo: 'nombre', etiqueta: 'Nombre' }, { campo: 'slogan', 
    etiqueta: 'Slogan' }, { campo: 'estado', etiqueta: 'Estado' }] });
}
