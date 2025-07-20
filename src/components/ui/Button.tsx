import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          // 기본 스타일
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          
          // 크기별 스타일
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          
          // 변형별 스타일
          {
            'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-soft': variant === 'primary',
            'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500': variant === 'secondary',
            'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500 shadow-soft': variant === 'accent',
            'border border-secondary-300 bg-white text-secondary-700 hover:bg-secondary-50 focus:ring-secondary-500': variant === 'outline',
            'text-secondary-700 hover:bg-secondary-100 focus:ring-secondary-500': variant === 'ghost',
          },
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button }; 