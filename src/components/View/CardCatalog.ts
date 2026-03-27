import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../utils/constants";

export interface ICardCatalog extends ICard {
  image: string;
  category: string;
}

export class CardCatalog extends Card<ICardCatalog> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, protected onClick: () => void) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    this.container.addEventListener('click', () => this.onClick())
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.titleElement.textContent || '')
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    Object.values(categoryMap).forEach(className => {
      this.categoryElement.classList.remove(className);
    })

    const className = categoryMap[value as keyof typeof categoryMap];
    this.categoryElement.classList.add(className);
  }
}