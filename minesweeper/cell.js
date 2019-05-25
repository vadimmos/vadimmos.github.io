const EMPTY = 0;
const MINE = -1;
export default class Cell {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.isOpen = false;
    this.elem = document.createElement('div');
    this.elem.classList.add('cell');
    this.elem.cell = this;
    this.num = (Math.random()) > 0.80 ? MINE : EMPTY;
    this.flag = false;
    /** @type {Cell[]} */this._neighbor = [];
  }
  stFlag() {
    if (!this.isOpen) {
      this.flag = !this.flag;
      if (this.flag) {
        this.elem.setAttribute('flag', '');
      } else {
        this.elem.removeAttribute('flag');
      }
    }
  }
  set neighbor(v) {
    this._neighbor = v;
    if (this.num !== MINE) {
      this.neighbor.forEach(i => {
        if (i.num === MINE) {
          this.num++;
        }
      });
    }
  }
  get neighbor() {
    return this._neighbor;
  }
  open() {
    if (!this.flag) {
      this.isOpen = true;
      if (this.num === MINE) {
        globalThis.dispatchEvent(new CustomEvent('gameOver'));
      } else if (this.num !== MINE) {
        this.neighbor.forEach(i => {
          if (
            (i.x === this.x || i.y !== this.y) &&
            i.num !== MINE && !i.isOpen
          ) {
            if (i.num === EMPTY) {
              i.open();
            } else {
              i.isOpen = true;
              i.elem.innerText = String(i.num);
              i.elem.setAttribute('open', '');
              i.elem.setAttribute('num', String(i.num));
            }
          }
        });
        this.elem.innerText = String(this.num);
      }
      this.elem.setAttribute('open', '');
      this.elem.setAttribute('num', String(this.num));
    }
  }
  scan() {
    if (this.isOpen) {
      const count = this.neighbor.reduce((res, i) => {
        if (i.flag) {
          res++;
        }
        return res;
      }, 0);
      if (count === this.num) {
        if (this.neighbor.some(i => i.num === MINE && !i.flag)) {
          globalThis.dispatchEvent(new CustomEvent('gameOver'));
        } else {
          this.neighbor.forEach(i => {
            if (!i.flag) {
              i.isOpen = true;
              i.elem.innerText = String(i.num);
              i.elem.setAttribute('open', '');
              i.elem.setAttribute('num', String(i.num));
            }
          });
        }
      }
    }
  }

  /** @param {Cell[][]} cells */
  static getNeighbor(cells, { x, y }) {
    const Xmax = cells.length - 1;
    const Ymax = cells[0].length - 1;
    const res = [];

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i >= 0 && i <= Xmax && j >= 0 && j <= Ymax) {
          res.push(cells[i][j]);
        }
      }
    }
    return res.filter(i => i);
  }
}