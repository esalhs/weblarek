import { Component } from "../base/Component";

export class Gallery extends Component<unknown>{
  constructor(container: HTMLElement) {
    super(container)
  }

  setItems(elements: HTMLElement[]): void {
    this.container.replaceChildren(...elements);
  }
  render(): HTMLElement {
    return this.container
  }
}