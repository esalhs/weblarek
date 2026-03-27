import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class BuyerModel {

  private payment: TPayment | null;
  private address: string;
  private email: string;
  private phone: string;

  constructor(protected events: IEvents) {
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';
  }

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }

    this.events.emit('buyer:changed');
  }

  getData(): IBuyer {
    return {
      payment: this.payment as TPayment,
      address: this.address,
      email: this.email,
      phone: this.phone
    };
  }

  clear(): void {
    this.payment = null;
    this.address = '';
    this.email = '';
    this.phone = '';
    this.events.emit('buyer:changed');
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }

    if (!this.email) {
      errors.email = 'Укажите email';
    }

    if (!this.phone) {
      errors.phone = 'Укажите телефон';
    }

    if (!this.address) {
      errors.address = 'Укажите адрес';
    }

    return errors;
  }
}