import { consultar, guardar, eliminar } from '../api.js';
import { mostrarMensaje } from '../ui.js';

// Pantalla común para administrar géneros, directores, productoras y tipos.
export async function iniciarCatalogo(contenido, config) {
  let registros = [];
  let editando = '';
  contenido.innerHTML = `
    <section class="panel">
      <h2>${config.titulo}</h2>
      <div id="aviso"></div>
      <form id="formCatalogo" class="formulario">
        ${config.campos.map(c => `
          <div class="campo ${c.completo ? 'completo' : ''}">
            <label>${c.etiqueta}</label>
            ${c.tipo === 'textarea'
              ? `<textarea name="${c.campo}" placeholder="Ingrese detalles opcionales..."></textarea>`
              : c.tipo === 'estado'
                ? `<select name="estado"><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select>`
                : `<input name="${c.campo}" ${c.requerido ? 'required' : ''} placeholder="${c.etiqueta}">`}
          </div>`).join('')}
        <div class="campo completo acciones-formulario">
          <button class="btn btn-primario" type="submit">Guardar</button>
          <button class="btn btn-secundario" type="reset" id="cancelar">Limpiar</button>
        </div>
      </form>
      <div class="tabla-seccion-titulo">
        <h3>Registros guardados</h3>
      </div>
      <div id="tabla" class="tabla-contenedor"></div>
    </section>`;

  const form = contenido.querySelector('#formCatalogo');
  const tabla = contenido.querySelector('#tabla');
  const aviso = contenido.querySelector('#aviso');

  async function cargar() {
    const resultado = await consultar(config.ruta);
    registros = resultado.datos || [];
    tabla.innerHTML = registros.length
      ? `<table class="tabla">
          <thead>
            <tr>
              ${config.columnas.map(x => `<th>${x.etiqueta}</th>`).join('')}
              <th style="width: 160px; text-align: right;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${registros.map(r => `
              <tr>
                ${config.columnas.map(x => `
                  <td>
                    ${x.campo === 'estado'
                      ? `<span class="badge-estado ${r.estado === 'Inactivo' ? 'inactivo' : 'activo'}">${r.estado || 'Activo'}</span>`
                      : (r[x.campo] ?? '')}
                  </td>`).join('')}
                <td class="acciones" style="text-align: right; justify-content: flex-end;">
                  <button class="btn btn-secundario btn-sm" data-editar="${r._id}">Editar</button>
                  <button class="btn btn-peligro btn-sm" data-eliminar="${r._id}">Eliminar</button>
                </td>
              </tr>`).join('')}
          </tbody>
        </table>`
      : '<p class="vacio">No hay registros almacenados en este módulo.</p>';
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form).entries());
    try {
      await guardar(config.ruta, datos, editando);
      editando = '';
      form.reset();
      form.querySelector('button[type="submit"]').textContent = 'Guardar';
      mostrarMensaje(aviso, 'Registro guardado correctamente.');
      await cargar();
    } catch (error) {
      mostrarMensaje(aviso, error.message, true);
    }
  });

  form.addEventListener('reset', () => {
    editando = '';
    form.querySelector('button[type="submit"]').textContent = 'Guardar';
  });

  tabla.addEventListener('click', async e => {
    const idEditar = e.target.dataset.editar;
    const idEliminar = e.target.dataset.eliminar;
    if (idEditar) {
      const item = registros.find(r => r._id === idEditar);
      editando = idEditar;
      for (const [campo, valor] of Object.entries(item)) {
        if (form.elements[campo]) form.elements[campo].value = valor ?? '';
      }
      form.querySelector('button[type="submit"]').textContent = 'Actualizar';
      form.scrollIntoView({ behavior: 'smooth' });
    }
    if (idEliminar && confirm('¿Desea eliminar este registro?')) {
      try {
        await eliminar(config.ruta, idEliminar);
        mostrarMensaje(aviso, 'Registro eliminado.');
        await cargar();
      } catch (error) {
        mostrarMensaje(aviso, error.message, true);
      }
    }
  });

  try {
    await cargar();
  } catch (error) {
    mostrarMensaje(aviso, error.message, true);
  }
}
