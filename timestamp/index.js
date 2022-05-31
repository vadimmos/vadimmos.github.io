import fontList from '../font-list.js'
let /**@type {File[]} */ photo_files = []
let /**@type {{file: File, row: HTMLLIElement, img: HTMLImageElement, a: HTMLAnchorElement, timeStampedFile?: File}[]} */ rowList = []
let /**@type {null | HTMLDialogElement} */ dialog = null;

const add_btn = findTypedElementById('add_btn', 'button')
const settings_btn = findTypedElementById('settings_btn', 'button')
const clear_btn = findTypedElementById('clear_btn', 'button')
const downLoad_btn = findTypedElementById('downLoad_btn', 'button')

const photo_ul = findTypedElementById('photo_ul', 'ul')


const li_template = findTypedElementById('li_template', 'template')
const settings_dialog_template = findTypedElementById('settings_dialog_template', 'template')


applyDisabledToButtons()


add_btn.addEventListener('click', addPhoto)
clear_btn.addEventListener('click', clear)
downLoad_btn.addEventListener('click', downloadAll)
settings_btn.addEventListener('click', showSettings)


let stamp_x = 24
let stamp_y = 48
let font_size = 24
let font_family = 'monospace'
let fill_color = '#ffffff'
let stroke_color = '#000000'
let stroke_width = 2
try {
  applySettings(JSON.parse(localStorage.getItem('settings')))
} catch (err) {
  console.log('no settings')
}

const pickerOpts = {
  types: [
    {
      description: 'Images',
      accept: {
        'image/*': ['.jpeg', '.jpg']
      }
    },
  ],
  excludeAcceptAllOption: true,
  multiple: true
}

async function addPhoto() {
  const photos = await showOpenFilePicker(pickerOpts)
  photo_files.push(...photos)
  fillList(photo_files)
}

function clear() {
  if (confirm(`Очистить список?`)) {
    rowList.forEach(f => URL.revokeObjectURL(f.img.src))
    photo_files.splice(0, photo_files.length)
    fillList()
  }
}

/**
 * @param {boolean | Event} force
 */
function downloadAll(force = false) {
  if (rowList.length > 3 && force !== true) {
    if (confirm(`Загрузить все фото? (будет [${rowList.length}] подтверждений)`)) downloadAll(true)
    return
  }
  rowList.forEach(f => f.a.click())
}
async function showSettings() {
  const settings = { stamp_x, stamp_y, font_size, font_family, fill_color, stroke_color, stroke_width };
  const fragment = settings_dialog_template.content.cloneNode(true)
  if (!(fragment instanceof DocumentFragment) || !(fragment.children[0] instanceof HTMLDialogElement)) return
  dialog = fragment.children[0]
  const form = dialog.getElementsByTagName('form')?.[0]
  const inputs = []
  inputs.push(...form.getElementsByTagName('input'))
  inputs.push(...form.getElementsByTagName('select'))
  for (const i of inputs) {
    switch (i.name) {
      case 'font_family': if (i instanceof HTMLSelectElement) {
        for (const f of fontList) {
          const opt = document.createElement('option')
          opt.textContent = f
          opt.value = f
          opt.selected = font_family === f
          i.appendChild(opt)
        }
      } break
      case 'font_size': if (i instanceof HTMLInputElement) {
        i.value = font_size.toFixed(0)
        i.oninput = () => settings.font_size = parseInt(i.value)
      } break
      case 'left': if (i instanceof HTMLInputElement) {
        i.value = stamp_x.toString()
        i.oninput = () => settings.stamp_x = parseInt(i.value)
      } break
      case 'top': if (i instanceof HTMLInputElement) {
        i.value = stamp_y.toString()
        i.oninput = () => settings.stamp_y = parseInt(i.value)
      } break
      case 'fill_color': if (i instanceof HTMLInputElement) {
        i.value = fill_color
        i.oninput = () => settings.fill_color = i.value
      } break
      case 'stroke_color': if (i instanceof HTMLInputElement) {
        i.value = stroke_color
        i.oninput = () => settings.stroke_color = i.value
      } break
      case 'stroke_width': if (i instanceof HTMLInputElement) {
        i.value = stroke_width.toString()
        i.oninput = () => settings.stroke_width = parseInt(i.value)
      } break
    }
  }
  for (const b of form.getElementsByTagName('button')) {
    switch (b.name) {
      case 'confirm': b.onclick = (e) => {
        e.preventDefault()
        applySettings(settings)
        closeDialog()
      }; break
      case 'cancel': b.onclick = (e) => {
        e.preventDefault()
        closeDialog()
      }; break
    }
  }
  dialog.appendChild(form)
  document.body.appendChild(dialog)
  dialog.showModal()
}
function applySettings(settings) {
  if (settings) {
    stamp_x = settings.stamp_x ?? stamp_x
    stamp_y = settings.stamp_y ?? stamp_y
    font_size = settings.font_size ?? font_size
    font_family = settings.font_family ?? font_family
    fill_color = settings.fill_color ??fill_color
    stroke_color = settings.stroke_color ?? stroke_color
    stroke_width = settings.stroke_width ?? stroke_width

    localStorage.setItem('settings', JSON.stringify(settings))

    fillList()
  }
}
function closeDialog() {
  if (dialog) {
    for (const e of dialog.getElementsByTagName('form')) e.remove()
    dialog?.close()
    dialog.remove()
  }
}
/**
 * @param {{img: HTMLImageElement, file: File}} row
 */
