import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ICard {
  title: string;
  price: number | null;
  id: string
}

export class Card<T extends ICard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);

  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    if (value !== null) {
      this.priceElement.textContent = value + ' синапсов'
    } else {
      this.priceElement.textContent = 'Бесценно'
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  } 
}