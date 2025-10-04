export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
};

export interface PartialProduct extends Partial<Product> {
  id: Product['id'];
}
