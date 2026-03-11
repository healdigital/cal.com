import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const sizeClasses = { sm: "th-text-base", md: "th-text-xl", lg: "th-text-2xl" };

  return (
    <div className="th-flex th-gap-0.5" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${sizeClasses[size]} ${readonly ? "th-cursor-default" : "th-cursor-pointer"} th-bg-transparent th-border-none th-p-0 th-transition-colors`}
          onMouseEnter={() => !readonly && setHovered(star)}
          onClick={() => onChange?.(star)}>
          <span className={(hovered || value) >= star ? "th-text-yellow-400" : "th-text-thotis-gray-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
