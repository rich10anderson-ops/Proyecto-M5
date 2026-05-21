import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useProducts } from '../../hooks/useProducts';
import RatingStars from './RatingStars';
import { getReviews } from '../../services/firestore';
import { Review } from '../../types';
import { MessageSquarePlus, MessageCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { user } = useAuth();
  const { addReviewToProduct } = useProducts();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<boolean>(false);

  const loadReviewsList = async () => {
    try {
      const data = await getReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadReviewsList();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg('Por favor escribe un comentario.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);

    try {
      await addReviewToProduct(productId, rating, comment);
      setComment('');
      setRating(5);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
      await loadReviewsList(); // Reload
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al enviar la calificación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-cyber-card border border-cyber-gray/40 p-6 md:p-8 select-none relative">
      <div className="absolute top-0 right-6 bg-cyber-pink text-cyber-black px-3 py-0.5 font-display text-[9px] font-black uppercase tracking-widest">
        REVIEWS // DATA_FEED
      </div>

      <h2 className="font-display font-black text-xl text-white uppercase mb-6 tracking-wider flex items-center gap-2">
        <MessageCircle className="text-cyber-pink" /> Calificaciones y Reseñas
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: List of Reviews */}
        <div className="lg:col-span-2 space-y-4 max-h-[500px] overflow-y-auto pr-2 no-scrollbar">
          {reviews.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-cyber-gray flex flex-col items-center justify-center">
              <MessageCircle size={32} className="text-cyber-light/20 mb-2" />
              <p className="text-xs uppercase tracking-widest text-cyber-light/40 font-mono">
                No hay calificaciones para este producto aún.
              </p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-cyber-black border border-cyber-gray/60 p-4 transition-all duration-300 hover:border-cyber-cyan/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-cyber-cyan uppercase font-bold tracking-wider">
                    {rev.userName}
                  </span>
                  <span className="text-[9px] text-cyber-light/40 font-mono">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-2">
                  <RatingStars rating={rev.rating} size={10} />
                </div>
                <p className="text-xs text-cyber-light/80 leading-relaxed font-sans">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Write a Review */}
        <div className="bg-cyber-black border border-cyber-gray p-6 self-start">
          <h3 className="font-display font-black text-sm uppercase text-white tracking-widest mb-4 flex items-center gap-2">
            <MessageSquarePlus size={16} className="text-cyber-cyan animate-pulse" /> Escribir Reseña
          </h3>

          {!user ? (
            <div className="text-center py-6">
              <AlertTriangle className="mx-auto text-cyber-yellow mb-3 h-8 w-8 drop-shadow-[0_0_5px_rgba(255,230,0,0.4)]" />
              <p className="text-xs text-cyber-light/70 uppercase tracking-wider mb-4 leading-relaxed font-mono">
                Debes estar conectado para calificar este producto.
              </p>
              <Link to="/login" className="block w-full text-center btn-neon-cyan py-2 text-[10px]">
                INICIAR SESIÓN
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating Selector */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-cyber-light/50 font-mono mb-2">
                  Calificación (Estrellas)
                </label>
                <RatingStars
                  rating={rating}
                  interactive={true}
                  onRatingChange={(r) => setRating(r)}
                  size={20}
                />
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-cyber-light/50 font-mono mb-2">
                  Comentario
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Comparte tu experiencia con el producto..."
                  className="w-full p-3 bg-cyber-black border-2 border-cyber-gray focus:border-cyber-pink focus:shadow-neon-pink text-white text-xs outline-none transition-all duration-300 font-sans rounded-none resize-none"
                />
              </div>

              {/* Status messages */}
              {errorMsg && (
                <div className="text-[10px] text-cyber-pink font-mono uppercase bg-cyber-pink/5 border-l-2 border-cyber-pink p-2">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="text-[10px] text-cyber-lime font-mono uppercase bg-cyber-lime/5 border-l-2 border-cyber-lime p-2 shadow-neon-lime">
                  ✓ ¡Reseña agregada con éxito!
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-neon-pink py-2.5 text-[10px] tracking-widest"
              >
                {loading ? 'ENVIANDO...' : 'PUBLICAR RESEÑA'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ReviewSection;
