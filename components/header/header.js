class VBHeader extends HTMLElement{
  constructor(){
    super();
    this.classList.add('horizontal');
    this.classList.add('raised');
    this.classList.add('center');
    this.style.setProperty('justify-content', 'center');
    const h1 = document.createElement('h1');
    const a = this.anchor = document.createElement('a');
    a.setAttribute('title', 'vadimmos');
    a.setAttribute('role', 'heading');
    a.textContent = 'vadimmos';
    a.href = '/index.html';
    h1.appendChild(a);
    this.appendChild(h1);
  }
  connectedCallback() {
    const href = this.getAttribute('href');
    if (href) this.anchor.href = href;
    const text = this.getAttribute('text');
    if (text) this.anchor.textContent = text;
  }
}
window.customElements.define('vb-header', VBHeader, { extends: 'header'});