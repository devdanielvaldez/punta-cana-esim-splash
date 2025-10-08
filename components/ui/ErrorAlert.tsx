import { XCircleIcon } from '@heroicons/react/24/outline';

interface ErrorAlertProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorAlert({
  title,
  message,
  onRetry,
}: ErrorAlertProps) {
  return (
    <div className="rounded-md bg-red-400/10 border border-red-500 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-400">{title}</h3>
          <div className="mt-2 text-sm text-gray-300">
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent
                  text-sm leading-4 font-medium rounded-md text-red-300 bg-red-400/20
                  hover:bg-red-400/30 focus:outline-none"
              >
                Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}