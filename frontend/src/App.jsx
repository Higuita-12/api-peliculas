import React, { useEffect, useState } from 'react';
import CatalogoPublico from './components/CatalogoPublico.jsx';
import ModuloAdmin from './components/ModuloAdmin.jsx';

export default function App() {
  const [seccionActiva, setSeccionActiva] = useState('inicio');

  useEffect(() => {
    const handleScroll = () => {
      const secciones = ['inicio', 'catalogo', 'admin'];
      const scrollPos = window.scrollY + 200;

      for (const id of secciones) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setSeccionActiva(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToAdmin = () => {
    document.getElementById('admin')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav class="navbar" id="navbarPrincipal">
        <div class="navbar__contenedor">
          <a href="#inicio" class="navbar__marca">
            <span class="marca-texto">CINE <strong>IU</strong></span>
            <span class="marca-sub">DIGITAL</span>
          </a>
          <ul class="navbar__menu">
            <li>
              <a href="#inicio" class={`nav-link ${seccionActiva === 'inicio' ? 'activo-link' : ''}`}>
                Inicio
              </a>
            </li>
            <li>
              <a href="#catalogo" class={`nav-link ${seccionActiva === 'catalogo' ? 'activo-link' : ''}`}>
                Catálogo
              </a>
            </li>
          </ul>
          <div class="navbar__acciones">
            <button class="btn btn-admin-nav" id="btnIrAdmin" onClick={scrollToAdmin}>
              Administradar
            </button>
          </div>
        </div>
      </nav>

      <header class="hero" id="inicio">
        <div class="hero__fondo"></div>
        <div class="hero__contenedor">
          <h1 class="hero__titulo">Descubre el mejor Cine</h1>
          <p class="hero__descripcion">
            Explora nuestro Catalogo completo.
          </p>
          <div class="hero__botones">
            <a href="#catalogo" class="btn btn-primario">Explorar Catálogo</a>
          </div>
        </div>
      </header>

      <CatalogoPublico />

      <ModuloAdmin />

      <footer class="pie-pagina">
        <div class="contenedor-principal pie-contenido">
          <div class="pie-marca">
            <span class="pie-logo">CINE <strong>IU DIGITAL</strong></span>
          </div>
        </div>
      </footer>
    </>
  );
}
