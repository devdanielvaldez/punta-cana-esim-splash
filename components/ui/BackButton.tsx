import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

interface BackButtonProps {
  href?: string;
  onClick?: () => void;
}

export default function BackButton({ href, onClick }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center p-2
        rounded-lg bg-gray-700/50 hover:bg-gray-700
        text-gray-300 hover:text-white transition-colors"
      aria-label="Volver"
    >
      <ArrowLeftIcon className="h-5 w-5" />
    </button>
  );
}