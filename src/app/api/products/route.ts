import { NextResponse } from 'next/server';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  inStock: boolean;
  stockCount: number;
  saleTag?: boolean;
  category: string;
  brand: string;
  features: string[];
  specifications: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

const mockProducts: Product[] = [
  {
    id: 1,
    title: "AirPods Pro (2nd Generation)",
    description: "Active Noise Cancellation, Transparency mode, Personalized Spatial Audio, and longer battery life.",
    price: "$249.99",
    originalPrice: "$299.99",
    discount: 17,
    rating: 4.8,
    reviewCount: 15420,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format"
    ],
    inStock: true,
    stockCount: 45,
    saleTag: true,
    category: "Audio",
    brand: "Apple",
    features: ["Active Noise Cancellation", "Spatial Audio", "Water Resistant", "Wireless Charging"],
    specifications: {
      "Battery Life": "Up to 6 hours",
      "Charging Case": "Up to 30 hours",
      "Connectivity": "Bluetooth 5.3",
      "Weight": "5.3g per earbud"
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-08-20T15:30:00Z"
  },
  {
    id: 2,
    title: "MacBook Pro 16-inch",
    description: "Supercharged by M3 Pro and M3 Max chips. Up to 22 hours of battery life. Liquid Retina XDR display.",
    price: "$2,499.99",
    originalPrice: "$2,699.99",
    discount: 7,
    rating: 4.9,
    reviewCount: 8934,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop&auto=format"
    ],
    inStock: true,
    stockCount: 12,
    saleTag: true,
    category: "Computers",
    brand: "Apple",
    features: ["M3 Pro Chip", "16GB Unified Memory", "512GB SSD", "Liquid Retina XDR"],
    specifications: {
      "Display": "16.2-inch Liquid Retina XDR",
      "Processor": "Apple M3 Pro",
      "Memory": "16GB unified memory",
      "Storage": "512GB SSD"
    },
    createdAt: "2024-02-10T14:20:00Z",
    updatedAt: "2024-08-22T09:15:00Z"
  },
  {
    id: 3,
    title: "iPhone 15 Pro Max",
    description: "Titanium design. A17 Pro chip. Action Button. All-new 48MP Main camera for super-high-resolution photos.",
    price: "$1,199.99",
    rating: 4.7,
    reviewCount: 23450,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop&auto=format"
    ],
    inStock: false,
    stockCount: 0,
    saleTag: false,
    category: "Phones",
    brand: "Apple",
    features: ["A17 Pro Chip", "48MP Camera System", "Action Button", "Titanium Design"],
    specifications: {
      "Display": "6.7-inch Super Retina XDR",
      "Processor": "A17 Pro chip",
      "Camera": "48MP Main | 12MP Ultra Wide",
      "Storage": "256GB"
    },
    createdAt: "2024-03-05T11:45:00Z",
    updatedAt: "2024-08-21T16:20:00Z"
  },
  {
    id: 4,
    title: "Apple Watch Series 9",
    description: "Your essential companion for a healthy life. Advanced health sensors and apps to help you track workouts.",
    price: "$399.99",
    originalPrice: "$449.99",
    discount: 11,
    rating: 4.6,
    reviewCount: 12890,
    image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop&auto=format",
    images: [
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&h=400&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format"
    ],
    inStock: true,
    stockCount: 28,
    saleTag: true,
    category: "Wearables",
    brand: "Apple",
    features: ["Health Monitoring", "Fitness Tracking", "ECG App", "Blood Oxygen"],
    specifications: {
      "Display": "45mm Always-On Retina",
      "Processor": "S9 SiP",
      "Battery": "Up to 18 hours",
      "Water Resistance": "50 meters"
    },
    createdAt: "2024-01-28T09:30:00Z",
    updatedAt: "2024-08-19T13:45:00Z"
  }
];

export async function GET(request: Request) {
  try {
    // Here i am simulating the network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort');
    
    let filteredProducts = [...mockProducts];
    
    // Filter by category
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Filter by stock status
    if (inStock === 'true') {
      filteredProducts = filteredProducts.filter(product => product.inStock);
    }
    
    // Sort products
    if (sort) {
      switch (sort) {
        case 'price-low':
          filteredProducts.sort((a, b) => 
            parseFloat(a.price.replace('$', '').replace(',', '')) - 
            parseFloat(b.price.replace('$', '').replace(',', ''))
          );
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => 
            parseFloat(b.price.replace('$', '').replace(',', '')) - 
            parseFloat(a.price.replace('$', '').replace(',', ''))
          );
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
        default:
          break;
      }
    }
    
    return NextResponse.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
