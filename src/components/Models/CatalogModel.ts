import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class CatalogModel {

  private products: IProduct[];
  private selectedProductId: string | null;

  constructor(protected events: IEvents) {
    this.products = [];
    this.selectedProductId = null;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit('catalog:changed')
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | null {
    const product = this.products.find(product => product.id === id);
    return product || null;
  }

  setSelectedProduct(id: string): void {
    this.selectedProductId = id;
    this.events.emit('preview:changed', { id })
  }

  getSelectedProduct(): IProduct | null {
    if (!this.selectedProductId) {
    return null;
    }

    return this.getProductById(this.selectedProductId);
  }
}
