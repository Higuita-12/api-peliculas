// Funciones pequeñas que comparten todos los módulos.
export function mostrarMensaje(contenedor, texto, error = false) {
  contenedor.innerHTML = `<p class="mensaje ${error ? 'error' : ''}">${texto}</p>`;
}
export function idDe(item) { return item._id; }
export function nombreDe(item) { return item.nombre || item.nombres || ''; }
