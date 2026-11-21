import React, { useState, useEffect } from 'react';
import { consultar } from '../services/api.js';

export default function CatalogoPublico() {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const cargarCatalogo = async (filtro = '') => {
    setCargando(true);
    setError('');
    try {
      const resultado = await consultar(`/medias${filtro ? `?titulo=${encodeURIComponent(filtro)}` : ''}`);
      setPeliculas(resultado.datos || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCatalogo();

    // Event listener para refrescar cuando se modifica una película desde admin
    const onRefrescar = () => cargarCatalogo();
    window.addEventListener('catalogo-actualizado', onRefrescar);
    return () => window.removeEventListener('catalogo-actualizado', onRefrescar);
  }, []);

  const handleBuscar = () => {
    cargarCatalogo(busqueda.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBuscar();
    }
  };

  return (
    <section class="seccion" id="catalogo">
      <div class="contenedor-principal">
        <div class="seccion-cabecera">
          <div class="seccion-titulos">
            <h2 class="seccion-titulo">Catalogo  Disponibles</h2>
            <p class="seccion-subtitulo">Listado general  de lo que hay disponible </p>
          </div>
          <div class="buscador-caja">
            <input
              type="text"
              id="buscarCatalogo"
              class="buscador-input"
              placeholder="Buscar por título..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button id="btnBuscarCatalogo" class="btn btn-primario btn-buscar" onClick={handleBuscar}>
              Buscar
            </button>
          </div>
        </div>

        <div id="listaCatalogo" class="cuadricula-peliculas">
          {cargando && (
            <div class="estado-cargando">
              <div class="indicador-spinner"></div>
              <p>Ver catálogo...</p>
            </div>
          )}

          {!cargando && error && (
            <p class="vacio">Error al consultar el catálogo: {error}</p>
          )}

          {!cargando && !error && peliculas.length === 0 && (
            <p class="vacio">No se encontraron películas o series registradas.</p>
          )}

          {!cargando && !error && peliculas.map((p) => (
            <article class="tarjeta-pelicula" key={p._id}>
              <div class="tarjeta-poster-wrap">
                <img
                  src={p.imagen || ''}
                  alt={`Portada de ${p.titulo}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/300x420/121927/64748b?text=Sin+Portada';
                  }}
                  loading="lazy"
                />
                <div class="tarjeta-gradiente"></div>
                <span class="badge-anio">{p.anioEstreno || 'N/D'}</span>
              </div>
              <div class="tarjeta-detalles">
                <h3 class="tarjeta-titulo" title={p.titulo}>{p.titulo}</h3>
                <p class="tarjeta-meta">
                  <span class="meta-anio">{p.anioEstreno ? 'Año ' + p.anioEstreno : 'Año N/D'}</span>
                  <span class="meta-separador">&middot;</span>
                </p>
                <p class="tarjeta-descripcion" title={p.sinopsis || ''}>
                  {p.sinopsis || 'Sin descripción disponible.'}
                </p>
                <div class="tarjeta-datos">
                  <p><strong>Género:</strong> {p.genero?.nombre || 'No definido'}</p>
                  <p><strong>Director:</strong> {p.director?.nombres || 'No asignado'}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
