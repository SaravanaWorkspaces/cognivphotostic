'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const createUrl = (page: number) => {
    const url = new URL(baseUrl, 'http://localhost:3000');
    if (page > 1) {
      url.searchParams.set('page', page.toString());
    }
    return url.pathname + (url.search ? url.search : '');
  };

  return (
    <nav className="flex items-center justify-between gap-4 py-8 border-t border-gray-200">
      {prevPage > 0 ? (
        <Link
          href={createUrl(prevPage)}
          className="px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded"
        >
          ← Previous
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-medium text-gray-300">
          ← Previous
        </span>
      )}

      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>

      {nextPage <= totalPages ? (
        <Link
          href={createUrl(nextPage)}
          className="px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded"
        >
          Next →
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-medium text-gray-300">
          Next →
        </span>
      )}
    </nav>
  );
}
