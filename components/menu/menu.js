class MenuConfigIem {
  constructor({ laebl = '', iconPath = '', url = '' }) {
    this.label = laebl;
    this.iconPath = iconPath;
    this.url = url;
  }
}
/**
 * @class
 * @constructor
 * @public
 */
class Menu {
  /**
   * @param {String | Array} config путь к конфигурации для экземпляра меню
   * @param {HTMLElement} host HTMLElement клик по которому будет вызывать меню 
   */
  constructor(config, host) {
    /** @type {HTMLElement} */
    this.host = host;
    this.host.style.cursor = 'pointer';
    /** @type {HTMLElement} */
    this.body = document.createElement('nav');
    this.body.style.position = 'fixed';
    this.body.style.left = `${this.host.offsetLeft}px`;
    this.body.style.top = `${this.host.offsetTop + this.host.offsetHeight}px`;
    this.body.style.backgroundColor = 'var(--main-bg-color, gray)';
    this.body.style.boxShadow = '3px 3px 5px rgba(0, 0, 0, 0.5)';
    this.body.style.padding = '4px 8px';
    this.body.style.width = '100%';

    /** @type {boolean} */
    this._isOpen = false;

    /** @type {Array} */
    this._config = [];

    if (typeof config === 'string') {
      this._load(config);
    } else if (Array.isArray(config)) {
      this.config = config;
    }

    this._x = 0;
    this._y = 0;

    globalThis.addEventListener('click', (e) => this.handler(e));
    globalThis.addEventListener('mousemove', (e) => this.move(e))
  }
  get isOpen() {
    return this._isOpen;
  }
  get config() {
    return this._config;
  }
  set config(config) {
    this._config.splice(0, this._config.length);
    [...this.body.children].forEach(e => {
      e.remove();
    });
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.paddingLeft = '0';
    ul.style.margin = '0';
    this.body.appendChild(ul);
    config.forEach(i => {
      this._config.push(new MenuConfigIem(i));
      const li = document.createElement('li');
      li.style.padding = '4px 8px';
      const a = document.createElement('a');
      a.href = i.url;
      li.appendChild(a);
      ul.appendChild(li);
      if (i.iconPath) {
        const img = document.createElement('img');
        img.src = i.iconPath;
        a.appendChild(img);
      }
      const span = document.createElement('span');
      span.innerText = i.label;
      a.appendChild(span);
    });
  }
  /** * @param {string} config */
  async _load(config) {
    const res = await fetch(config);
    this.config = await res.json();
  }
  /**
   * @param {MouseEvent} e 
   */
  handler(e) {
    if (e.target === this.host) {
      e.stopPropagation();
      e.preventDefault();
      if (this.isOpen) this.close();
      else this.open();
    } else {
      if (this.isOpen) this.close()

    }
  }
  /**
   * @param {MouseEvent} e
   */
  move(e) {
    this._x = e.x;
    this._y = e.y;
  }
  open() {
    this._isOpen = true;
    document.body.appendChild(this.body);
  }
  close() {
    this._isOpen = false;
    this.body.remove();
  }
}

export default Menu;