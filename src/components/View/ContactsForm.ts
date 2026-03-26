import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

interface IContactsForm {
  email: string;
  phone: string
}

export class ContactsForm extends Form<IContactsForm> {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

  constructor(events: IEvents, container: HTMLElement) {
    super(events, container);

    this.emailElement = ensureElement<HTMLInputElement>('.form__input[name="email"]', this.container);
    this.phoneElement = ensureElement<HTMLInputElement>('.form__input[name="phone"]', this.container);

    this.emailElement.addEventListener('input', () => this.handleInput());
    this.phoneElement.addEventListener('input', () => this.handleInput());
  }
  handleInput(): void {
    this.events.emit('contacts:change', {email: this.emailElement.value, phone: this.phoneElement.value});
  }

  submit(): void {
    this.events.emit('contacts:submit')
  }
}