async function applyTimeStamp(row) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  await new Promise(resolve => setTimeout(() => { resolve() }, 1000))
  canvas.width = row.img.naturalWidth
  canvas.height = row.img.naturalHeight
  ctx.drawImage(row.img, 0, 0)
  const dateString = new Date(row.file.lastModified).toLocaleDateString()
  ctx.font = `${font_size}px ${font_family}`;
  // ctx.shadowColor="black"
  // ctx.shadowBlur=7
  ctx.lineWidth = stroke_width
  ctx.strokeStyle = stroke_color
  ctx.strokeText(dateString, stamp_x, stamp_y)
  // ctx.shadowBlur=0;
  ctx.fillStyle = fill_color
  ctx.fillText(dateString, stamp_x, stamp_y)
  const /**@type {Blob} */ blob = await new Promise(resolve => canvas.toBlob((res) => resolve(res), row.file.type))
  return new File([blob], row.file.name, { ...row.file })
}
/**
 * @param {File[]} files
 */
async function fillList(files = photo_files) {
  const elements = getRows()
  const l = Math.max(files.length, elements.length)
  let newRow = false
  rowList.splice(0, rowList.length)
  for (let i = 0; i < l; i++) {
    const row = { file: null, img: null, timeStampedFile: null };
    const elem = i in elements
      ? (newRow = false, elements[i])
      : (newRow = true, createRow())
    if (!(elem instanceof HTMLLIElement)) return;
    const file = files[i]

    if (!file) { elem.remove(); continue }

    const img = elem.getElementsByTagName('img')?.[0]
    const a = elem.getElementsByTagName('a')?.[0]
    const button = elem.getElementsByTagName('button')?.[0]

    a.textContent = file.name
    let resolve = null

    img.onload = async () => {
      const timeStampedFile = await applyTimeStamp({ img, file })
      a.href = URL.createObjectURL(timeStampedFile)
      a.download = file.name
    }
    img.src = URL.createObjectURL(file)

    button.onclick = () => {
      if (confirm(`Удалить из списка "${file.name}"?`)) {
        const idx = photo_files.indexOf(file)
        if (~idx) photo_files.splice(idx, 1)
        fillList()
      }
    }
    rowList.push({ file, img, a, row: elem })
    if (newRow) photo_ul.appendChild(elem)
  }
  applyDisabledToButtons()
}

function getRows() {
  return [...photo_ul.children].filter(e => e instanceof HTMLLIElement)
}

function createRow() {
  const fragment = li_template.content.cloneNode(true)
  if (!(fragment instanceof DocumentFragment)) return
  const li = fragment.children[0]
  if (li instanceof HTMLLIElement) return li
}

/**
 * @template {keyof HTMLElementTagNameMap} K
 * @param {string} id
 * @param {K} tag
 * @returns {HTMLElementTagNameMap[K]}
 */
function findTypedElementById(id, tag) {
  for (const e of document.getElementsByTagName(tag)) {
    if (e.id === id) return e
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
 * @returns {Promise<FileList>}
 */
function showOpenFilePicker(pickerOpts) {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    let types = ''
    for (const i of pickerOpts.types) {
      for (const k in i) {
        types += `${k}, `
        for (const t in i[k])
          types += `${t}, `
      }
    }
    input.setAttribute('accept', types)
    if (pickerOpts.multiple) {
      input.setAttribute('multiple', '')
    }
    input.onchange = () => resolve(input.files)
    input.click()
  })
}
function applyDisabledToButtons() {
  rowList.length === 0
    ? (downLoad_btn.setAttribute('disabled', ''), clear_btn.setAttribute('disabled', ''))
    : (downLoad_btn.removeAttribute('disabled'), clear_btn.removeAttribute('disabled'))
}