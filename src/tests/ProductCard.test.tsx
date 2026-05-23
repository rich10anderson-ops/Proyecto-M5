import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { Product } from '../types';

// Mock useCart hook
const mockAddItem = vi.fn();
vi.mock('../hooks/useCart', () => ({
  useCart: () => ({
    addItem: mockAddItem,
  }),
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { uid: 'u-123', email: 'street@neon.com' },
  }),
}));

const MOCK_PRODUCT: Product = {
  id: 'prod-test',
  name: 'CYBER-HEADPHONES // GLOW v2',
  description: 'Auriculares de alta fidelidad con iluminación neón',
  price: 99.99,
  category: 'Audio',
  imageUrl: 'https://images.unsplash.com/mock.jpg',
  stock: 10,
  averageRating: 4.8,
  totalReviews: 5,
  createdAt: new Date().toISOString(),
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('ProductCard Component Tests', () => {
  it('should render product details correctly', () => {
    renderWithRouter(<ProductCard product={MOCK_PRODUCT} />);

    // Check title
    expect(screen.getByText('CYBER-HEADPHONES // GLOW v2')).toBeInTheDocument();
    // Check price
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    // Check category badge
    expect(screen.getByText('Audio')).toBeInTheDocument();
    // Check image alt attribute
    const img = screen.getByAltText('CYBER-HEADPHONES // GLOW v2') as HTMLImageElement;
    expect(img.src).toContain('https://images.unsplash.com/mock.jpg');
  });

  it('should display "ÚLTIMAS X UNIDADES" when stock is <= 5', () => {
    const lowStockProduct = { ...MOCK_PRODUCT, stock: 3 };
    renderWithRouter(<ProductCard product={lowStockProduct} />);

    expect(screen.getByText('ÚLTIMAS 3 UNIDADES')).toBeInTheDocument();
  });

  it('should display "OUT OF STOCK" and disable button when stock is 0', () => {
    const outOfStockProduct = { ...MOCK_PRODUCT, stock: 0 };
    renderWithRouter(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText('OUT OF STOCK')).toBeInTheDocument();
    const btn = screen.getByRole('button', { name: /AGOTADO/i });
    expect(btn).toBeDisabled();
  });

  it('should call addItem when "AGREGAR AL CARRO" button is clicked', () => {
    mockAddItem.mockClear();
    renderWithRouter(<ProductCard product={MOCK_PRODUCT} />);

    const btn = screen.getByRole('button', { name: /AGREGAR AL CARRO/i });
    fireEvent.click(btn);

    expect(mockAddItem).toHaveBeenCalledTimes(1);
    expect(mockAddItem).toHaveBeenCalledWith(MOCK_PRODUCT);
  });
});
