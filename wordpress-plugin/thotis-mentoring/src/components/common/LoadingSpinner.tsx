export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "th-h-4 th-w-4",
    md: "th-h-8 th-w-8",
    lg: "th-h-12 th-w-12",
  };

  return (
    <div className="th-flex th-items-center th-justify-center th-py-8">
      <div
        className={`${sizeClasses[size]} th-animate-spin th-rounded-full th-border-2 th-border-thotis-gray-200 th-border-t-thotis-blue`}
      />
    </div>
  );
}
