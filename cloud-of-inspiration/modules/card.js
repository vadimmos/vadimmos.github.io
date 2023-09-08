import { Transform2 } from "./geometry.js";
import { Item } from "./item.js";

export default class Card extends Item {
  img = document.createElement('img');
  cardEl = new HTMLCOICardElement();
  set src(v) {
    if (this.img.src === v) return;
    this.img.src = v;
  }
  get src() {
    return this.img.src;
  }
  /**
   * @param {File|null} source
   * @param {{x: number, y: number}} position
   */
  constructor(source, position) {
    super();
    this.img.addEventListener('load', e => {
      const { naturalWidth: w, naturalHeight: h } = this.img;
      const { x, y } = position;
      this.cardEl.transform = this.cardEl.transform.assign({ position: { x: x - w / 2, y: y - h / 2 }, scale: { w, h } });
      return this.dispatchEvent(new Event('load', e));
    });
    if (position) {
      this.cardEl.transform = this.cardEl.transform.assign({ position });
    }
    if (source instanceof File) {
      const fr = new FileReader();
      fr.addEventListener('progress', e => this.dispatchEvent(new ProgressEvent('progress', e)));
      fr.addEventListener('load', async (e) => {
        if (typeof fr.result !== 'string') return;
        this.src = fr.result;
        await this.decode();
        this.cardEl.dataUrl = this.src;
      });
      fr.readAsDataURL(source);
    }
  }
  decode() {
    return this.img.decode();
  }
}

