export class VBMenu extends HTMLUListElement {
  constructor() {
    super();
    /**@type {MenuItem[]} */
    this._items = [];
  }
  set items(v) {
    this._items.splice(0, this._items.length, ...v);
    const fr = new DocumentFragment();
    for (const i of this._items) {
      const li = document.createElement('li');
      const img = document.createElement('img');
      const a = document.createElement('a');
      img.onerror = imgOnError;
      img.src = i.iconPath;
      img.setAttribute('alt', i.alt || i.text);
      a.href = i.href;
      a.setAttribute('aria-label', i.text);
      a.setAttribute('title', i.text);
      a.textContent = i.text;
      li.appendChild(img);
      li.appendChild(a);
      fr.appendChild(li);
    }
    this.innerHTML = '';
    this.appendChild(fr);

  }
  get items() { return this._items }
}
export class MenuItem {
  constructor(text = '', path = '', icon = 'icon.png', alt = '') {
    this.text = text;
    this.path = path;
    this.icon = icon;
    this.alt = alt;
  }
  get iconPath() {
    return `${this.path}/${this.icon}`
  }
  get href() {
    return `${this.path}/index.html`
  }
}
const style = document.createElement('style');
style.textContent = /*css*/`[is="vb-menu"]>li {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px;
  font-size: 1.25em;
  min-height: 1.25em;
}

[is="vb-menu"]>li>img {
  margin-right: 8px;
  width: 1.25em;
  overflow: hidden;
  text-overflow: ellipsis;
}`;
document.head.appendChild(style);
window.customElements.define('vb-menu', VBMenu, { extends: 'ul' });
function imgOnError() { this.src = '/favicon.ico' }