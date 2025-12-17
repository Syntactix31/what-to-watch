import { Suspense } from 'react';
import SearchResultsPage from './SearchResultsPage';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading search...</div>}>
      <SearchResultsPage />
    </Suspense>
  );
}

