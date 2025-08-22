export interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  rating: number;
  image: string;
  inStock: boolean;
  saleTag?: boolean;
}
