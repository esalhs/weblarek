import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Modal extends Component<HTMLElement>{
  protected contentElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.contentElement = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => this.handleClose());
    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.handleClose();
      }
    });
  }

  open(): void {
    this.container.classList.add('modal_active');
  }
  
  close(): void {
    this.container.classList.remove('modal_active');
    this.contentElement.replaceChildren();
  }

  handleClose(): void {
    this.events.emit('modal:close');
  }

  render(content: HTMLElement): HTMLElement {
    this.contentElement.replaceChildren(content);
    return this.contentElement
  }
}