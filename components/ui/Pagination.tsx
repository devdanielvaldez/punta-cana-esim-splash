import {
    ChevronLeftIcon,
    ChevronRightIcon,
  } from '@heroicons/react/24/outline';
  
  interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  }
  
  export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
  }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
    const renderPageNumbers = () => {
      if (totalPages <= 7) {
        return pages.map((page) => (
          <PageButton
            key={page}
            page={page}
            isActive={page === currentPage}
            onClick={() => onPageChange(page)}
          />
        ));
      }
  
      const visiblePages = [];
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('...');
        visiblePages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        visiblePages.push(1);
        visiblePages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          visiblePages.push(i);
        }
      } else {
        visiblePages.push(1);
        visiblePages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          visiblePages.push(i);
        }
        visiblePages.push('...');
        visiblePages.push(totalPages);
      }
  
      return visiblePages.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-gray-400"
            >
              ...
            </span>
          );
        }
        return (
          <PageButton
            key={page}
            page={page as number}
            isActive={page === currentPage}
            onClick={() => onPageChange(page as number)}
          />
        );
      });
    };
  
    return (
      <div className="flex items-center justify-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
  
        {renderPageNumbers()}
  
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    );
  }
  
  interface PageButtonProps {
    page: number;
    isActive: boolean;
    onClick: () => void;
  }
  
  function PageButton({ page, isActive, onClick }: PageButtonProps) {
    return (
      <button
        onClick={onClick}
        className={`
          px-3 py-2 rounded-lg text-sm font-medium
          ${
            isActive
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
          }
        `}
      >
        {page}
      </button>
    );
  }