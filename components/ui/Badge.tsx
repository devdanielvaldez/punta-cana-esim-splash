interface BadgeProps {
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    className?: string;
  }
  
  export default function Badge({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
  }: BadgeProps) {
    const variants = {
      primary: 'bg-blue-400/20 text-blue-400',
      success: 'bg-green-400/20 text-green-400',
      warning: 'bg-yellow-400/20 text-yellow-400',
      danger: 'bg-red-400/20 text-red-400',
      info: 'bg-purple-400/20 text-purple-400',
    };
  
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };
  
    return (
      <span
        className={`
          inline-flex items-center font-medium rounded-full
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
      >
        {children}
      </span>
    );
  }