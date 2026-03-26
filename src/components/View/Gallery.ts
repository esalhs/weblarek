import { Component } from "../base/Component";

export class Gallery extends Component<unknown>{
  constructor(container: HTMLElement) {
    super(container)
  }
  render(element: HTMLElement[]): HTMLElement {
    this.container.replaceChildren(...element);
    return this.container
  }
}