import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
  homeHref?: string;
}

export default function Breadcrumbs({
  items,
  homeHref = '/app/dashboard',
}: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href={homeHref}
            className="inline-flex items-center text-sm font-medium text-gray-400 
              hover:text-white transition-colors"
          >
            <HomeIcon className="mr-2 w-4 h-4" />
            Inicio
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="ml-1 text-sm font-medium text-gray-400 
                    hover:text-white transition-colors md:ml-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="ml-1 text-sm font-medium text-white md:ml-2">
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}