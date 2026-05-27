import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import RatingStars from './RatingStars';
import { ShoppingCart, Heart, ShieldAlert } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id, name, price, category, imageUrl, stock, averageRating = 5.0, totalReviews = 0 } = product;

  const isOutOfStock = stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!isOutOfStock) {
      addItem(product);
    }
  };

  return (
    <div className="urban-panel relative group flex flex-col justify-between select-none">
      {/* Decorative top glow border on hover */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyber-cyan via-cyber-pink to-cyber-lime transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out"></div>

      {/* Cyber Tag Badge */}
      <div className="absolute top-3 left-3 bg-cyber-black/80 border border-cyber-cyan/30 text-cyber-light/80 px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest z-10 rounded-full">
        {category}
      </div>

      {/* Stock alert badge */}
      {isOutOfStock ? (
        <div className="absolute top-3 right-3 bg-cyber-pink text-cyber-black px-2 py-0.5 text-[8px] font-display font-black uppercase tracking-widest z-10 flex items-center gap-1 shadow-neon-pink">
          <ShieldAlert size={10} /> AGOTADO
        </div>
      ) : stock <= 5 ? (
        <div className="absolute top-3 right-3 bg-cyber-yellow text-cyber-black px-2 py-0.5 text-[8px] font-display font-black uppercase tracking-widest z-10">
          ÚLTIMAS {stock} UNIDADES
        </div>
      ) : null}

      {/* Product Image Container */}
      <Link to={`/product/${id}`} className="block relative pt-[100%] overflow-hidden bg-cyber-black">
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
        />
        {/* Dark mask overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyber-black via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300"></div>
      </Link>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <RatingStars rating={averageRating} size={12} />
            <span className="text-[10px] text-cyber-light/45 font-mono">
              ({totalReviews})
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${id}`} className="block mb-2">
            <h3 className="font-display font-black text-sm uppercase text-white tracking-tight group-hover:text-cyber-cyan transition-colors duration-300 line-clamp-1">
              {name}
            </h3>
          </Link>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display font-black text-lg text-cyber-cyan neon-text-cyan">
              ${price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full flex items-center justify-center gap-2 py-2.5 font-display text-xs font-black uppercase tracking-widest transition-all duration-300 outline-none ${
            isOutOfStock
              ? 'border-2 border-cyber-gray text-cyber-light/20 cursor-not-allowed bg-transparent'
              : 'btn-neon-pink shadow-none hover:shadow-[0_0_15px_rgba(255,0,127,0.4)]'
          }`}
        >
          <ShoppingCart size={14} />
          {isOutOfStock ? 'AGOTADO' : 'AGREGAR AL CARRO'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
