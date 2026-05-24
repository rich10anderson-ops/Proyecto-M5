import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { ShoppingCart, User, Shield, Menu, X, LogOut, Package, Share2, Copy, Check } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const { totalItems, setCartOpen } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCartClick = () => {
    setCartOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <nav className="sticky top-0 z-40 bg-cyber-black/85 backdrop-blur-md border-b border-cyber-gray select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center">
            <Link
              to="/"
              className="font-display font-black uppercase text-base sm:text-lg tracking-widest text-white group flex items-center gap-1.5"
            >
              <span className="w-2.5 h-2.5 bg-cyber-cyan group-hover:animate-ping rounded-none" />
              NEON <span className="text-cyber-cyan neon-text-cyan">TECH</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 font-mono text-[10px] uppercase tracking-wider">
            <Link to="/products" className="text-cyber-light/80 hover:text-cyber-cyan transition-colors">
              Catálogo
            </Link>

            {user ? (
              <>
                <Link to="/profile" className="text-cyber-light/80 hover:text-cyber-cyan transition-colors flex items-center gap-1.5">
                  <User size={12} className="text-cyber-pink" /> Mi Perfil
                </Link>

                {isAdmin && (
                  <div className="relative group/admin py-4">
                    <span className="text-cyber-cyan hover:text-cyber-cyan transition-colors cursor-pointer flex items-center gap-1">
                      <Shield size={12} className="text-cyber-cyan animate-pulse" /> Panel Admin
                    </span>
                    {/* Dropdown menu */}
                    <div className="absolute top-14 left-0 w-44 bg-cyber-card border border-cyber-cyan p-2 space-y-1.5 hidden group-hover/admin:block shadow-[0_0_15px_rgba(0,240,255,0.15)] animate-slide-in">
                      <Link to="/admin" className="block p-2 hover:bg-cyber-cyan/15 text-white hover:text-cyber-cyan transition-colors">
                        Dashboard Métricas
                      </Link>
                      <Link to="/admin/products" className="block p-2 hover:bg-cyber-cyan/15 text-white hover:text-cyber-cyan transition-colors">
                        CRUD Catálogo
                      </Link>
                      <Link to="/admin/orders" className="block p-2 hover:bg-cyber-cyan/15 text-white hover:text-cyber-cyan transition-colors">
                        Gestión Órdenes
                      </Link>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="text-cyber-light/80 hover:text-cyber-cyan transition-colors">
                Ingresar
              </Link>
            )}
          </div>

          {/* Cart Icon & User controls */}
          <div className="flex items-center gap-4">
            
            {/* Share Dropdown Button */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-cyber-pink/50 hover:border-cyber-pink hover:bg-cyber-pink/5 text-cyber-pink font-mono text-[9px] uppercase tracking-widest transition-all duration-300 select-none cursor-pointer outline-none rounded-none"
              >
                <Share2 size={12} className="animate-pulse" />
                <span>Compartir</span>
              </button>
              
              {shareDropdownOpen && (
                <>
                  {/* Overlay to close the dropdown when clicking outside */}
                  <div
                    className="fixed inset-0 z-30 bg-transparent"
                    onClick={() => setShareDropdownOpen(false)}
                  />
                  {/* Dropdown content */}
                  <div className="absolute right-0 mt-2.5 w-52 bg-cyber-card border-2 border-cyber-pink p-3 space-y-2 z-40 shadow-[0_0_20px_rgba(255,0,127,0.25)] animate-slide-in font-mono text-[10px] rounded-none">
                    <div className="text-[8px] text-cyber-pink font-bold border-b border-cyber-pink/20 pb-1.5 tracking-widest uppercase">
                      COMPARTIR NODO_
                    </div>
                    
                    {/* GitHub */}
                    <a
                      href="https://github.com/rich10anderson-ops/Proyecto-M5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20"
                    >
                      <svg className="w-3.5 h-3.5 fill-current text-cyber-cyan" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                      </svg>
                      <span>GITHUB REPO</span>
                    </a>
                    
                    {/* WhatsApp */}
                    <a
                      href="https://api.whatsapp.com/send?text=Mira%20este%20incre%C3%ADble%20proyecto%20de%20streetwear%20y%20tecnolog%C3%ADa%20ne%C3%B3n%20%22Neon%20Tech%22%3A%20https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20"
                    >
                      <svg className="w-3.5 h-3.5 fill-current text-cyber-lime" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.446L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.407 1.46h.007c5.856 0 10.622-4.766 10.625-10.623.001-2.837-1.1-5.507-3.101-7.51-2.001-2.002-4.666-3.102-7.502-3.103-5.858 0-10.625 4.767-10.628 10.625-.001 1.986.518 3.926 1.504 5.642l-1.01 3.693 3.784-.992zm10.965-7.37c-.3-.15-1.774-.875-2.046-.975-.273-.1-.472-.15-.67.15-.198.3-.77.975-.943 1.173-.173.198-.347.223-.647.073-.3-.15-1.267-.467-2.414-1.492-.893-.797-1.496-1.78-1.673-2.08-.176-.3-.019-.462.13-.61.135-.133.3-.347.45-.52.15-.173.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.67-1.62-.92-2.2-.243-.585-.49-.507-.67-.516-.174-.008-.373-.01-.572-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.105 3.213 5.097 4.506.712.308 1.268.492 1.7.63.717.227 1.37.195 1.887.118.577-.087 1.774-.725 2.022-1.425.247-.7.247-1.3.173-1.425-.074-.124-.272-.2-.572-.35z"/>
                      </svg>
                      <span>WHATSAPP</span>
                    </a>

                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20"
                    >
                      <svg className="w-3.5 h-3.5 fill-current text-cyber-cyan" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>FACEBOOK</span>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20"
                    >
                      <svg className="w-3.5 h-3.5 text-cyber-pink fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                      <span>INSTAGRAM</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20"
                    >
                      <svg className="w-3.5 h-3.5 fill-current text-cyber-cyan" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span>LINKEDIN</span>
                    </a>

                    {/* Twitter/X */}
                    <a
                      href="https://twitter.com/intent/tweet?text=Mira%20este%20incre%C3%ADble%20proyecto%20de%20streetwear%20y%20tecnolog%C3%ADa%20ne%C3%B3n%20%22Neon%20Tech%22!%20https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20"
                    >
                      <svg className="w-3.5 h-3.5 fill-current text-cyber-cyan" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span>X / TWITTER</span>
                    </a>

                    {/* Copy Link */}
                    <button
                      onClick={handleCopyLink}
                      className="w-full flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20 bg-transparent text-left cursor-pointer outline-none font-mono text-[10px] rounded-none"
                    >
                      {copied ? (
                        <>
                          <Check size={12} className="text-cyber-lime animate-bounce" />
                          <span className="text-cyber-lime font-bold">¡COPIADO!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} className="text-cyber-cyan" />
                          <span>COPIAR ENLACE</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Cart trigger button */}
            <button
              onClick={handleCartClick}
              className="relative p-2 text-cyber-light hover:text-cyber-cyan border border-transparent hover:border-cyber-cyan/20 hover:bg-cyber-cyan/5 transition-all outline-none cursor-pointer"
            >
              <ShoppingCart size={16} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-cyber-pink text-white text-[8px] font-display font-black w-4.5 h-4.5 rounded-none flex items-center justify-center border border-cyber-black shadow-neon-pink animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="hidden md:flex p-2 text-cyber-light/40 hover:text-cyber-pink border border-transparent hover:border-cyber-pink/20 hover:bg-cyber-pink/5 transition-all outline-none cursor-pointer"
                title="Desconectar Terminal"
              >
                <LogOut size={16} />
              </button>
            )}

            {/* Mobile hamburger trigger */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="md:hidden p-2 text-cyber-light hover:text-cyber-cyan outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Accordion Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-cyber-gray bg-cyber-card py-4 px-6 space-y-4 font-mono text-xs uppercase tracking-wider">
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-cyber-light hover:text-cyber-cyan transition-colors py-1.5"
          >
            Catálogo
          </Link>

          {user ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-cyber-light hover:text-cyber-cyan transition-colors py-1.5 flex items-center gap-1.5"
              >
                <User size={14} className="text-cyber-pink" /> Mi Perfil
              </Link>

              {isAdmin && (
                <div className="space-y-2 pl-4 border-l border-cyber-cyan/35 py-1">
                  <div className="text-[10px] text-cyber-cyan/50 font-bold">NODO ADMINISTRACIÓN</div>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-white hover:text-cyber-cyan transition-colors py-1"
                  >
                    Dashboard Métricas
                  </Link>
                  <Link
                    to="/admin/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-white hover:text-cyber-cyan transition-colors py-1"
                  >
                    CRUD Catálogo
                  </Link>
                  <Link
                    to="/admin/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-white hover:text-cyber-cyan transition-colors py-1"
                  >
                    Gestión Órdenes
                  </Link>
                </div>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-cyber-pink hover:text-white transition-colors py-1.5 flex items-center gap-1.5 cursor-pointer outline-none bg-transparent"
              >
                <LogOut size={14} /> Desconectar
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-cyber-light hover:text-cyber-cyan transition-colors py-1.5"
            >
              Ingresar Terminal
            </Link>
          )}

          {/* Mobile Share Section */}
          <div className="space-y-2.5 pt-4 border-t border-cyber-gray/30">
            <div className="text-[9px] text-cyber-pink/70 font-bold tracking-widest flex items-center gap-1.5">
              <Share2 size={10} className="animate-pulse" />
              <span>COMPARTIR REDES</span>
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
              <a
                href="https://github.com/rich10anderson-ops/Proyecto-M5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 bg-cyber-black border border-cyber-gray/40 text-white hover:text-cyber-pink"
              >
                <svg className="w-3 h-3 fill-current text-cyber-cyan" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
                <span>GITHUB</span>
              </a>
              <a
                href="https://api.whatsapp.com/send?text=Mira%20este%20incre%C3%ADble%20proyecto%20de%20streetwear%20y%20tecnolog%C3%ADa%20ne%C3%B3n%20%22Neon%20Tech%22%3A%20https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 bg-cyber-black border border-cyber-gray/40 text-white hover:text-cyber-pink"
              >
                <svg className="w-3 h-3 fill-current text-cyber-lime" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.446L0 24zm6.59-4.846c1.6.95 3.488 1.459 5.407 1.46h.007c5.856 0 10.622-4.766 10.625-10.623.001-2.837-1.1-5.507-3.101-7.51-2.001-2.002-4.666-3.102-7.502-3.103-5.858 0-10.625 4.767-10.628 10.625-.001 1.986.518 3.926 1.504 5.642l-1.01 3.693 3.784-.992zm10.965-7.37c-.3-.15-1.774-.875-2.046-.975-.273-.1-.472-.15-.67.15-.198.3-.77.975-.943 1.173-.173.198-.347.223-.647.073-.3-.15-1.267-.467-2.414-1.492-.893-.797-1.496-1.78-1.673-2.08-.176-.3-.019-.462.13-.61.135-.133.3-.347.45-.52.15-.173.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.67-1.62-.92-2.2-.243-.585-.49-.507-.67-.516-.174-.008-.373-.01-.572-.01-.2 0-.525.075-.8.375-.275.3-1.05 1.025-1.05 2.5s1.07 2.9 1.22 3.1c.15.2 2.105 3.213 5.097 4.506.712.308 1.268.492 1.7.63.717.227 1.37.195 1.887.118.577-.087 1.774-.725 2.022-1.425.247-.7.247-1.3.173-1.425-.074-.124-.272-.2-.572-.35z"/>
                </svg>
                <span>WHATSAPP</span>
              </a>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 bg-cyber-black border border-cyber-gray/40 text-white hover:text-cyber-pink"
              >
                <svg className="w-3 h-3 fill-current text-cyber-cyan" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>FACEBOOK</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 bg-cyber-black border border-cyber-gray/40 text-white hover:text-cyber-pink"
              >
                <svg className="w-3 h-3 text-cyber-pink fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span>INSTAGRAM</span>
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 bg-cyber-black border border-cyber-gray/40 text-white hover:text-cyber-pink"
              >
                <svg className="w-3 h-3 fill-current text-cyber-cyan" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span>LINKEDIN</span>
              </a>
              <a
                href="https://twitter.com/intent/tweet?text=Mira%20este%20incre%C3%ADble%20proyecto%20de%20streetwear%20y%20tecnolog%C3%ADa%20ne%C3%B3n%20%22Neon%20Tech%22!%20https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 bg-cyber-black border border-cyber-gray/40 text-white hover:text-cyber-pink"
              >
                <svg className="w-3 h-3 fill-current text-cyber-cyan" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>TWITTER</span>
              </a>
            </div>
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 p-2 bg-cyber-black border border-cyber-pink/30 hover:border-cyber-pink text-white hover:text-cyber-pink font-mono text-[9px] cursor-pointer outline-none rounded-none"
            >
              {copied ? (
                <>
                  <Check size={10} className="text-cyber-lime animate-bounce" />
                  <span className="text-cyber-lime font-bold">¡ENLACE COPIADO!</span>
                </>
              ) : (
                <>
                  <Copy size={10} className="text-cyber-cyan" />
                  <span>COPIAR ENLACE AL PORTAPAPELES</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
