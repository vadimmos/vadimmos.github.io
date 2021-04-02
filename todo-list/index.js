const list = [];
const ul = document.createElement('ul');
ul.classList.add('to-do');
document.body.appendChild(ul);

const panel = document.createElement('div');
panel.classList.add('to-do-panel');

const addBtn = document.createElement('button');
addBtn.textContent = '+';
addBtn.classList.add('to-do-add-btn');
addBtn.addEventListener('click', () => { create() });
panel.appendChild(addBtn);

const clearBtn = document.createElement('button');
clearBtn.textContent = '🗑';
clearBtn.classList.add('to-do-add-btn');
clearBtn.addEventListener('click', () => { clear() });
panel.appendChild(clearBtn);

document.body.appendChild(panel);

load();

function save() {
  localStorage.setItem('list', JSON.stringify(list));
}
function load() {
  const data = JSON.parse(localStorage.getItem('list') || '[]');
  list.splice(0, list.length, ...data);
  render();
}
function render() {
  ul.innerHTML = '';
  list.forEach((i, idx) => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = i.completed;
    checkbox.addEventListener('input', () => { setComplete(idx, checkbox.checked) })
    li.appendChild(checkbox);
    const label = document.createElement('div');
    label.textContent = i.text;
    label.title = i.text;
    li.appendChild(label);
    const editBtn = document.createElement('button');
    editBtn.textContent = '✎';
    editBtn.addEventListener('click', () => { edit(idx); });
    li.appendChild(editBtn);
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.addEventListener('click', () => { remove(idx); });
    li.appendChild(deleteBtn);
    ul.appendChild(li);
  })
}
function edit(idx) {
  const text = prompt('Введите текст задачи', list[idx].text);
  list[idx].text = text;
  save();
  render();
}
function create() {
  const item = {
    completed: false,
    text: ''
  };
  list.push(item);
  edit(list.indexOf(item));
  save();
  render();
}
function setComplete(idx, val) {
  list[idx].completed = val;
  save();
  render();
}
function remove(idx) {
  if (confirm('Удалить запись?')) {
    list.splice(idx, 1);
    save();
    render();
  }
}
function clear() {
  if (confirm('Удалить все дела помеченные как выполненные?')) {
    list.splice(0, list.length, ...list.filter(l => !l.completed));
    save();
    render();
  }
}