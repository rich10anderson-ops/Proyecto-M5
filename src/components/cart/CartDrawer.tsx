import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    totalAmount,
    totalItems,
    isCartOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Overlay backdrop with glassmorphism */}
      <div
        className="absolute inset-0 bg-cyber-black/75 backdrop-blur-sm transition-opacity duration-500"
        onClick={() => setCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Panel body with Street Neon styling */}
        <div className="w-screen max-w-md bg-cyber-card border-l border-cyber-cyan/30 flex flex-col justify-between shadow-2xl relative animate-slide-in">
          {/* CRT scanlines effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

          {/* Drawer Header */}
          <div className="p-6 border-b border-cyber-gray flex items-center justify-between z-10 bg-cyber-black/55 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-cyber-cyan animate-pulse" size={20} />
              <h2 className="font-display font-black uppercase text-white tracking-widest text-lg">
                Cargamento <span className="text-cyber-cyan">({totalItems})</span>
              </h2>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="text-cyber-light hover:text-cyber-pink transition-colors duration-300 p-1 border border-transparent hover:border-cyber-pink/40 bg-transparent hover:bg-cyber-pink/10 rounded-none cursor-pointer outline-none"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar z-10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-16 h-16 rounded-none border border-cyber-pink/50 flex items-center justify-center text-cyber-pink shadow-[0_0_15px_rgba(255,0,127,0.2)] animate-pulse">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase tracking-wider text-white">
                    COMPARTIMENTO VACÍO
                  </h3>
                  <p className="text-xs text-cyber-light/50 font-mono mt-2 uppercase">
                    No has cargado artefactos tecnológicos a tu orden.
                  </p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="btn-neon-cyan mt-4 text-[10px]"
                >
                  EXPLORAR CATÁLOGO
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="group relative bg-cyber-black border border-cyber-gray/60 p-3 flex gap-4 transition-all duration-300 hover:border-cyber-pink/40 hover:shadow-[0_0_10px_rgba(255,0,127,0.1)]"
                >
                  {/* Decorative tag for tech design */}
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyber-pink/30 group-hover:border-cyber-pink" />
                  
                  {/* Image */}
                  <div className="w-20 h-20 bg-cyber-card border border-cyber-gray overflow-hidden flex-shrink-0 relative">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-display font-black text-xs uppercase tracking-tight text-white line-clamp-1 group-hover:text-cyber-cyan transition-colors">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-cyber-light/40 font-mono uppercase mt-0.5">
                        Categoría: {item.product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Price */}
                      <span className="font-display font-black text-sm text-cyber-cyan neon-text-cyan">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-cyber-gray">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 text-cyber-light hover:text-cyber-pink hover:bg-cyber-pink/10 transition-colors cursor-pointer outline-none font-bold text-xs"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="px-2 text-xs font-mono text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="px-2 py-1 text-cyber-light hover:text-cyber-cyan hover:bg-cyber-cyan/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer outline-none font-bold text-xs"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-cyber-light/40 hover:text-cyber-pink transition-colors p-1 border border-transparent hover:border-cyber-pink/20 hover:bg-cyber-pink/5 cursor-pointer outline-none"
                          title="Eliminar ítem"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-cyber-gray bg-cyber-black/55 backdrop-blur-md z-10 space-y-4">
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-cyber-light/60">
                  <span>SUBTOTAL:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-cyber-light/60">
                  <span>ENVÍO CRIPTO:</span>
                  <span className="text-cyber-lime">GRATIS</span>
                </div>
                <div className="border-t border-cyber-gray/40 my-2 pt-2 flex justify-between font-display font-black text-sm uppercase">
                  <span className="text-white">TOTAL ORDEN:</span>
                  <span className="text-cyber-cyan neon-text-cyan">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => clearCart()}
                  className="btn-neon-dark py-2 flex items-center justify-center gap-1.5 text-[10px]"
                >
                  <Trash2 size={12} /> LIMPIAR
                </button>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="btn-neon-pink py-2 text-center block text-[10px] shadow-none hover:shadow-[0_0_15px_rgba(255,0,127,0.4)]"
                >
                  CHECKOUT
                </Link>
              </div>

              <Link
                to="/cart"
                onClick={() => setCartOpen(false)}
                className="block text-center text-[10px] font-mono text-cyber-light/40 hover:text-cyber-cyan transition-colors uppercase tracking-widest pt-2"
              >
                VER DETALLE COMPLETO DEL CARRO
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
