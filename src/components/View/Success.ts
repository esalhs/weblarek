import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface ISuccess {
  total: number
}

export class Success extends Component<ISuccess> {
  protected descriptionElement: HTMLElement;
  protected moreButtonElement: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.moreButtonElement = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.moreButtonElement.addEventListener('click', () => this.continueShopping())
  }

  continueShopping(): void {
    this.events.emit('modal:close')
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`
  }
}