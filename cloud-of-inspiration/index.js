import Card from "./modules/card.js";

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
  const BW = 8;
  const SCREEN_PADDING = BW * 4;
  /**
   * @param {File} file
   * @param {{x: number, y: number}} pos
   */
  function createImageFromFile(file, pos) {
    return new Promise((resolve, reject) => {
      const _img = document.createElement('img');
      const fr = new FileReader();
      fr.addEventListener('load', async () => {
        if (typeof fr.result === 'string') {
          _img.src = fr.result;
          await _img.decode();
          const img = document.createElement('div');
          const sp = img.style.setProperty.bind(img.style);
          const rmp = img.style.removeProperty.bind(img.style);
          sp('background-image', `url(${_img.src})`);
          sp('background-size', 'contain');
          sp('top', '0px');
          sp('left', '0px');
          sp('border', `${BW}px solid transparent`);
          const transform = {
            w: _img.naturalWidth,
            h: _img.naturalHeight,
            x: ~~(pos.x - _img.naturalWidth / 2),
            y: ~~(pos.y - _img.naturalHeight / 2),
            apply() {
              this.x = Math.max(-(this.w - SCREEN_PADDING), Math.min(this.x, window.innerWidth - SCREEN_PADDING));
              this.y = Math.max(-(this.h - SCREEN_PADDING), Math.min(this.y, window.innerHeight - SCREEN_PADDING));
              this.w = Math.max(SCREEN_PADDING, Math.min(this.w, window.innerWidth - SCREEN_PADDING));
              this.h = Math.max(SCREEN_PADDING, Math.min(this.h, window.innerHeight - SCREEN_PADDING));
              sp('transform', `translate(${this.x}px, ${this.y}px)`);
              sp('width', `${this.w}px`);
              sp('height', `${this.h}px`);
            }
          };
          transform.apply();
          img.setAttribute('draggable', 'false');
          img.classList.add('img-card');
          img.addEventListener('dragover', () => false);
          img.addEventListener('dragleave', () => false);
          let resize = '';
          let action = false;
          img.addEventListener('pointermove', e => {
            if (action) return;
            const x = e.offsetX;
            const y = e.offsetY;
            let s = '';
            if (y < 0) s += 'n';
            if (y > img.offsetHeight - 2 * BW) s += 's';
            if (x < 0) s += 'w';
            if (x > img.offsetWidth - 2 * BW) s += 'e';
            if (s) {
              resize = s;
              sp('cursor', `${s}-resize`);
            }
            else {
              resize = s;
              rmp('cursor');
            }
          });

          img.addEventListener('pointerdown', e => {
            action = true;
            const pointerId = e.pointerId;
            img.setPointerCapture(pointerId);
            const move = !resize;
            const onMove = e => {
              if (e.pointerId === pointerId) {
                if (move) {
                  transform.x += e.movementX;
                  transform.y += e.movementY;
                }
                else {
                  if (resize.includes('n')) {
                    transform.y += e.movementY;
                    transform.h -= e.movementY;
                  }
                  if (resize.includes('s')) {
                    transform.h += e.movementY;
                  }
                  if (resize.includes('w')) {
                    transform.x += e.movementX;
                    transform.w -= e.movementX;
                  }
                  if (resize.includes('e')) {
                    transform.w += e.movementX;
                  }
                }
                transform.apply();
              }
            };
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', e => {
              if (e.pointerId === pointerId) {
                img.releasePointerCapture(pointerId);
                window.removeEventListener('pointermove', onMove);
                action = false;
              }
            }, { once: true });
          });
          img.addEventListener('contextmenu', e => {
            e.preventDefault();
            if (confirm('Удалить карточку?')) {
              img.remove();
            }
          });
          img.addEventListener('dblclick', e => {
            e.preventDefault();
            main.appendChild(img);
          });
          resolve(img);
        }
        else {
          reject(new Error('no image data'));
        }
      });
      fr.readAsDataURL(file);
    });
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