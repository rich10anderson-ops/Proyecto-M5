import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  size = 16,
  interactive = false,
  onRatingChange
}) => {
  const [hoverRating, setHoverRating] = React.useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const handleStarClick = (clickedIndex: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(clickedIndex + 1);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (interactive) setHoverRating(null);
  };

  return (
    <div className="flex items-center gap-1.5">
      {[...Array(5)].map((_, i) => {
        const starNum = i + 1;
        const filled = starNum <= displayRating;
        const half = !filled && starNum - 0.5 <= displayRating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => handleStarClick(i)}
            onMouseEnter={() => handleMouseEnter(i)}
            onMouseLeave={handleMouseLeave}
            className={`transition-transform duration-200 focus:outline-none ${
              interactive ? 'hover:scale-125 cursor-pointer' : 'cursor-default'
            }`}
          >
            <Star
              size={size}
              className={`${
                filled
                  ? 'fill-cyber-yellow text-cyber-yellow drop-shadow-[0_0_4px_rgba(255,230,0,0.6)]'
                  : half
                  ? 'fill-cyber-yellow/50 text-cyber-yellow/85 drop-shadow-[0_0_2px_rgba(255,230,0,0.4)]'
                  : 'text-cyber-gray fill-transparent'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
