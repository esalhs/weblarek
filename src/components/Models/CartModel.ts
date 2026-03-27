import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CartModel {

  private items: IProduct[];

  constructor(protected events: IEvents) {
    this.items = [];
  }

  getProducts(): IProduct[] {
    return this.items;
  }

  addProduct(product: IProduct): void {
    if (!this.hasProduct(product.id)) {
        this.items.push(product);
        this.events.emit('cart:changed');
    }
  }

  removeProduct(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
    this.events.emit('cart:changed');
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:changed');
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