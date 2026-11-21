import React, { useState, useEffect } from 'react';
import { consultar, guardar, eliminar } from '../services/api.js';

export default function CatalogoCrud({ config }) {
  const [registros, setRegistros] = useState([]);
  const [formData, setFormData] = useState({});
  const [editando, setEditando] = useState('');
  const [mensaje, setMensaje] = useState({ texto: '', error: false });
  const [cargando, setCargando] = useState(false);

  // Inicializar formData según los campos
  const initFormData = () => {
    const inicial = {};
    config.campos.forEach((c) => {
      inicial[c.campo] = c.tipo === 'estado' ? 'Activo' : '';
    });
    return inicial;
  };

  const cargar = async () => {
    setCargando(true);
    try {
      const res = await consultar(config.ruta);
      setRegistros(res.datos || []);
    } catch (err) {
      setMensaje({ texto: err.message, error: true });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    setFormData(initFormData());
    setEditando('');
    setMensaje({ texto: '', error: false });
    cargar();
  }, [config.ruta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await guardar(config.ruta, formData, editando);
      setEditando('');
      setFormData(initFormData());
      setMensaje({ texto: 'Registro guardado correctamente.', error: false });
      await cargar();
    } catch (err) {
      setMensaje({ texto: err.message, error: true });
    }
  };

  const handleReset = () => {
    setEditando('');
    setFormData(initFormData());
  };

  const handleEditar = (item) => {
    setEditando(item._id);
    const nuevoForm = {};
    config.campos.forEach((c) => {
      nuevoForm[c.campo] = item[c.campo] ?? (c.tipo === 'estado' ? 'Activo' : '');
    });
    setFormData(nuevoForm);
    const formElem = document.getElementById('formCatalogo');
    formElem?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Desea eliminar este registro?')) {
      try {
        await eliminar(config.ruta, id);
        setMensaje({ texto: 'Registro eliminado correctamente.', error: false });
        await cargar();
      } catch (err) {
        setMensaje({ texto: err.message, error: true });
      }
    }
  };

  return (
    <section class="panel">
      <h2>{config.titulo}</h2>
      <div id="aviso">
        {mensaje.texto && (
          <p class={`mensaje ${mensaje.error ? 'error' : ''}`}>{mensaje.texto}</p>
        )}
      </div>

      <form id="formCatalogo" class="formulario" onSubmit={handleSubmit} onReset={handleReset}>
        {config.campos.map((c) => (
          <div class={`campo ${c.completo ? 'completo' : ''}`} key={c.campo}>
            <label>{c.etiqueta}</label>
            {c.tipo === 'textarea' ? (
              <textarea
                name={c.campo}
                value={formData[c.campo] || ''}
                onChange={handleChange}
                placeholder="Ingrese detalles opcionales..."
              />
            ) : c.tipo === 'estado' ? (
              <select
                name="estado"
                value={formData[c.campo] || 'Activo'}
                onChange={handleChange}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            ) : (
              <input
                name={c.campo}
                required={c.requerido}
                value={formData[c.campo] || ''}
                onChange={handleChange}
                placeholder={c.etiqueta}
              />
            )}
          </div>
        ))}

        <div class="campo completo acciones-formulario">
          <button class="btn btn-primario" type="submit">
            {editando ? 'Actualizar' : 'Guardar'}
          </button>
          <button class="btn btn-secundario" type="reset" id="cancelar">
            Limpiar
          </button>
        </div>
      </form>

      <div class="tabla-seccion-titulo">
        <h3>Registros guardados</h3>
      </div>

      <div id="tabla" class="tabla-contenedor">
        {cargando ? (
          <p class="cargando-texto">Cargando datos...</p>
        ) : registros.length > 0 ? (
          <table class="tabla">
            <thead>
              <tr>
                {config.columnas.map((x) => (
                  <th key={x.campo}>{x.etiqueta}</th>
                ))}
                <th style={{ width: '160px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r._id}>
                  {config.columnas.map((x) => (
                    <td key={x.campo}>
                      {x.campo === 'estado' ? (
                        <span class={`badge-estado ${r.estado === 'Inactivo' ? 'inactivo' : 'activo'}`}>
                          {r.estado || 'Activo'}
                        </span>
                      ) : (
                        r[x.campo] ?? ''
                      )}
                    </td>
                  ))}
                  <td class="acciones" style={{ textAlign: 'right', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      class="btn btn-secundario btn-sm"
                      onClick={() => handleEditar(r)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      class="btn btn-peligro btn-sm"
                      onClick={() => handleEliminar(r._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p class="vacio">No hay registros almacenados en este módulo.</p>
        )}
      </div>
    </section>
  );
}
