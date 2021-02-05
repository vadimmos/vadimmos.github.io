window.addEventListener('DOMContentLoaded', async () => {
  const BASE_NAME = 'TestDataBase';
  const HISTORY = JSON.parse(localStorage.getItem('history') || '[]');

  // const h1 = document.createElement('h1');
  // h1.textContent = BASE_NAME;
  // document.body.insertBefore(h1, document.body.firstChild);

  const DB = openDatabase(BASE_NAME, "0.1", "Test database", 200000);
  const sendBtn = document.getElementById('sendBtn');
  const textArea = document.getElementById('query');
  const output = document.getElementById('output');
  const history = document.getElementById('history');
  const suggestions = document.getElementById('suggestions');
  if (!sendBtn || !(sendBtn instanceof HTMLButtonElement)) throw new Error('Нет кнопки');
  if (!textArea || !(textArea instanceof HTMLTextAreaElement)) throw new Error('Нет поля для ввода запроса');
  if (!output) throw new Error('Некуда выводить');
  if (!history) throw new Error('Нет истории');
  if (!suggestions) throw new Error('Нет подсказок');

  fetch('./suggestions.json').then(async response => {
    if (response.ok) {
      const sugg = await response.json();
      sugg.forEach(s => {
        const tmp = document.getElementById('line');
        if (tmp instanceof HTMLTemplateElement) {
          const l = tmp.content.cloneNode(true);
          const a = l.querySelector('a');
          a.href = '/';
          a.textContent = s;
          a.addEventListener('click', (e) => {
            e.preventDefault();
            const start = textArea.selectionStart;
            const end = textArea.selectionEnd;
            const s1 = textArea.value.slice(0, Math.min(start, end));
            const s2 = textArea.value.slice(Math.max(start, end));
            textArea.value = `${s1}${s}${s2}`;
            textArea.focus();
          });
          suggestions.appendChild(l);
        }
      });
    }
  })

  updateHistory();
  sendBtn.addEventListener('click', submit);
  textArea.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.keyCode === 13) {
      submit(e);
    }
  });


  function submit(evt) {
    evt.preventDefault();
    const qText = textArea.value;
    if (qText) {
      const sqls = qText.split(';');
      DB.transaction(function (tx) {
        for (const s of sqls) {
          if (s) tx.executeSql(s, [], result, onError);
        }
      });
      updateHistory(qText);
    }
  }
  function result(tx, result) {
    console.log(result);
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const htr = document.createElement('tr');
    thead.appendChild(htr);
    table.appendChild(thead);
    const cols = new Set;
    for (const r of result.rows) {
      const tr = document.createElement('tr');
      for (const k in r) {
        cols.add(k);
        const td = document.createElement('td');
        tr.appendChild(td);
        td.textContent = r[k];
      }
      table.appendChild(tr);
    }
    for (const c of cols) {
      const td = document.createElement('td');
      td.textContent = c;
      htr.appendChild(td);
    }
    output.innerHTML = '';
    output.appendChild(table);
  }
  function onError(tx, error) {
    console.error(error);
    alert(error.message);
  }

  function updateHistory(text) {
    if (text && !HISTORY.includes(text)) {
      HISTORY.push(text);
      localStorage.setItem('history', JSON.stringify(HISTORY));
    }
    const fr = new DocumentFragment;
    for (const s of HISTORY) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = s;
      a.title = s;
      a.href = '/';
      a.addEventListener('click', (e) => {
        e.preventDefault();
        textArea.value = s;
      });
      li.appendChild(a);
      fr.appendChild(li);
    }
    history.innerHTML = '';
    history.appendChild(fr);
  }
});
