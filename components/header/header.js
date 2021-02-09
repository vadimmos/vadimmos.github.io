class VBHeader extends HTMLElement{
  constructor(){
    super();
    this.classList.add('horizontal');
    this.classList.add('raised');
    this.classList.add('center');
    this.style.setProperty('justify-content', 'center');
    const h1 = document.createElement('h1');
    const a = document.createElement('a');
    a.setAttribute('title', 'vadimmos');
    a.setAttribute('role', 'heading');
    a.textContent = 'vadimmos';
    a.href = '/index.html';
    h1.appendChild(a);
    this.appendChild(h1);
  }
}
window.customElements.define('vb-header', VBHeader, { extends: 'header'});