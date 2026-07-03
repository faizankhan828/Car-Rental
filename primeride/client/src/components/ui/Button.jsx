import { forwardRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

const variants = {
  primary:   'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-sm',
  secondary: 'bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
  ghost:     'bg-transparent hover:bg-gray-100 text-gray-600 dark:hover:bg-gray-800 dark:text-gray-400',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  outline:   'bg-transparent border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
  dark:      'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
};

const sizes = {
  sm:  'px-4 py-2 text-sm',
  md:  'px-5 py-2.5 text-sm',
  lg:  'px-7 py-3 text-base',
  xl:  'px-9 py-3.5 text-base',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', isLoading = false, disabled = false,
    className = '', children, leftIcon, rightIcon, fullWidth = false, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-all duration-200 cursor-pointer select-none whitespace-nowrap
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {isLoading ? <LoadingSpinner size="sm" /> : leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
});

export default Button;
