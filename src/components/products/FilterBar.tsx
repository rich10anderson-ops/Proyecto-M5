import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useDebounce } from '../../hooks/useDebounce';
import { Search, SlidersHorizontal, Laptop, Smartphone, Headphones, Tag, Layers, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { name: 'Todos', icon: Layers },
  { name: 'Laptops', icon: Laptop },
  { name: 'Smartphones', icon: Smartphone },
  { name: 'Audio', icon: Headphones },
  { name: 'Accesorios', icon: Tag },
  { name: 'Dispositivos Inteligentes', icon: Laptop },
  { name: 'Vestimenta', icon: Tag }
];

const FilterBar: React.FC = () => {
  const { category, changeCategory, changeSearch, refreshCatalog, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Trigger search update when debounced search term changes
  useEffect(() => {
    changeSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="bg-cyber-card border border-cyber-gray/40 p-4 md:p-6 mb-8 relative select-none">
      {/* Visual cyber layout borders */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-cyan"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyber-cyan"></div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        
        {/* Search Input with Debounce */}
        <div className="w-full md:max-w-xs relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyber-cyan/60">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-9 pr-4 py-2.5 bg-cyber-black border-2 border-cyber-gray focus:border-cyber-cyan focus:shadow-neon-cyan text-white text-xs outline-none transition-all duration-300 font-mono rounded-none"
          />
        </div>

        {/* Categories Pills - Horizontal scroll on mobile, flex wrap on desktop */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => changeCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 border text-[10px] font-display font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap cursor-pointer rounded-none outline-none ${
                  isSelected
                    ? 'border-cyber-cyan text-cyber-cyan bg-cyber-cyan/10 shadow-neon-cyan'
                    : 'border-cyber-gray text-cyber-light/60 hover:text-white hover:border-cyber-light'
                }`}
              >
                <Icon size={12} className={isSelected ? 'text-cyber-cyan' : 'text-cyber-light/40'} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Reload button for convenience */}
        <button
          onClick={refreshCatalog}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-cyber-gray hover:border-cyber-pink hover:text-cyber-pink hover:shadow-neon-pink text-white text-[10px] font-display font-black uppercase tracking-widest transition-all duration-300 cursor-pointer outline-none max-w-max self-end md:self-auto rounded-none"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin text-cyber-pink' : ''} />
          {loading ? 'CARGANDO...' : 'REFRESCAR'}
        </button>

      </div>
    </div>
  );
};

export default FilterBar;
