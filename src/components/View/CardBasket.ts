import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";

interface ICardBasket extends ICard {
  index: number
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected onDelete: () => void) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButtonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButtonElement.addEventListener('click', () => this.onDelete())
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  
}