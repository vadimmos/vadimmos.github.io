import { HTMLBasicElement, ShadowRootModes } from "../basic/basic.js";
const template = document.createElement('template');
template.innerHTML = /*html*/`<slot></slot>`;
export class HTMLPopoverElement extends HTMLBasicElement {
  maxWidth = 240;
  margin = 24;
  get mainTemplate() {
    return template;
  };
  get shadowRootMode() {
    return ShadowRootModes.closed;
  }
  constructor() {
    super();
    this.setAttribute('popover', 'auto');
    this.style.setProperty('margin', '0px');
    this.style.setProperty('min-width', `${this.maxWidth}px`);
    this.style.setProperty('max-width', `${this.maxWidth}px`);
  }
  /**@type {HTMLElement|null} */
  #popContent = null;
  /**@param {HTMLElement|null} content*/
  set popContent(content) {
    if (this.#popContent) {
      this.#popContent.remove();
    }
    this.#popContent = content;
    if (this.#popContent) {
      this.#popContent.removeAttribute('hidden');
      this.appendChild(this.#popContent);
    }
  }
  showPopover(content, pos) {
    this.style.setProperty('visibility', 'hidden');
    window.addEventListener('resize', () => this.hidePopover(), { once: true });
    if (pos) {
      pos = { x: pos.x + 1, y: pos.y + 1 };
      const wW = window.innerWidth;
      const wH = window.innerHeight;
      if (pos.x + this.maxWidth + this.margin > wW) {
        pos.x = wW - (this.maxWidth + this.margin);
      }
      requestAnimationFrame(() => {
        this.style.setProperty('left', `${pos.x}px`);
        this.style.removeProperty('bottom');
        this.style.removeProperty('top');
        this.style.removeProperty('max-height');
        if (pos.y < this.offsetHeight) {
          if (wH - pos.y < this.offsetHeight) {
            pos.y = wH - Math.min(this.offsetHeight, wH);
          }
          const mh = Math.min(this.offsetHeight, wH);
          this.style.setProperty('max-height', `${mh}px`);
          this.style.setProperty('top', `${pos.y}px`);
        }
        else {
          if (pos.y + this.offsetHeight + this.margin > wH) {
            pos.y = Math.max(pos.y - this.offsetHeight, 0);
            this.style.setProperty('top', `${pos.y}px`);
          }
          else {
            this.style.setProperty('top', `${pos.y}px`);
          }
        }
        this.style.setProperty('visibility', 'visible');
      });
    }

    if (content) {
      this.popContent = content;
      super.showPopover();
    }
  }
  hidePopover() {
    this.popContent = null;
    super.hidePopover();
  }
}
window.customElements.define('vb-popover', HTMLPopoverElement);