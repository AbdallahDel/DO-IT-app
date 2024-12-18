import React, { useState } from 'react';
import { Search } from 'lucide-react';

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full h-7 px-2 pl-8 rounded-md bg-neutral-900 text-neutral-300 
        border-none outline-none focus:ring-2 focus:ring-neutral-700 transition-all"
      />
      <Search 
        className="absolute left-2 text-neutral-500" 
        size={16} 
      />
    </div>
  );
}

export default SearchBar;