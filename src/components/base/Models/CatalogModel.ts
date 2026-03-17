import { IProduct } from '../../types';

export class CatalogModel {

  private products: IProduct[];
  private selectedProductId: string | null;

  constructor() {
    this.products = [];
    this.selectedProductId = null;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | null {
    const product = this.products.find(product => product.id === id);
    return product || null;
  }

  setSelectedProduct(id: string): void {
    this.selectedProductId = id
  }

  getSelectedProduct(): IProduct | null {
    if (!this.selectedProductId) {
    return null;
    }

    return this.getProductById(this.selectedProductId);
  }
}
