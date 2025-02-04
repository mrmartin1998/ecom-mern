import React, { useState } from 'react';
import ProductGrid from '@/components/features/products/ProductGrid';
import SearchBar from '@/components/features/products/SearchBar';
import FilterSidebar from '@/components/features/products/FilterSidebar';
import { useProducts } from '@/hooks/useProducts';

const ProductsPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    sort: '',
    page: 1,
    limit: 12
  });

  // Use React Query hook
  const { data, isLoading, error } = useProducts({
    search: searchTerm,
    ...filters
  });

  // Handle search
  const handleSearch = async (term) => {
    setSearchTerm(term);
  };

  // Handle filter
  const handleFilter = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };

  // Handle filter reset
  const handleFilterReset = () => {
    setFilters({
      category: '',
      sort: '',
      page: 1,
      limit: 12
    });
    setSearchTerm('');
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Header with Search and Filter Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="w-full md:w-64">
            <SearchBar onSearch={handleSearch} />
          </div>
          <button 
            className="btn btn-square md:hidden"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden md:block w-64">
          <FilterSidebar onFilter={handleFilter} onReset={handleFilterReset} />
        </div>

        {/* Filter Drawer - Mobile */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${isFilterOpen ? 'block' : 'hidden'}`} onClick={() => setIsFilterOpen(false)} />
        <div className={`fixed inset-y-0 left-0 w-80 bg-base-100 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4">
            <FilterSidebar onFilter={handleFilter} onReset={handleFilterReset} />
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
          <ProductGrid 
            products={data?.data || []}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
