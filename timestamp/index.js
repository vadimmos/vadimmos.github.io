const add_btn = findTypedElementById('add_btn', 'button')
const settings_btn = findTypedElementById('settings_btn', 'button')
const cancel_btn = findTypedElementById('cancel_btn', 'button')
const apply_btn = findTypedElementById('apply_btn', 'button')

const photo_ul = findTypedElementById('photo_ul', 'ul')
const li_template = findTypedElementById('li_template', 'template')



add_btn.addEventListener('click', addPhoto)
cancel_btn.addEventListener('click', cancel)
apply_btn.addEventListener('click', apply)

let photo_files = null;

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
};

if (!('showOpenFilePicker' in window)) {
  Object.defineProperty(window, 'showOpenFilePicker', {
    value: async function (pickerOpts) {
      return new Promise((resolve, reject) => {
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
  })
}


async function addPhoto() {
  // @ts-ignore
  photo_files = await showOpenFilePicker(pickerOpts)
  fillList(photo_files)
}

function cancel() {
  photo_files = null

}

function apply() {
  photo_files = null
}
/**
 * @param {FileSystemFileHandle[]} files
 */
async function fillList(files) {
  for (const file of await Promise.all(files.map(f => f.getFile()))) {
    const li = li_template.content.cloneNode(true)
    if (!(li instanceof HTMLLIElement)) return
    const img = li.getElementsByTagName('img')?.[0];
  }
  photo_ul.hidden = false
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