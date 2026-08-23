import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { AISommelier } from './components/AISommelier';
import { CartDrawer } from './components/CartDrawer';
import { N8nAutomationsModal } from './components/N8nAutomationsModal';
import { Footer } from './components/Footer';
import type { Perfume, CartItem, PerfumeCategory } from './types';
import { getPerfumes } from './lib/supabase';
import { Bot, Filter } from 'lucide-react';

export function App() {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter & Search State
  const [selectedCategory, setSelectedCategory] = useState<PerfumeCategory | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<'todos' | 'hombre' | 'mujer' | 'unisex'>('todos');

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modals State
  const [selectedPerfumeModal, setSelectedPerfumeModal] = useState<Perfume | null>(null);
  const [isSommelierOpen, setIsSommelierOpen] = useState<boolean>(false);
  const [isN8nModalOpen, setIsN8nModalOpen] = useState<boolean>(false);

  // Load Perfumes Data from Supabase / Fallback
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getPerfumes();
      setPerfumes(data);
      setLoading(false);
    }
    loadData();
  }, []);

  // Filter Logic
  const filteredPerfumes = useMemo(() => {
    return perfumes.filter((p) => {
      // Category Filter
      if (selectedCategory !== 'todos' && p.category !== selectedCategory) {
        return false;
      }
      // Gender Filter
      if (genderFilter !== 'todos' && p.gender !== genderFilter) {
        return false;
      }
      // Search Query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        const matchAccord = p.accords.some((a) => a.toLowerCase().includes(query));
        const matchNote = p.pyramid.topNotes.some((n) => n.toLowerCase().includes(query)) ||
                          p.pyramid.baseNotes.some((n) => n.toLowerCase().includes(query));
        return matchName || matchBrand || matchAccord || matchNote;
      }
      return true;
    });
  }, [perfumes, selectedCategory, genderFilter, searchQuery]);

  // Cart Handlers
  const handleAddToCart = (perfume: Perfume, selectedMl?: number) => {
    const ml = selectedMl || perfume.mlOptions[0] || 100;
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.perfume.id === perfume.id && item.selectedMl === ml
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { perfume, selectedMl: ml, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (id: string, ml: number, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((item) => {
          if (item.perfume.id === id && item.selectedMl === ml) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (id: string, ml: number) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.perfume.id === id && item.selectedMl === ml))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-gold-500 selection:text-black">
      
      {/* Navigation Header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSommelier={() => setIsSommelierOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section */}
      <Hero
        onOpenSommelier={() => setIsSommelierOpen(true)}
        onExploreClick={() => {
          const element = document.getElementById('catalog-section');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Main Catalog Section */}
      <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Catalog Filter Controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-100 flex items-center gap-2">
              <span>Colección de Perfumes</span>
              <span className="gold-gradient-text">Exclusivos</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Mostrando {filteredPerfumes.length} fragancias de alta fijación y notas olfativas complejas.
            </p>
          </div>

          {/* Gender Filter Buttons */}
          <div className="flex items-center gap-2 bg-dark-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1 font-medium">
              <Filter className="w-3.5 h-3.5 text-gold-400" /> Género:
            </span>
            {(['todos', 'hombre', 'mujer', 'unisex'] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGenderFilter(g)}
                className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-all ${
                  genderFilter === g
                    ? 'bg-gold-500 text-dark-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Perfume Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-gold-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-sm text-gold-400 font-medium animate-pulse">
              Cargando catálogo de perfumes árabes y de diseñador...
            </p>
          </div>
        ) : filteredPerfumes.length === 0 ? (
          <div className="py-20 text-center glass-panel p-8 rounded-3xl border border-slate-800 space-y-4">
            <p className="text-slate-300 text-lg font-medium">No encontramos perfumes que coincidan con tu búsqueda.</p>
            <p className="text-xs text-slate-500">Prueba con palabras clave como "Oud", "Vainilla", "Lattafa" o "Sauvage".</p>
            <button
              onClick={() => {
                setSelectedCategory('todos');
                setSearchQuery('');
                setGenderFilter('todos');
              }}
              className="px-6 py-2.5 rounded-full bg-gold-500 text-dark-950 font-bold text-xs"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPerfumes.map((perfume) => (
              <ProductCard
                key={perfume.id}
                perfume={perfume}
                onOpenModal={setSelectedPerfumeModal}
                onAddToCart={(p) => handleAddToCart(p)}
              />
            ))}
          </div>
        )}

      </main>

      {/* Floating AI Sommelier Quick Trigger */}
      <button
        onClick={() => setIsSommelierOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-emerald-700 text-dark-950 font-bold text-xs shadow-gold-glow hover:scale-110 transition-all flex items-center gap-2 border border-gold-400"
        title="Consultar al Sommelier de IA"
      >
        <Bot className="w-5 h-5 text-dark-950 animate-bounce" />
        <span className="hidden sm:inline">Sommelier de IA</span>
      </button>

      {/* Footer */}
      <Footer
        onSelectCategory={setSelectedCategory}
        onOpenSommelier={() => setIsSommelierOpen(true)}
      />

      {/* Modals & Slide-overs */}
      <ProductModal
        perfume={selectedPerfumeModal}
        onClose={() => setSelectedPerfumeModal(null)}
        onAddToCart={handleAddToCart}
      />

      <AISommelier
        perfumes={perfumes}
        isOpen={isSommelierOpen}
        onClose={() => setIsSommelierOpen(false)}
        onSelectPerfume={setSelectedPerfumeModal}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      <N8nAutomationsModal
        isOpen={isN8nModalOpen}
        onClose={() => setIsN8nModalOpen(false)}
      />

    </div>
  );
}

export default App;
