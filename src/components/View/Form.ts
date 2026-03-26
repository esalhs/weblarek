import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('.button[type="submit"]', this.container);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.container);

    this.container.addEventListener('submit', (event) => {
      event.preventDefault();
      this.submit()
    })
  }
  submit(): void {
    this.events.emit('form:submit');
  }

  setButtonState(enabled: boolean): void {
    this.submitButton.disabled = !enabled;
  }
  
  showErrors(errors: Record<string, string>) {
    this.errorsElement.textContent = Object.values(errors).join(', ')
  }
}