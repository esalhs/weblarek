import { IApi, IProductsResponse, IOrderRequest, IOrderResponse } from '../../types'
export class ServerClass {
  private api: IApi

  constructor(api: IApi) {
    this.api = api
  }

  async fetchProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>('/product/')
  }

  async sendOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>('/order/', orderData)
  }
}