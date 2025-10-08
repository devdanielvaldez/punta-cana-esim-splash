interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'busy' | 'away';
    className?: string;
  }
  
  export default function Avatar({
    src,
    alt = '',
    name,
    size = 'md',
    status,
    className = '',
  }: AvatarProps) {
    const sizes = {
      xs: 'h-6 w-6 text-xs',
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10 text-base',
      lg: 'h-12 w-12 text-lg',
      xl: 'h-16 w-16 text-xl',
    };
    
    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-500',
      busy: 'bg-red-500',
      away: 'bg-yellow-500',
    };
    
    // Generate initials from name
    const getInitials = (name?: string) => {
      if (!name) return '?';
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    };
  
    return (
      <div className={`relative inline-block ${className}`}>
        {src ? (
          <img
            src={src}
            alt={alt}
            className={`${sizes[size]} rounded-full object-cover border border-gray-700`}
          />
        ) : (
          <div
            className={`
              ${sizes[size]} rounded-full flex items-center justify-center
              bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium
            `}
          >
            {getInitials(name)}
          </div>
        )}
        
        {status && (
          <span 
            className={`
              absolute bottom-0 right-0 block rounded-full
              ${statusColors[status]} ring-2 ring-gray-800
              ${size === 'xs' ? 'h-1.5 w-1.5' : 'h-2.5 w-2.5'}
            `}
          />
        )}
      </div>
    );
  }