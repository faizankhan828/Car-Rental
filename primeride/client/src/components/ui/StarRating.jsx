import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, rating = 0, onChange, readonly = false, size = 'md', interactive = false }) {
  const [hovered, setHovered] = useState(null);
  const displayValue = value || rating;
  const isReadonly = readonly || !interactive;
  const px = { sm: 14, md: 18, lg: 24 }[size] || 18;
  const displayed = hovered ?? displayValue;

  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={isReadonly}
          onClick={() => !isReadonly && onChange?.(i)}
          onMouseEnter={() => !isReadonly && setHovered(i)}
          onMouseLeave={() => !isReadonly && setHovered(null)}
          className={`transition-transform ${isReadonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} focus:outline-none disabled:pointer-events-none`}
          aria-label={`${i} star${i !== 1 ? 's' : ''}`}
        >
          <Star
            size={px}
            className={`transition-colors ${i <= displayed ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'}`}
          />
        </button>
      ))}
    </div>
  );
}
