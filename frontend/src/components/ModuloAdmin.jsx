import React, { useState } from 'react';
import PeliculasCrud from './PeliculasCrud.jsx';
import CatalogoCrud from './CatalogoCrud.jsx';

const configuracionesModulos = {
  generos: {
    titulo: 'Géneros',
    ruta: '/generos',
    campos: [
      { campo: 'nombre', etiqueta: 'Nombre', requerido: true },
      { campo: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea', completo: true },
      { campo: 'estado', etiqueta: 'Estado', tipo: 'estado' }
    ],
    columnas: [
      { campo: 'nombre', etiqueta: 'Nombre' },
      { campo: 'descripcion', etiqueta: 'Descripción' },
      { campo: 'estado', etiqueta: 'Estado' }
    ]
  },
  directores: {
    titulo: 'Directores',
    ruta: '/directores',
    campos: [
      { campo: 'nombres', etiqueta: 'Nombres', requerido: true },
      { campo: 'estado', etiqueta: 'Estado', tipo: 'estado' }
    ],
    columnas: [
      { campo: 'nombres', etiqueta: 'Nombres' },
      { campo: 'estado', etiqueta: 'Estado' }
    ]
  },
  productoras: {
    titulo: 'Productoras',
    ruta: '/productoras',
    campos: [
      { campo: 'nombre', etiqueta: 'Nombre', requerido: true },
      { campo: 'slogan', etiqueta: 'Slogan' },
      { campo: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea', completo: true },
      { campo: 'estado', etiqueta: 'Estado', tipo: 'estado' }
    ],
    columnas: [
      { campo: 'nombre', etiqueta: 'Nombre' },
      { campo: 'slogan', etiqueta: 'Slogan' },
      { campo: 'estado', etiqueta: 'Estado' }
    ]
  },
  tipos: {
    titulo: 'Tipos de contenido',
    ruta: '/tipos',
    campos: [
      { campo: 'nombre', etiqueta: 'Nombre del tipo', requerido: true },
      { campo: 'descripcion', etiqueta: 'Descripción', tipo: 'textarea', completo: true }
    ],
    columnas: [
      { campo: 'nombre', etiqueta: 'Nombre' },
      { campo: 'descripcion', etiqueta: 'Descripción' }
    ]
  }
};

export default function ModuloAdmin() {
  const [moduloActivo, setModuloActivo] = useState('peliculas');

  return (
    <section class="seccion seccion-admin" id="admin">
      <div class="contenedor-principal">
        <div class="seccion-cabecera">
          <div class="seccion-titulos">
            <h2 class="seccion-titulo">Módulo de Administración</h2>
            <p class="seccion-subtitulo">Gestión de catálogo, directores, productoras, géneros y Tipos</p>
          </div>
        </div>

        <div class="pestañas-admin">
          <button
            class={`tab-btn ${moduloActivo === 'peliculas' ? 'activo' : ''}`}
            onClick={() => setModuloActivo('peliculas')}
          >
            Catalogo
          </button>
          <button
            class={`tab-btn ${moduloActivo === 'generos' ? 'activo' : ''}`}
            onClick={() => setModuloActivo('generos')}
          >
            Géneros
          </button>
          <button
            class={`tab-btn ${moduloActivo === 'directores' ? 'activo' : ''}`}
            onClick={() => setModuloActivo('directores')}
          >
            Directores
          </button>
          <button
            class={`tab-btn ${moduloActivo === 'productoras' ? 'activo' : ''}`}
            onClick={() => setModuloActivo('productoras')}
          >
            Productoras
          </button>
          <button
            class={`tab-btn ${moduloActivo === 'tipos' ? 'activo' : ''}`}
            onClick={() => setModuloActivo('tipos')}
          >
            Tipos
          </button>
        </div>

        {/* Contenedor dinámico del módulo activo */}
        <main id="contenido" class="admin-panel">
          {moduloActivo === 'peliculas' ? (
            <PeliculasCrud />
          ) : (
            <CatalogoCrud config={configuracionesModulos[moduloActivo]} key={moduloActivo} />
          )}
        </main>
      </div>
    </section>
  );
}
