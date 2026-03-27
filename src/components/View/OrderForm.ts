import { TPayment } from "../../types";
import { ensureAllElements, ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export interface IOrderForm {
  payment: TPayment;
  address: string
}

export class OrderForm extends Form<IOrderForm> {
  protected paymentButtons: HTMLButtonElement[];
  protected addressElement: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button[type="button"]', this.container);
    this.addressElement = ensureElement<HTMLInputElement>('.form__input', this.container);

    this.paymentButtons.forEach(button => 
      button.addEventListener('click', () => this.selectPayment(button.name as TPayment)));
    this.addressElement.addEventListener('input', () => this.handleInput())
  }

  set payment(method: TPayment) {
    this.paymentButtons.forEach((button) => {
      button.classList.remove('button_alt-active');
      if (button.name === method) {
        button.classList.add('button_alt-active')
      }
    })
  }

  set address(value: string) {
    this.addressElement.value = value
  }

  selectPayment(method: TPayment): void {
    this.paymentButtons.forEach(button => {
      button.classList.remove('button_alt-active');
      if (button.name === method) {
        button.classList.add('button_alt-active')
      }
    }
  )
    this.events.emit('order:change', {payment: method});
  }

  handleInput(): void {
      this.events.emit('order:change', {address: this.addressElement.value})
  }

  submit(): void {
    this.events.emit('order:submit')
  }
}