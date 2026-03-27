import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../utils/constants";

interface ICardFull extends ICard {
  image: string;
  category: string;
  description: string
}

export class CardFull extends Card<ICardFull> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected cardButtonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected onAction: () => void) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.cardButtonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.cardButtonElement.addEventListener('click', () => {
      this.handleButtonClick()
    })
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

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  setButtonState(inCart: boolean, hasPrice: boolean): void {
    this.container.dataset.inCart = String(inCart);

    if (!hasPrice) {
      this.cardButtonElement.textContent = "Недоступно";
      this.cardButtonElement.disabled = true;
      return;
    } else {
      this.cardButtonElement.textContent = inCart ? "Удалить из корзины" : "Купить";
      this.cardButtonElement.disabled = false;
    }
  }

  handleButtonClick(): void {
    this.onAction();
  }
}