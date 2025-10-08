import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XCircleIcon,
  } from '@heroicons/react/24/outline';
  
  interface AlertProps {
    type?: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    onClose?: () => void;
  }
  
  export default function Alert({
    type = 'info',
    title,
    message,
    onClose,
  }: AlertProps) {
    const types = {
      success: {
        icon: CheckCircleIcon,
        bg: 'bg-green-400/20',
        border: 'border-green-500',
        text: 'text-green-400',
      },
      error: {
        icon: XCircleIcon,
        bg: 'bg-red-400/20',
        border: 'border-red-500',
        text: 'text-red-400',
      },
      warning: {
        icon: ExclamationTriangleIcon,
        bg: 'bg-yellow-400/20',
        border: 'border-yellow-500',
        text: 'text-yellow-400',
      },
      info: {
        icon: InformationCircleIcon,
        bg: 'bg-blue-400/20',
        border: 'border-blue-500',
        text: 'text-blue-400',
      },
    };
  
    const Icon = types[type].icon;
  
    return (
      <div
        className={`
          rounded-lg border ${types[type].border} ${types[type].bg}
          p-4 flex items-start
        `}
      >
        <Icon className={`h-5 w-5 ${types[type].text} mt-0.5`} />
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${types[type].text}`}>
            {title}
          </h3>
          {message && (
            <div className="mt-1 text-sm text-gray-300">
              {message}
            </div>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            className={`
              ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5
              ${types[type].text} hover:bg-gray-700/50
              transition-colors duration-200
            `}
            onClick={onClose}
          >
            <span className="sr-only">Cerrar</span>
            <XCircleIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    );
  }