import React, { useState, useEffect } from 'react';
import { consultar, guardar, eliminar } from '../services/api.js';

export default function PeliculasCrud() {
  const [peliculas, setPeliculas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [editando, setEditando] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', error: false });
  const [busqueda, setBusqueda] = useState('');

  const estadoInicialForm = {
    serial: '',
    titulo: '',
    anioEstreno: '',
    imagen: '',
    sinopsis: '',
    genero: '',
    director: '',
    productora: '',
    tipo: ''
  };

  const [formData, setFormData] = useState(estadoInicialForm);

  // Cargar catálogos dependientes
  const cargarOpciones = async () => {
    try {
      const [resGen, resDir, resProd, resTip] = await Promise.all([
        consultar('/generos'),
        consultar('/directores'),
        consultar('/productoras'),
        consultar('/tipos')
      ]);

      setGeneros((resGen.datos || []).filter(x => !x.estado || x.estado === 'Activo'));
      setDirectores((resDir.datos || []).filter(x => !x.estado || x.estado === 'Activo'));
      setProductoras((resProd.datos || []).filter(x => !x.estado || x.estado === 'Activo'));
      setTipos((resTip.datos || []).filter(x => !x.estado || x.estado === 'Activo'));
    } catch (err) {
      setMensaje({ texto: err.message, error: true });
    }
  };

  const cargarPeliculas = async (filtro = '') => {
    try {
      const res = await consultar(`/medias${filtro ? `?titulo=${encodeURIComponent(filtro)}` : ''}`);
      setPeliculas(res.datos || []);
    } catch (err) {
      setMensaje({ texto: err.message, error: true });
    }
  };

  useEffect(() => {
    cargarOpciones();
    cargarPeliculas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const notificarActualizacionPublica = () => {
    window.dispatchEvent(new CustomEvent('catalogo-actualizado'));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datos = {
      ...formData,
      anioEstreno: Number(formData.anioEstreno)
    };

    try {
      await guardar('/medias', datos, editando);
      setEditando('');
      setFormData(estadoInicialForm);
      setMensaje({ texto: 'Película guardada correctamente.', error: false });
      await cargarPeliculas();
      notificarActualizacionPublica();
    } catch (err) {
      setMensaje({ texto: err.message, error: true });
    }
  };

  const handleReset = () => {
    setEditando('');
    setFormData(estadoInicialForm);
  };

  const handleBuscar = () => {
    cargarPeliculas(busqueda.trim());
  };

  const handleKeyDownBuscar = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBuscar();
    }
  };

  const handleEditar = async (id) => {
    try {
      const res = await consultar(`/medias/${id}`);
      const p = res.dato;
      setEditando(id);
      setFormData({
        serial: p.serial ?? '',
        titulo: p.titulo ?? '',
        anioEstreno: p.anioEstreno ?? '',
        imagen: p.imagen ?? '',
        sinopsis: p.sinopsis ?? '',
        genero: p.genero?._id || p.genero || '',
        director: p.director?._id || p.director || '',
        productora: p.productora?._id || p.productora || '',
        tipo: p.tipo?._id || p.tipo || ''
      });
      document.getElementById('formMedia')?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      setMensaje({ texto: err.message, error: true });
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Desea eliminar esta película del catálogo?')) {
      try {
        await eliminar('/medias', id);
        setMensaje({ texto: 'Película eliminada correctamente.', error: false });
        await cargarPeliculas();
        notificarActualizacionPublica();
      } catch (err) {
        setMensaje({ texto: err.message, error: true });
      }
    }
  };

  return (
    <section class="panel">
      <h2> Catalogo  </h2>
      <div id="aviso">
        {mensaje.texto && (
          <p class={`mensaje ${mensaje.error ? 'error' : ''}`}>{mensaje.texto}</p>
        )}
      </div>

      <form id="formMedia" class="formulario" onSubmit={handleSubmit} onReset={handleReset}>
        <div class="campo">
          <label>Serial</label>
          <input
            name="serial"
            required
            placeholder="Ej: MV-001"
            value={formData.serial}
            onChange={handleChange}
          />
        </div>
        <div class="campo">
          <label>Título</label>
          <input
            name="titulo"
            required
            placeholder="Nombre de la película o serie"
            value={formData.titulo}
            onChange={handleChange}
          />
        </div>
        <div class="campo">
          <label>Año de estreno</label>
          <input
            name="anioEstreno"
            type="number"
            min="1888"
            max="2100"
            required
            placeholder="Ej: 2024"
            value={formData.anioEstreno}
            onChange={handleChange}
          />
        </div>
        <div class="campo completo">
          <label>URL de la imagen / portada</label>
          <input
            name="imagen"
            type="url"
            placeholder="https://..."
            value={formData.imagen}
            onChange={handleChange}
          />
        </div>
        <div class="campo completo">
          <label>Sinopsis</label>
          <textarea
            name="sinopsis"
            placeholder="Breve resumen del argumento..."
            value={formData.sinopsis}
            onChange={handleChange}
          ></textarea>
        </div>
        <div class="campo">
          <label>Género</label>
          <select name="genero" required value={formData.genero} onChange={handleChange}>
            <option value="">Seleccione una opción...</option>
            {generos.map(g => (
              <option key={g._id} value={g._id}>{g.nombre}</option>
            ))}
          </select>
        </div>
        <div class="campo">
          <label>Director</label>
          <select name="director" required value={formData.director} onChange={handleChange}>
            <option value="">Seleccione una opción...</option>
            {directores.map(d => (
              <option key={d._id} value={d._id}>{d.nombres}</option>
            ))}
          </select>
        </div>
        <div class="campo">
          <label>Productora</label>
          <select name="productora" required value={formData.productora} onChange={handleChange}>
            <option value="">Seleccione una opción...</option>
            {productoras.map(p => (
              <option key={p._id} value={p._id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div class="campo">
          <label>Tipo</label>
          <select name="tipo" required value={formData.tipo} onChange={handleChange}>
            <option value="">Seleccione una opción...</option>
            {tipos.map(t => (
              <option key={t._id} value={t._id}>{t.nombre}</option>
            ))}
          </select>
        </div>
        <div class="campo completo acciones-formulario">
          <button class="btn btn-primario" type="submit">
            {editando ? 'Actualizar película' : 'Guardar película'}
          </button>
          <button class="btn btn-secundario" type="reset">
            Limpiar formulario
          </button>
        </div>
      </form>

      <div class="fila-busqueda-admin">
        <input
          id="buscar"
          placeholder="Buscar por título en el registro..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          onKeyDown={handleKeyDownBuscar}
        />
        <button id="btnBuscar" class="btn btn-secundario" onClick={handleBuscar} type="button">
          Buscar
        </button>
      </div>

      <div id="lista" class="peliculas-admin-grid">
        {peliculas.length > 0 ? (
          peliculas.map(p => (
            <article class="tarjeta-admin" key={p._id}>
              <div class="tarjeta-admin-thumb">
                <img
                  src={p.imagen || ''}
                  alt={`Portada de ${p.titulo}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/300x420/121927/64748b?text=Sin+Portada';
                  }}
                  loading="lazy"
                />
              </div>
              <div class="tarjeta-admin-cuerpo">
                <h3 class="tarjeta-admin-titulo">{p.titulo}</h3>
                <p class="tarjeta-admin-sub">Año: {p.anioEstreno || 'N/D'};</p>
                <p class="tarjeta-admin-desc">{p.sinopsis || 'Sin descripción.'}</p>
                <div class="tarjeta-admin-meta">
                  <p><strong>Director:</strong> {p.director?.nombres || 'No asignado'}</p>
                </div>
                <div class="tarjeta-admin-botones">
                  <button
                    type="button"
                    class="btn btn-secundario btn-sm"
                    onClick={() => handleEditar(p._id)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    class="btn btn-peligro btn-sm"
                    onClick={() => handleEliminar(p._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p class="vacio">No hay películas registradas.</p>
        )}
      </div>
    </section>
  );
}
