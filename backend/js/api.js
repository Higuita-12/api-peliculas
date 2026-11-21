// Este archivo centraliza las peticiones al backend.
const BASE = '/api';

export async function consultar(ruta) {
  const respuesta = await fetch(`${BASE}${ruta}`);
  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.mensaje || resultado.error || 'No se pudo consultar');
  return resultado;
}

export async function guardar(ruta, datos, id = '') {
  const respuesta = await fetch(`${BASE}${ruta}${id ? `/${id}` : ''}`, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.mensaje || resultado.error || 'No se pudo guardar');
  return resultado;
}

export async function eliminar(ruta, id) {
  const respuesta = await fetch(`${BASE}${ruta}/${id}`, { method: 'DELETE' });
  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.mensaje || resultado.error || 'No se pudo eliminar');
  return resultado;
}
