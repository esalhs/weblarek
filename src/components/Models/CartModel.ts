import { IProduct } from '../../types';

export class CartModel {

  private items: IProduct[];

  constructor() {
    this.items = [];
  }

  getProducts(): IProduct[] {
    return this.items;
  }

  addProduct(product: IProduct): void {
    if (!this.hasProduct(product.id)) {
        this.items.push(product);
    }
  }

  removeProduct(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasProduct(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}