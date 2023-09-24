import { HTMLPopoverElement } from "../components/popup/popup.js";
import { Card } from "./modules/card.js";
const menu = new HTMLPopoverElement();
document.body.appendChild(menu);
start();

function start(main = document.getElementById('main')) {
  if (!main) {
    throw new Error('Не найдена рабочая область');
  }
  addListeners(main);
}
/** @param {HTMLElement} main*/
function addListeners(main) {
  main.addEventListener('dragover', D_getDt(onDragOver));
  main.addEventListener('dragleave', onDragLeave);
  main.addEventListener('dragend', onDragend);
  main.addEventListener('drop', D_getDt(onDrop));
  main.addEventListener('contextmenu', e => {
    e.preventDefault();
    const menuContent = document.createElement('ul');
    for (let i = 0; i < 10; i++){
      const li = document.createElement('li');
      li.textContent = 'test';
      menuContent.appendChild(li);
    }
    menu.showPopover(menuContent, e);
  });

  main.addEventListener('pointerdown', e => {
    if (e.target !== main) return;
    const pointerId = e.pointerId;
    main.setPointerCapture(pointerId);
    const onMove = e => {
      if (e.pointerId === pointerId) {
        window.moveBy(e.movementX, e.movementY);
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', () => {
      if (e.pointerId === pointerId) {
        window.removeEventListener('pointermove', onMove);
        main.releasePointerCapture(pointerId);
      }
    });
  });

  const TYPES = ['Files', 'text/html', ''];

  /** @param {DataTransfer} dt*/
  function onDragOver(dt) {
    if (dt.types.some(t => TYPES.includes(t))) {
      main.classList.add('dragover');
      dt.dropEffect = 'link';
      for (const el of main.children) {
        el.classList.add('pointer-events-none');
      }
    }
    else {
      dt.dropEffect = 'none';
    }
  }
  function onDragend(e) {
    main.classList.remove('dragover');
    for (const el of main.children) {
      el.classList.remove('pointer-events-none');
    }
  }
  function onDragLeave(e) {
    if (e.target === main) {
      onDragend(e);
    }
  }
  /**
   * @param {DataTransfer} dt
   * @param {DragEvent} e
  */
  function onDrop(dt, e) {
    onDragend(e);
    for (const item of dt.items) {
      if (item.type.startsWith('image/') && item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          // createImageFromFile(file, e).then(img => main.appendChild(img));
          const card = new Card(file, e);
          main.appendChild(card.cardEl);
          console.log(card);
        }
      }
    }
  }
  /**
   * @param {(DataTransfer, DragEvent) => void} fn
   * @returns {(DragEvent) => void}
   */
  function D_getDt(fn) {
    return e => {
      e.preventDefault();
      const dt = e.dataTransfer;
      if (!dt) return;
      fn(dt, e);
    };
  }
}

//'❌'

/*
  cursor: e-resize;
  cursor: n-resize;
  cursor: s-resize;
  cursor: w-resize;
  cursor: ew-resize;
  cursor: ne-resize;
  cursor: ns-resize;
  cursor: nw-resize;
  cursor: se-resize;
  cursor: sw-resize;
*/