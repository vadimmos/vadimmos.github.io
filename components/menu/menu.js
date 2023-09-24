import { HTMLBasicElement, ShadowRootModes } from "../basic/basic.js";
const itemTag = 'vb-menu-item';
const menuStyleSheet = (() => {
  const sheet = new CSSStyleSheet();
  sheet.replace(/*css*/`
    :host, li, ul, ${itemTag}{
      display: flex;
      flex: auto;
    }
    :host, li{
      flex-direction: row;
    }
    ul{
      flex-direction: column;
    }
  `);
  return sheet;
})();
const ul = document.createElement('ul');
const getUl = () => ul.cloneNode(true);
const li = document.createElement('li');
const getLi = () => li.cloneNode(true);

export class HTMLMenuElement extends HTMLBasicElement {
  get styleSheet() {
    return menuStyleSheet;
  }
  get shadowRootMode() {
    return ShadowRootModes.closed;
  }
  _items;
  _itemEls = [];
  get items() {
    return this._items;
  }
  set items(value) {
    this._items = value;
  }
  constructor() {
    super();
    this.append2Shadow(getUl());
  }
}
HTMLMenuElement.register('vb-menu');

export class HTMLMenuItemElement extends HTMLBasicElement {
  constructor() {
    super();
  }
}
HTMLMenuItemElement.register(itemTag);