class HTMLCOICardElement extends HTMLElement {
  #shadowRoot;
  /**@type {HTMLImageElement}*/
  #img;
  #x = 0;
  #y = 0;
  #w = 0;
  #h = 0;
  get img() {
    return this.#img;
  }
  set dataUrl(v) {
    this.img.src = v;
  }
  get x() { return this.#x; }
  set x(v) {
    // this.style.setProperty('left', `${v}px`);
    this.#x = v;
  }

  get y() { return this.#y; }
  set y(v) {
    // this.style.setProperty('top', `${v}px`);
    this.#y = v;
  }

  get w() { return this.#w; }
  set w(v) {
    // this.style.setProperty('width', `${v}px`);
    this.#w = v;
  }

  get h() { return this.#h; }
  set h(v) {
    // this.style.setProperty('height', `${v}px`);
    this.#h = v;
  }

  get transform() {
    return new Transform2({ position: { x: this.x, y: this.y }, scale: { w: this.w, h: this.h } });
  }
  set transform(transform) {
    transform = new Transform2(transform);
    const minH = 8 * HTMLCOICardElement.BW;
    const ratio = this.transform.scale.h / this.transform.scale.w;
    const minW = minH / ratio;
    requestAnimationFrame(() => {
      transform.scale.w = Math.max(minW, transform.scale.w);
      transform.scale.h = Math.max(minH, transform.scale.h);
      if (this.x !== transform.position.x || this.y !== transform.position.y) {
        this.x = transform.position.x;
        this.y = transform.position.y;
        this.style.setProperty('transform', `translate(${this.x}px, ${this.y}px)`);
      }
      if (this.w !== transform.scale.w) {
        this.w = transform.scale.w;
        this.style.setProperty('width', `${this.w}px`);
      }
      if (this.h !== transform.scale.h) {
        this.h = transform.scale.h;
        this.style.setProperty('height', `${this.h}px`);
      }
    });
  }

  constructor() {
    super();
    this.#shadowRoot = this.attachShadow({ mode: "closed" });
    this.#shadowRoot.appendChild(HTMLCOICardElement.#template.content.cloneNode(true));
    const img = this.#shadowRoot.querySelector('img');
    if (img instanceof HTMLImageElement) {
      this.#img = img;
    }
    this.addEventListener('dragover', () => false);
    this.addEventListener('dragleave', () => false);
    let resize = '';
    let action = false;
    const onEnter = () => {
      console.log('pointerenter');
    };
    this.addEventListener('pointerenter', onEnter);
    this.addEventListener('pointermove', e => {
      if (action) return;
      const x = e.offsetX;
      const y = e.offsetY;
      let s = '';
      if (y < 0) s += 'n';
      if (y > this.offsetHeight - 2 * HTMLCOICardElement.BW) s += 's';
      if (x < 0) s += 'w';
      if (x > this.offsetWidth - 2 * HTMLCOICardElement.BW) s += 'e';
      if (s) {
        resize = s;
        this.style.setProperty('cursor', `${s}-resize`);
      }
      else {
        resize = s;
        this.style.removeProperty('cursor');
      }
    });
    this.addEventListener('pointerleave', e => {
      console.log('pointerleave');
      resize = '';
      this.style.removeProperty('cursor');
    });

    this.addEventListener('pointerdown', e => {
      action = true;
      const transform = this.transform;
      const pointerId = e.pointerId;
      this.setPointerCapture(pointerId);
      const move = !resize;
      // /**@param {PointerEvent|MouseEvent} e */
      // const onContextMenu = e => {
      //   e.preventDefault();
      // };
      // window.addEventListener('contextmenu', onContextMenu);
      const onMove = e => {
        if (e.pointerId === pointerId) {
          if (move) {
            transform.position.x += e.movementX;
            transform.position.y += e.movementY;
          }
          else {
            const ratio = transform.scale.w / transform.scale.h;
            let dif = Math.abs(e.movementX) > Math.abs(e.movementY) ? e.movementX : e.movementY;

            switch (resize) {
              case 'nw': {
                transform.position.y += dif;
                transform.scale.h -= dif;
                transform.position.x -= ratio * transform.scale.h - transform.scale.w;
                transform.scale.w = ratio * transform.scale.h;
              } break;
              case 'ne': {
                dif = Math.abs(e.movementX) > Math.abs(e.movementY) ? -e.movementX : e.movementY;
                transform.position.y += dif;
                transform.scale.h -= dif;
                transform.scale.w = ratio * transform.scale.h;
              } break;
              case 'sw': {
                dif = Math.abs(e.movementX) > Math.abs(e.movementY) ? e.movementX : -e.movementY;
                transform.scale.h -= dif;
                transform.position.x -= ratio * transform.scale.h - transform.scale.w;
                transform.scale.w = ratio * transform.scale.h;
              } break;
              case 'se': {
                transform.scale.h += dif;
                transform.scale.w = ratio * transform.scale.h;
              } break;
              case 'n': {
                transform.position.y += e.movementY;
                transform.scale.h -= e.movementY;
              } break;
              case 's': {
                transform.scale.h += e.movementY;
              } break;
              case 'w': {
                transform.position.x += e.movementX;
                transform.scale.w -= e.movementX;
              } break;
              case 'e': {
                transform.scale.w += e.movementX;
              } break;
              default:
                break;
            }
            this.transform = transform;
          }
          this.transform = transform;
        }
      };
      window.addEventListener('pointermove', onMove, { passive: true });
      window.addEventListener('pointerup', e => {
        if (e.pointerId === pointerId) {
          this.releasePointerCapture(pointerId);
          window.removeEventListener('pointermove', onMove);
          // window.removeEventListener('contextmenu', onContextMenu);
          action = false;
        }
      }, { once: true });
    });
  }

  /**@param {string} name */
  #getStyle(name) {
    return getComputedStyle(this)[name];
  }
  /**@param {string} name */
  #getStyleAsNum(name) {
    return parseFloat(this.#getStyle(name));
  }

  static #template = (() => {
    const t = document.createElement('template');
    t.innerHTML = /*html*/`
    <style>
      :host {
        position: absolute;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
        border: ${HTMLCOICardElement.BW}px solid transparent;
      }
      :host(:hover){
        border-color:  var(--accent-color);
      }
      :host(:hover)>.dot{
        visibility: visible;
      }
      :host img{
        width: 100%;
        height: 100%;
      }
    </style>
    <img draggable="false">
    `;
    return t;
  })();
  static get BW() {
    return 8;
  };
  static get SCREEN_PADDING() {
    return HTMLCOICardElement.BW * 4;
  };
}
window.customElements.define('coi-card', HTMLCOICardElement);