interface SkeletonProps {
    variant?: 'text' | 'rectangle' | 'circle';
    width?: string | number;
    height?: string | number;
    className?: string;
  }
  
  export default function Skeleton({
    variant = 'text',
    width,
    height,
    className = '',
  }: SkeletonProps) {
    const baseStyles = 'animate-pulse bg-gray-700';
    
    const variantStyles = {
      text: 'h-4 rounded',
      rectangle: 'rounded-md',
      circle: 'rounded-full',
    };
    
    const styles = {
      width: width ? (typeof width === 'number' ? `${width}px` : width) : 'auto',
      height: height ? (typeof height === 'number' ? `${height}px` : height) : variant === 'text' ? 'auto' : '100px',
    };
    
    return (
      <div
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        style={styles}
      />
    );
  }