import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import isotipo from '../Assets/isotipo-creando-sonrisas.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const location = useLocation();
    const isHomeAtTop = location.pathname === '/' && !hasScrolled;
    const closeMenu = () => setIsMenuOpen(false);

    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 24);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${hasScrolled ? 'navbar-scrolled' : ''}${isHomeAtTop ? ' navbar-home-top' : ''}`}>
            <div className="logo-container">
                <Link to="/" onClick={closeMenu}>
                    <img className="brand-isotipo" src={isotipo} alt="" aria-hidden="true" />
                    <span className="brand-name">Creando Sonrisas</span>
                </Link>
            </div>

            <button
                type="button"
                className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
                aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-expanded={isMenuOpen}
                aria-controls="main-navigation"
                onClick={() => setIsMenuOpen((open) => !open)}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <ul id="main-navigation" className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                <li><Link to="/nosotros" onClick={closeMenu}>Nosotros</Link></li>
                <li><Link to="/proyectos" onClick={closeMenu}>Proyectos</Link></li>
                <li><Link to="/sumate" className="sumate-nav-link" onClick={closeMenu}>Sumate</Link></li>
                <li>
                    <Link to="/admin" className="admin-access-link" onClick={closeMenu} aria-label="Acceso al panel de administración" title="Acceso al panel">
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <circle cx="12" cy="8" r="3.5" />
                            <path d="M5.5 20c.5-4 2.7-6 6.5-6s6 2 6.5 6" />
                        </svg>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
