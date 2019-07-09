import Cell from './cell.js';

const header = document.getElementsByTagName('header')[0];
const timer = document.getElementById('timer');
const filedEl = document.getElementById('field');
const width = Math.round((globalThis.innerWidth - 16) / 48) - 2;
const height = Math.round((globalThis.innerHeight - header.offsetHeight - 16) / 48) - 2;

let startTime = Date.now();
let redTimer = false;

let first = false;

/** @type {Cell[][]} */const cells = [];


timer.addEventListener('click', () => {
  startGame();
});

let pDowns = 0;
let pDownTimerId = 0;
filedEl.addEventListener('pointerdown', (e) => {
  if(e.buttons !== 0) return;
  pDowns++;
  if (pDownTimerId) {
    clearTimeout(pDownTimerId);
  }
  pDownTimerId = setTimeout(() => {
    if (pDowns >= 2) {
      if (e.target['cell']) {
        if (!first) {
          e.target['cell'].num = 0;
          e.target['cell'].neighbor = [...e.target['cell'].neighbor];
          first = true;
        }
        e.target['cell'].open();
        if (cells.every(i => i.every(i => (i.num > -1 && i.isOpen) || (i.num === -1 && !i.isOpen)))) {
          win();
        }
      }
    }
    pDowns = 0;
  }, 200);
});

filedEl.addEventListener('click', (e) => {
  if (e.target['cell']) {
    e.target['cell'].scan();
  }
});
filedEl.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.target['cell']) {
    e.target['cell'].stFlag();
  }
});
function gameOver() {
  redTimer = true;
  for (let i = 0; i <= height; i++) {
    for (let j = 0; j <= width; j++) {
      if (cells[i][j].num === -1) {
        cells[i][j].elem.setAttribute('open', '');
        cells[i][j].elem.setAttribute('num', String(cells[i][j].num));
      }
    }
  }
  setTimeout(() => {
    startGame();
  }, 5000);
}

function startGame() {
  [...filedEl.children].forEach(e => e.remove());
  first = false;
  cells.splice(0, cells.length);
  cells.length = height;

  for (let i = 0; i <= height; i++) {
    cells[i] = [];
    cells[i].length = width;
    for (let j = 0; j <= width; j++) {
      cells[i][j] = new Cell(i, j);
    }
  }

  const rows = [];

  for (let i = 0; i <= height; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    rows.push(row);
    for (let j = 0; j <= width; j++) {
      cells[i][j].neighbor = Cell.getNeighbor(cells, cells[i][j]);
      row.appendChild(cells[i][j].elem);
    }
  }
  const fr = new DocumentFragment();
  rows.forEach(r => {
    fr.appendChild(r);
  });
  filedEl.appendChild(fr);

  globalThis.removeEventListener('gameOver', gameOver);
  globalThis.addEventListener('gameOver', gameOver);
  startTime = Date.now();
  redTimer = false
}
function win() {
  clearInterval(timerId);
  const h1 = document.createElement('h1');
  h1.innerText = 'You win!';
  h1.style.position = 'fixed';
  h1.style.fontSize = '10vh';
  h1.style.color = 'red';
  h1.style.marginTop = '100px';

  document.body.appendChild(h1);

  const elems = [];
  for (let i = 0; i <= height; i++) {
    for (let j = 0; j <= width; j++) {
      elems.push(cells[i][j].elem);
    }
  }
  elems.forEach(e => {
    e.style.position = 'fixed';
  });
  {
    let width = Math.round(globalThis.innerWidth);
    let height = Math.round(globalThis.innerHeight);
    let left = (Math.random() - 0.5)  * Math.round(globalThis.innerWidth / 2);
    let top = (Math.random() - 0.5) * Math.round(globalThis.innerHeight / 2);
    const entId = setInterval(() => {
      elems.forEach(e => {
        left += Math.round(Math.max((Math.random() - 0.5) * 50, -50));
        left = Math.min(Math.max(left, 0), width);
        top += Math.round(Math.max((Math.random() - 0.5) * 50, -50));
        top = Math.min(Math.max(top, 0), height);
        e.style.left = `${left}px`;
        e.style.top = `${top}px`;
      });
    }, 1000 / 60);
    setTimeout(() => {
      clearInterval(entId);
      document.location.reload();
    }, 5000);
  }
}
let min = 0;
let sec = 0;
function setTimer() {
  const curTime = new Date(Date.now() - startTime);
  min = curTime.getMinutes();
  sec = curTime.getSeconds();

}
function displayTimer() {
  const minS = min < 10 ? `0${min}` : `${min}`;
  const secS = sec < 10 ? `0${sec}` : `${sec}`;
  timer.innerText = `${minS}:${secS}`;
  timer.style.color = redTimer ? 'red' : '';
}
startGame();
const timerId = setInterval(() => {
  setTimer();
  displayTimer();
}, 1000);