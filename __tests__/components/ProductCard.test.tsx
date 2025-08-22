/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock framer-motion completely
jest.mock('framer-motion', () => ({
  motion: {
    article: ({ children, ...props }: any) => <article {...props}>{children}</article>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Import your actual components - adjust paths as needed
import ProductCard from '@/app/components/ProductCard';
import { ThemeProvider } from '@/context/ThemeContext';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  description: 'Test description',
  price: '$99.99',
  originalPrice: '$129.99',
  discount: 23,
  rating: 4.5,
  reviewCount: 150,
  image: 'https://via.placeholder.com/400',
  images: ['https://via.placeholder.com/400'],
  inStock: true,
  stockCount: 10,
  saleTag: true,
  category: 'Electronics',
  brand: 'TestBrand',
  features: ['Feature 1'],
  specifications: {},
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

describe('ProductCard - Assignment Requirements', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Test Responsive Design
  it('has responsive classes for different screen sizes', () => {
    renderWithTheme(<ProductCard product={mockProduct} />);
    
    const cardElement = screen.getByRole('article');
    expect(cardElement.className).toContain('max-w-sm');
    expect(cardElement.className).toContain('mx-auto');
  });

  // 2. Test Required Elements
  it('includes product image, title, price, rating, and Add to Cart button', () => {
    renderWithTheme(<ProductCard product={mockProduct} />);
    
    // Product Title
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    
    // Product Price
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    
    // Rating (review count)
    expect(screen.getByText('(150)')).toBeInTheDocument();
    
    // Add to Cart Button
    expect(screen.getByRole('button', { name: /add.*cart/i })).toBeInTheDocument();
  });

  // 3. Test Hover Effects
  it('implements hover effects with Tailwind classes', () => {
    renderWithTheme(<ProductCard product={mockProduct} />);
    
    const cardElement = screen.getByRole('article');
    expect(cardElement.className).toContain('transition-all');
  });

  // 4. Test Sale Tags
  it('shows sale badge when product is on sale', () => {
    renderWithTheme(<ProductCard product={mockProduct} />);
    expect(screen.getByText('-23% OFF')).toBeInTheDocument();
  });

  it('does not show sale badge when product is not on sale', () => {
    const regularProduct = { ...mockProduct, saleTag: false, discount: undefined };
    renderWithTheme(<ProductCard product={regularProduct} />);
    expect(screen.queryByText(/-\d+% OFF/)).not.toBeInTheDocument();
  });

  // 5. Test Out of Stock
  it('shows out of stock overlay when product is not in stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    renderWithTheme(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('disables Add to Cart button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, inStock: false };
    renderWithTheme(<ProductCard product={outOfStockProduct} />);
    
    const addToCartButton = screen.getByRole('button', { name: /out of stock/i });
    expect(addToCartButton).toBeDisabled();
  });

  // 6. Test Button Functionality
  it('calls onAddToCart when Add to Cart button is clicked', async () => {
    const user = userEvent.setup();
    const onAddToCart = jest.fn();
    
    renderWithTheme(
      <ProductCard product={mockProduct} onAddToCart={onAddToCart} />
    );
    
    const addToCartButton = screen.getByRole('button', { name: /add.*cart/i });
    await user.click(addToCartButton);
    
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });
});
