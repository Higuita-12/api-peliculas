import { consultar, guardar, eliminar } from '../api.js';
import { mostrarMensaje } from '../ui.js';

// Pantalla de películas y series en el panel de administración.
export async function abrir(contenido) {
  contenido.innerHTML = `
    <section class="panel">
      <h2>Películas y series</h2>
      <div id="aviso"></div>
      <form id="formMedia" class="formulario">
        <div class="campo"><label>Serial</label><input name="serial" required placeholder="Ej: MV-001"></div>
        <div class="campo"><label>Título</label><input name="titulo" required placeholder="Nombre de la película o serie"></div>
        <div class="campo"><label>Año de estreno</label><input name="anioEstreno" type="number" min="1888" max="2100" required placeholder="Ej: 2024"></div>
        <div class="campo completo"><label>URL de la imagen / portada</label><input name="imagen" type="url" placeholder="https://..."></div>
        <div class="campo completo"><label>Sinopsis</label><textarea name="sinopsis" placeholder="Breve resumen del argumento..."></textarea></div>
        <div class="campo"><label>Género</label><select name="genero" required></select></div>
        <div class="campo"><label>Director</label><select name="director" required></select></div>
        <div class="campo"><label>Productora</label><select name="productora" required></select></div>
        <div class="campo"><label>Tipo</label><select name="tipo" required></select></div>
        <div class="campo completo acciones-formulario">
          <button class="btn btn-primario" type="submit">Guardar película</button>
          <button class="btn btn-secundario" type="reset">Limpiar formulario</button>
        </div>
      </form>
      <div class="fila-busqueda-admin">
        <input id="buscar" placeholder="Buscar por título en el registro...">
        <button id="btnBuscar" class="btn btn-secundario">Buscar</button>
      </div>
      <div id="lista" class="peliculas-admin-grid"></div>
    </section>`;

  const form = contenido.querySelector('#formMedia');
  const aviso = contenido.querySelector('#aviso');
  const lista = contenido.querySelector('#lista');
  let editando = '';

  const catalogos = [
    ['genero', '/generos', 'nombre'],
    ['director', '/directores', 'nombres'],
    ['productora', '/productoras', 'nombre'],
    ['tipo', '/tipos', 'nombre'],
  ];

  try {
    for (const [campo, ruta, texto] of catalogos) {
      const resultado = await consultar(ruta);
      const activos = (resultado.datos || []).filter(x => !x.estado || x.estado === 'Activo');
      form.elements[campo].innerHTML =
        '<option value="">Seleccione una opción...</option>' +
        activos.map(x => `<option value="${x._id}">${x[texto]}</option>`).join('');
    }
  } catch (e) {
    mostrarMensaje(aviso, e.message, true);
  }

  async function cargar(filtro = '') {
    const resultado = await consultar(`/medias${filtro ? `?titulo=${encodeURIComponent(filtro)}` : ''}`);
    const datos = resultado.datos || [];
    lista.innerHTML = datos.length
      ? datos.map(p => `
          <article class="tarjeta-admin">
            <div class="tarjeta-admin-thumb">
              <img
                src="${p.imagen || ''}"
                alt="Portada de ${p.titulo}"
                onerror="this.onerror=null;this.src='https://placehold.co/300x420/121927/64748b?text=Sin+Portada'"
                loading="lazy"
              >
            </div>
            <div class="tarjeta-admin-cuerpo">
              <h3 class="tarjeta-admin-titulo">${p.titulo}</h3>
              <p class="tarjeta-admin-sub">Año: ${p.anioEstreno || 'N/D'};</p>
              <p class="tarjeta-admin-desc">${p.sinopsis || 'Sin descripción.'}</p>
              <div class="tarjeta-admin-meta">
                <p><strong>Director:</strong> ${p.director?.nombres || 'No asignado'}</p>
              </div>
              <div class="tarjeta-admin-botones">
                <button class="btn btn-secundario btn-sm" data-editar="${p._id}">Editar</button>
                <button class="btn btn-peligro btn-sm" data-eliminar="${p._id}">Eliminar</button>
              </div>
            </div>
          </article>`).join('')
      : '<p class="vacio">No hay películas registradas.</p>';
  }

  async function refrescarCatalogoPublico() {
    const listaCatalogo = document.getElementById('listaCatalogo');
    if (!listaCatalogo) return;
    try {
      const resultado = await consultar('/medias');
      const datos = resultado.datos || [];
      if (!datos.length) {
        listaCatalogo.innerHTML = '<p class="vacio">No se encontraron películas o series registradas.</p>';
        return;
      }
      listaCatalogo.innerHTML = datos.map(p => `
        <article class="tarjeta-pelicula">
          <div class="tarjeta-poster-wrap">
            <img
              src="${p.imagen || ''}"
              alt="Portada de ${p.titulo}"
              onerror="this.onerror=null;this.src='https://placehold.co/300x420/121927/64748b?text=Sin+Portada'"
              loading="lazy"
            >
          <div class="tarjeta-detalles">
          
            <p class="tarjeta-descripcion" title="${p.sinopsis || ''}">
              ${p.sinopsis || 'Sin descripción disponible.'}
            </p>
            <div class="tarjeta-datos">
              
              <p><strong>Director:</strong> ${p.director?.nombres || 'No asignado'}</p>
            </div>
          </div>
        </article>`).join('');
    } catch (_) { /* silencioso */ }
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form).entries());
    datos.anioEstreno = Number(datos.anioEstreno);
    try {
      await guardar('/medias', datos, editando);
      editando = '';
      form.reset();
      form.querySelector('button[type="submit"]').textContent = 'Guardar película';
      mostrarMensaje(aviso, 'Película guardada correctamente.');
      await cargar();
      await refrescarCatalogoPublico();
    } catch (e) {
      mostrarMensaje(aviso, e.message, true);
    }
  });

  contenido.querySelector('#btnBuscar').addEventListener('click', () => {
    cargar(contenido.querySelector('#buscar').value);
  });
  contenido.querySelector('#buscar').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      cargar(e.target.value);
    }
  });

  lista.addEventListener('click', async e => {
    const id = e.target.dataset.eliminar || e.target.dataset.editar;
    if (!id) return;

    if (e.target.dataset.eliminar) {
      if (confirm('¿Desea eliminar esta película del catálogo?')) {
        try {
          await eliminar('/medias', id);
          mostrarMensaje(aviso, 'Película eliminada correctamente.');
          await cargar();
          await refrescarCatalogoPublico();
        } catch (e) {
          mostrarMensaje(aviso, e.message, true);
        }
      }
    } else {
      try {
        const resultado = await consultar(`/medias/${id}`);
        const p = resultado.dato;
        editando = id;
        for (const campo of ['serial', 'titulo', 'sinopsis', 'imagen', 'anioEstreno']) {
          form.elements[campo].value = p[campo] ?? '';
        }
        for (const campo of ['genero', 'director', 'productora', 'tipo']) {
          form.elements[campo].value = p[campo]?._id || p[campo] || '';
        }
        form.querySelector('button[type="submit"]').textContent = 'Actualizar película';
        form.scrollIntoView({ behavior: 'smooth' });
      } catch (e) {
        mostrarMensaje(aviso, e.message, true);
      }
    }
  });

  try {
    await cargar();
  } catch (e) {
    mostrarMensaje(aviso, e.message, true);
  }
}
