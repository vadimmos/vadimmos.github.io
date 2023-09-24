/**@type {{open: ShadowRootMode, closed: ShadowRootMode}}*/
export const ShadowRootModes = { open: 'open', closed: 'closed' };
const template = document.createElement('template');
const styleSheet = (() => {
  const sheet = new CSSStyleSheet();
  sheet.replace(/*css*/`
    :host{ display: block; }
  `);
  return sheet;
})();

export class HTMLBasicElement extends HTMLElement {
  $shadow;
  get shadowRootMode() {
    return HTMLBasicElement.ShadowRootModes.open;
  }
  get styleSheet() {
    return styleSheet;
  }
  get mainTemplate() {
    return template;
  };
  constructor() {
    super();
    this.$shadow = this.attachShadow({ mode: this.shadowRootMode });
    this.$shadow.adoptedStyleSheets.push(this.styleSheet);
    this.append2Shadow(this.mainTemplate);
  }
  append2Shadow(...nodes) {
    nodes = nodes.map(n => n instanceof HTMLTemplateElement ? n.content.cloneNode(true) : n);
    return this.$shadow.append(...nodes);
  }

  static ShadowRootModes = ShadowRootModes;
  /**@param {String} tagName */
  static register(tagName) {
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, this);
    }
    return this;
  }
}
HTMLBasicElement.register('vb-base');