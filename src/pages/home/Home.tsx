import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import FilterBar from '../../components/products/FilterBar';
import ProductCard from '../../components/products/ProductCard';
import Spinner from '../../components/common/Spinner';
import { Cpu, ShoppingBag, Eye, Heart, HelpCircle, Layers, Sparkles } from 'lucide-react';

export const Home: React.FC = () => {
  const { products, loading, error, hasMore, loadNextPage, totalProducts } = useProducts();

  return (
    <div className="min-h-screen bg-cyber-black pb-24 cyber-grid select-none relative">
      {/* CRT Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-10" />

      {/* HERO SECTION */}
      <header className="relative overflow-hidden bg-cyber-dark border-b border-cyber-gray py-16 md:py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Background glow effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyber-pink/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-3xl mx-auto space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-pink/10 border border-cyber-pink/30 text-cyber-pink font-mono text-[9px] uppercase tracking-widest animate-pulse">
            <Sparkles size={10} /> Street Neon Tech Collection v2.0
          </div>
          
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl uppercase text-white tracking-widest leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            STREET <span className="text-cyber-cyan neon-text-cyan">NEON</span>
          </h1>
          
          <p className="font-mono text-xs md:text-sm text-cyber-light/60 uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
            Equipamiento urbano y tecnología futurista de alto impacto. Diseñado para resistir la ciudad. Destaca con resplandores neón.
          </p>

          <div className="pt-4 flex items-center justify-center gap-4">
            <button
              onClick={() => {
                const element = document.getElementById('catalog-anchor');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-neon-cyan px-8 py-3 text-xs"
            >
              CONECTAR EQUIPO
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CATALOG */}
      <main id="catalog-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 z-10 relative">
        {/* Filter & Search Bar */}
        <FilterBar />

        {/* Catalog Metadata Info */}
        <div className="flex justify-between items-center mb-6 font-mono text-[10px] text-cyber-light/45 uppercase tracking-widest border-b border-cyber-gray/30 pb-3">
          <span>CATÁLOGO PRINCIPAL // REGISTRO</span>
          <span>
            {loading && products.length === 0 ? 'CONECTANDO...' : `${products.length} / ${totalProducts} PRODUCTOS`}
          </span>
        </div>

        {/* Errors Block */}
        {error && (
          <div className="bg-cyber-card border border-cyber-pink/55 p-4 text-center max-w-md mx-auto my-12 space-y-4">
            <div className="text-cyber-pink text-xs uppercase font-mono">{error}</div>
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 && !loading ? (
          <div className="bg-cyber-card border border-cyber-gray p-12 text-center max-w-md mx-auto my-12 space-y-4">
            <Cpu className="text-cyber-light/30 mx-auto animate-spin" size={30} />
            <h3 className="font-display font-black text-sm uppercase text-white tracking-widest">
              SIN RESULTADOS DE BÚSQUEDA
            </h3>
            <p className="text-[10px] font-mono text-cyber-light/40 uppercase">
              No se han encontrado módulos que coincidan con los filtros de red aplicados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {/* Skeletons on initial loading */}
            {loading && products.length === 0 && (
              Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="bg-cyber-card border border-cyber-gray/30 p-4 space-y-4 animate-pulse">
                  <div className="aspect-square bg-cyber-gray/50 w-full rounded-none" />
                  <div className="space-y-2">
                    <div className="h-3 bg-cyber-gray/50 w-1/3 rounded-none" />
                    <div className="h-4 bg-cyber-gray/50 w-3/4 rounded-none" />
                    <div className="h-4 bg-cyber-gray/50 w-1/2 rounded-none" />
                  </div>
                  <div className="h-10 bg-cyber-gray/50 w-full rounded-none" />
                </div>
              ))
            )}
          </div>
        )}

        {/* Load More Pagination Button */}
        {hasMore && (
          <div className="flex justify-center mt-12 pt-6 border-t border-cyber-gray/30">
            <button
              onClick={loadNextPage}
              disabled={loading}
              className="btn-neon-cyan py-3 px-8 text-xs flex items-center justify-center gap-2 shadow-none hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>CONECTANDO MÓDULOS...</span>
                </>
              ) : (
                'CARGAR MÁS ARTEFACTOS'
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
