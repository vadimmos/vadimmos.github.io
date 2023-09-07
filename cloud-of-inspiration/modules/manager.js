import { Item } from "./item.js";

export class Manager {
  /**@type {Item|null} */
  #activeItem = null;

  /**@type {Item|null} */
  #lastActiveItem = null;

  get activeItem() {
    return this.#activeItem;
  }
  set activeItem(item) {
    this.#lastActiveItem = this.#activeItem;
    this.#activeItem = item;
  }

  constructor(rootElement) {
    return Manager.instance ??= this;
  }
  /**@type {Manager|null} */
  static instance = null;
}

export class History extends Array {

}
export class HistoryStep {
  obj;
  prop;
  oldV;
  newV;
  constructor() {

  }
}