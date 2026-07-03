export default function LoadingSpinner({ size = 'md', fullScreen = false, fullPage = false }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  const spinner = (
    <div
      className={`${sizes[size]} rounded-full border-gray-200 dark:border-gray-700 border-t-blue-600 animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen || fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
