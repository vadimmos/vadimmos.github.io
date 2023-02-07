

const getImageBtn = getElem('getImageBtn', HTMLButtonElement);
const canvas = getElem('canvas', HTMLCanvasElement);
const list = getElem('list', HTMLTableElement);
const listItemTemplate = getElem('listItemTemplate', HTMLTemplateElement);

const pickerOpts = {
  types: [
    {
      description: 'Images',
      accept: {
        'image/*': ['.*']
      }
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false
};

const ctx = canvas.getContext('2d', { willReadFrequently: true });

getImageBtn.addEventListener('click', async () => {
  const [file] = await showOpenFilePicker(pickerOpts) || [];
  if (file) {
    const image = new Image;
    image.src = URL.createObjectURL(file);
    await image.decode();
    const w = canvas.width = image.naturalWidth;
    const h = canvas.height = image.naturalHeight;
    // const aspect = w / h;
    // canvas.style.setProperty('height', String(canvas.offsetWidth/aspect))
    if (ctx) {
      ctx.drawImage(image, 0, 0);
      /**
       * @type {{[key: string]:number}}
       */
      const colors = {};
      list.innerHTML = '...ЗАГРУЗКА...';
      const data = ctx.getImageData(0, 0, w, h).data;
      for (let i = 0; i < data.length; i += 4) {
        const key = Array.from(data.slice(i, i + 4)).join(',');
        colors[key] ??= 0;
        colors[key]++;
      }
      list.innerHTML = '';
      list.style.setProperty('max-height', (list.parentElement?.offsetHeight||100)-32 + 'px');
      for (const color of Object.keys(colors).sort((a, b) => colors[a] > colors[b] ? -1 : 1)) {
        const row = Array.from(listItemTemplate.content.cloneNode(true)?.children)[0];
        if (row instanceof HTMLElement) {
          const [colorBox, colorText, colorCount] = Array.from(row.children);
          if (colorBox instanceof HTMLElement) {
            colorBox.style.setProperty('background-color', `rgba(${color})`);
            colorBox.style.setProperty('border', '1px solid white');
          }
          colorText.textContent = `(${color})`;
          colorCount.textContent = colors[color].toString();
          list.appendChild(row);
        }
      }
    }
  }
});

/**
 * @template T
 * @param {string} id
 * @param {new () => T} type
 * @returns {T}
 */
function getElem(id, type) {
  const elem = document.getElementById(id);
  if (elem instanceof type) {
    return elem;
  }
  else {
    throw new Error(`Element "${id}" is not a ${type.name}!`);
  }
}
/**
 * @typedef FilePickerOptions
 * @property {{description: string, accept: Object.<string, string[]>}[]} types
 * @property {boolean} excludeAcceptAllOption
 * @property {boolean} multiple
 */


/**
 * @param {FilePickerOptions} pickerOpts
 * @returns {Promise<FileList | null>}
 */
function showOpenFilePicker(pickerOpts) {
  return new Promise(resolve => {
    const input = document.createElement('input');
    input.type = 'file';
    let types = '';
    for (const i of pickerOpts.types) {
      for (const k in i) {
        types += `${k}, `;
        for (const t in i[k])
          types += `${t}, `;
      }
    }
    input.setAttribute('accept', types);
    if (pickerOpts.multiple) {
      input.setAttribute('multiple', '');
    }
    input.onchange = () => resolve(input.files);
    input.click();
  });
}