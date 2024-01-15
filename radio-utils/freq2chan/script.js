const body = document.body;

const input = document.getElementById('input');
const datalist = document.getElementById('frequencies');
const thead = document.getElementById('thead');
const tbody = document.getElementById('tbody');

function get (node, key = 'root', idx = 0) {
  const span = document.createElement('span');
  span.textContent = node[key];
  return span;
};
function load (node, idx = 0, key = 'root') {
  return localStorage.getItem(`${location.pathname}/${idx}/${key}`) || '';
};
function save (node, idx = 0, key = 'root', value) {
  return localStorage.setItem(`${location.pathname}/${idx}/${key}`, value);
};

const header = {
  _idx: {},
  _value: {},
  chanel: {
    label: 'Канал',
  },
  label: {
    label: 'Частота',
  },
  description: {
    label: 'Заметка',
    render(node, key, idx) {
      const span = document.createElement('span');
      span.textContent = load(node, idx, key) || '-';
      return span;
    }
  },
  tools: {
    label: '☰',
    render(node, key, idx) {
      const tools = node[key];
      const div = document.createElement('div');
      div.classList.add('flex');
      for (const t of tools) {
        const btn = document.createElement('button');
        btn.textContent = t.label;
        btn.title = t.title;
        btn.addEventListener('click', () => {
          t.fn();
        });
        div.appendChild(btn);
      }
      return div;
    }
  }

};

const data = [];

let a = 433;
let b = 50;
for (let i = 0; i < 69; i++) {
  b += 25;
  if (b >= 1000) {
    a++;
    b = 0;
  }
  const whole = a.toString();
  const fract = b.toString().padStart(3, '0');
  const value = parseFloat(`${whole}.${fract.toString().padStart(3, '0')}`);
  const node = {
    _idx: i,
    _value: value,
    get _filter() {
      return `${node.chanel}, ${node.label}${node.description ? `, ${node.description}` : ''}`;
    },
    label: value.toString().padEnd(7, '0'),
    chanel: i + 1,
    description: localStorage.getItem(`${location.pathname}/${i}/description`) || '',
    tools: [
      {
        label: '🖊',
        title: 'Редактировать заметку',
        fn() {
          const value = prompt('Редактировать заметку', load(node, node._idx, 'description'));
          if (value !== null) {
            save(node, node._idx, 'description', value);
            node['description'] = value;
            updateDataList();
            drawTable();
          }
        }
      }
    ]
  };
  data.push(node);
}
updateDataList();
drawTable();

let updateId = 0;
input.addEventListener('input', () => {
  clearTimeout(updateId);
  updateId = setTimeout(() => {
    drawTable();
  }, 300);
});

function drawTable(filter = input.value) {
  requestAnimationFrame(() => {
    thead.innerHTML = '';
    const headRow = document.createElement('tr');
    for (const k in header) {
      if (k.startsWith('_')) continue;
      const val = header[k];
      const col = document.createElement('th');
      col.textContent = val.label;
      headRow.appendChild(col);
    }
    thead.appendChild(headRow);
    tbody.innerHTML = '';
    (filter
      ? data.filter((r) => filter.split(',').every(p => p === '*' || r._filter.includes(p)))
      : [...data]
    ).map((r) => {
      const row = document.createElement('tr');
      for (const k in header) {
        if (k.startsWith('_')) continue;
        const col = document.createElement('td');
        const idx = r._idx;
        col.appendChild(header[k].render?.(r, k, idx) || get(r, k, idx));
        row.appendChild(col);
      }
      tbody.appendChild(row);
    });
  });
}
function updateDataList() {
  requestAnimationFrame(() => {
    datalist.innerHTML = '';
    for (const node of data) {
      const option = document.createElement('option');
      option.value = node._filter;
      datalist.appendChild(option);
    }
  })
}
