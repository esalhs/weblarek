import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  items: HTMLElement[];
}

export class Basket extends Component<IBasket> {
  protected itemList: HTMLElement;
  protected orderButton: HTMLButtonElement;
  protected totalPrice: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.itemList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);

    this.orderButton.addEventListener('click', () => this.submitOrder())
  }

  setTotalPrice(value: number): void {
    this.totalPrice.textContent = String(value) + " синапсов";
  }
  
  submitOrder(): void {
    this.events.emit('order:open');
  }

  setButtonState(enabled: boolean): void {
    this.orderButton.disabled = !enabled
  }

  setItems(items: HTMLElement[]): void {
    if (items.length === 0) {
      this.itemList.textContent = ''
    } else {
      this.itemList.replaceChildren(...items)
    }
  }

  render(): HTMLElement {
    return this.container
  }
}