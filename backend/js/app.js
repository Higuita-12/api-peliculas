import * as peliculas from './modulos/peliculas.js';
import * as generos from './modulos/generos.js';
import * as directores from './modulos/directores.js';
import * as productoras from './modulos/productoras.js';
import * as tipos from './modulos/tipos.js';
import { consultar } from './api.js';

// Módulos de administración
const modulos = { peliculas, generos, directores, productoras, tipos };
const contenido = document.querySelector('#contenido');
const tabBtns = document.querySelectorAll('.tab-btn');

async function abrirModulo(nombre) {
  tabBtns.forEach(b => b.classList.toggle('activo', b.dataset.modulo === nombre));
  contenido.innerHTML = '<p class="cargando-texto">Cargando módulo...</p>';
  try {
    await modulos[nombre].abrir(contenido);
  } catch (e) {
    contenido.innerHTML = `<p class="mensaje error">${e.message}</p>`;
  }
}

tabBtns.forEach(b => b.addEventListener('click', () => abrirModulo(b.dataset.modulo)));
abrirModulo('peliculas');

// Botón "Panel Admin" de la barra superior
document.getElementById('btnIrAdmin')?.addEventListener('click', () => {
  document.getElementById('admin')?.scrollIntoView({ behavior: 'smooth' });
});

// Catálogo público
const listaCatalogo = document.getElementById('listaCatalogo');
const buscarCatalogo = document.getElementById('buscarCatalogo');
const btnBuscarCatalogo = document.getElementById('btnBuscarCatalogo');

async function cargarCatalogoPublico(filtro = '') {
  listaCatalogo.innerHTML = `
    <div class="estado-cargando">
      <div class="indicador-spinner"></div>
      <p>Cargando catálogo...</p>
    </div>`;
  try {
    const resultado = await consultar(`/medias${filtro ? `?titulo=${encodeURIComponent(filtro)}` : ''}`);
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
          <div class="tarjeta-gradiente"></div>
          <span class="badge-anio">${p.anioEstreno || 'N/D'}</span>
        </div>
        <div class="tarjeta-detalles">
          <h3 class="tarjeta-titulo" title="${p.titulo}">${p.titulo}</h3>
          <p class="tarjeta-meta">
            <span class="meta-anio">${p.anioEstreno ? 'Año ' + p.anioEstreno : 'Año N/D'}</span>
            <span class="meta-separador">&middot;</span>
          </p>
          <p class="tarjeta-descripcion" title="${p.sinopsis || ''}">
            ${p.sinopsis || 'Sin descripción disponible.'}
          </p>
          <div class="tarjeta-datos">
            <p><strong>Género:</strong> ${p.genero?.nombre || 'No definido'}</p>
            <p><strong>Director:</strong> ${p.director?.nombres || 'No asignado'}</p>
          </div>
        </div>
      </article>`).join('');
  } catch (e) {
    listaCatalogo.innerHTML = `<p class="vacio">Error al consultar el catálogo: ${e.message}</p>`;
  }
}

btnBuscarCatalogo?.addEventListener('click', () => cargarCatalogoPublico(buscarCatalogo.value.trim()));
buscarCatalogo?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    cargarCatalogoPublico(e.target.value.trim());
  }
});

// Carga inicial
cargarCatalogoPublico();

// Resaltar navegación al hacer scroll
const secciones = document.querySelectorAll('header[id], section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('activo-link', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

secciones.forEach(s => observer.observe(s));
