import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { ShoppingCart, User, Shield, Menu, X, LogOut, Package, Share2, Github, Twitter, Linkedin, Facebook, Instagram, Copy, Check, MessageCircle } from 'lucide-react';

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
                      <Github size={12} className="text-cyber-cyan" />
                      <span>GITHUB REPO</span>
                    </a>
                    
                    {/* WhatsApp */}
                    <a
                      href="https://api.whatsapp.com/send?text=Mira%20este%20incre%C3%ADble%20proyecto%20de%20streetwear%20y%20tecnolog%C3%ADa%20ne%C3%B3n%20%22Neon%20Tech%22%3A%20https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20"
                    >
                      <MessageCircle size={12} className="text-cyber-lime" />
                      <span>WHATSAPP</span>
                    </a>

                    {/* Facebook */}
                    <a
                      href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20"
                    >
                      <Facebook size={12} className="text-cyber-cyan" />
                      <span>FACEBOOK</span>
                    </a>

                    {/* Instagram */}
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20"
                    >
                      <Instagram size={12} className="text-cyber-pink" />
                      <span>INSTAGRAM</span>
                    </a>

                    {/* LinkedIn */}
                    <a
                      href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20"
                    >
                      <Linkedin size={12} className="text-cyber-cyan" />
                      <span>LINKEDIN</span>
                    </a>

                    {/* Twitter/X */}
                    <a
                      href="https://twitter.com/intent/tweet?text=Mira%20este%20incre%C3%ADble%20proyecto%20de%20streetwear%20y%20tecnolog%C3%ADa%20ne%C3%B3n%20%22Neon%20Tech%22!%20https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 p-1.5 hover:bg-cyber-pink/15 text-white hover:text-cyber-pink transition-all border border-transparent hover:border-cyber-pink/20"
                    >
                      <Twitter size={12} className="text-cyber-cyan" />
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
                <Github size={10} className="text-cyber-cyan" /> GITHUB
              </a>
              <a
                href="https://api.whatsapp.com/send?text=Mira%20este%20incre%C3%ADble%20proyecto%20de%20streetwear%20y%20tecnolog%C3%ADa%20ne%C3%B3n%20%22Neon%20Tech%22%3A%20https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 bg-cyber-black border border-cyber-gray/40 text-white hover:text-cyber-pink"
              >
                <MessageCircle size={10} className="text-cyber-lime" /> WHATSAPP
              </a>
              <a
                href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 bg-cyber-black border border-cyber-gray/40 text-white hover:text-cyber-pink"
              >
                <Facebook size={10} className="text-cyber-cyan" /> FACEBOOK
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 bg-cyber-black border border-cyber-gray/40 text-white hover:text-cyber-pink"
              >
                <Instagram size={10} className="text-cyber-pink" /> INSTAGRAM
              </a>
              <a
                href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 bg-cyber-black border border-cyber-gray/40 text-white hover:text-cyber-pink"
              >
                <Linkedin size={10} className="text-cyber-cyan" /> LINKEDIN
              </a>
              <a
                href="https://twitter.com/intent/tweet?text=Mira%20este%20incre%C3%ADble%20proyecto%20de%20streetwear%20y%20tecnolog%C3%ADa%20ne%C3%B3n%20%22Neon%20Tech%22!%20https%3A%2F%2Fgithub.com%2Frich10anderson-ops%2FProyecto-M5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 p-2 bg-cyber-black border border-cyber-gray/40 text-white hover:text-cyber-pink"
              >
                <Twitter size={10} className="text-cyber-cyan" /> TWITTER
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
