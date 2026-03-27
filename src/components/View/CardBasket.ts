import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card, ICard } from "./Card";

interface ICardBasket extends ICard {
  index: number
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButtonElement.addEventListener('click', () => this.removeCard())
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  removeCard(): void {
    const id = this.container.dataset.id;
    if (!id) {
      return;
    }
    this.events.emit('card:remove', { id })
  }
}