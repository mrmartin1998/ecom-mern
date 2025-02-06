import React, { useState } from 'react';

const FilterSidebar = ({ onFilter, onReset }) => {
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockStatus, setStockStatus] = useState('all'); // all, inStock, outOfStock
  const [category, setCategory] = useState('');

  const categories = ['all', 'electronics', 'clothing', 'books', 'home', 'other'];

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStockStatusChange = (e) => {
    setStockStatus(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({
      category: category === 'all' ? '' : category,
      priceRange: {
        min: priceRange.min ? Number(priceRange.min) : null,
        max: priceRange.max ? Number(priceRange.max) : null
      },
      stockStatus
    });
  };

  const handleReset = () => {
    setPriceRange({ min: '', max: '' });
    setStockStatus('all');
    setCategory('all');
    onReset();
  };

  return (
    <div className="bg-base-100 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Add Category Filter */}
        <div className="space-y-2">
          <h4 className="font-medium">Category</h4>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="select select-bordered select-sm w-full"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <h4 className="font-medium">Price Range</h4>
          <div className="flex gap-2">
            <input
              type="number"
              name="min"
              placeholder="Min"
              value={priceRange.min}
              onChange={handlePriceChange}
              className="input input-bordered input-sm w-full"
              min="0"
            />
            <input
              type="number"
              name="max"
              placeholder="Max"
              value={priceRange.max}
              onChange={handlePriceChange}
              className="input input-bordered input-sm w-full"
              min="0"
            />
          </div>
        </div>

        {/* Stock Status */}
        <div className="space-y-2">
          <h4 className="font-medium">Stock Status</h4>
          <select
            value={stockStatus}
            onChange={handleStockStatusChange}
            className="select select-bordered select-sm w-full"
          >
            <option value="all">All Items</option>
            <option value="inStock">In Stock</option>
            <option value="outOfStock">Out of Stock</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button 
            type="submit" 
            className="btn btn-primary btn-sm w-full"
          >
            Apply Filters
          </button>
          <button 
            type="button"
            onClick={handleReset}
            className="btn btn-ghost btn-sm w-full"
          >
            Reset Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterSidebar;
