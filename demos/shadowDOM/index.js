/**@type {{open: ShadowRootMode, closed: ShadowRootMode}}*/
const ShadowRootModes = { open: 'open', closed: 'closed' };
const sh = (() => {
  const sheet = new CSSStyleSheet();
  sheet.replace(/*css*/`
    :host{
      display: flex;
      flex-direction: column;
    }
    div{
      display: flex;
      flex-direction: row;
    }
  `);
  return sheet;
})();
const template = (() => {
  const main = document.createElement('template');
  main.innerHTML = /*html*/`
    <div class="test1">asdf asdf asdf 1234 1234 1234</div>
    <div class="test2">asdf asdf asdf 1234 1234 1234</div>
    <div class="test3">asdf asdf asdf 1234 1234 1234</div>
    <div class="test4">asdf asdf asdf 1234 1234 1234</div>
  `;
  return main;
})();
class TestElement extends HTMLElement {
  $shadow;
  styleSheet = sh;
  mainTemplate = template;
  shadowRootMode = ShadowRootModes.open;
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
  static get ShadowRootModes() { return ShadowRootModes; };
  /**@param {String} tagName */
  static register(tagName) {
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, this);
    }
    return this;
  }
}
TestElement.register('vb-base');

class T2Element extends TestElement {
  myStyle = new CSSStyleSheet();
  constructor() {
    super();
    this.$shadow.adoptedStyleSheets.push(this.myStyle);
    this.createBtn();
  }
  shadowRootMode = ShadowRootModes.closed;

  createBtn() {
    const btn = document.createElement('button');
    btn.textContent = 'shake';
    btn.addEventListener('click', () => this.shake());
    this.append2Shadow(btn);
  }

  shake() {
    const colors = ['red', 'green', 'blue', 'lime'];
    this.myStyle.replace(`
    .test1{
      color: ${colors[getRand(0, colors.length - 1)]};
    }
    .test2{
      color: ${colors[getRand(0, colors.length - 1)]};
    }
    .test3{
      color: ${colors[getRand(0, colors.length - 1)]};
    }
    .test4{
      color: ${colors[getRand(0, colors.length - 1)]};
    }
    `);
  }
}
T2Element.register('t-2');
const div1 = document.createElement('div');
div1.style.border = '1px solid red';
const div2 = document.createElement('div');
div2.style.border = '2px solid blue';


for (let i = 0; i < 10; i++) {
  const el = new TestElement();
  div1.appendChild(el);
}
for (let i = 0; i < 10; i++) {
  const el = new T2Element();
  div2.appendChild(el);
}

document.body.appendChild(div1);
document.body.appendChild(div2);


function getRand(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}