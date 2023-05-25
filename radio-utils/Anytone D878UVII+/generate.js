const get_btn = document.getElementById('gen_btn');

if (get_btn instanceof HTMLButtonElement) {
  get_btn.addEventListener('click', () => {
    let result = '';
    result += '"id","num","aeskey"';
    for (let i = 1; i <= 256; i++){
      result += `\r\n"${i}","64","${gen64x16()}"`;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([result], {type: 'text/csv'}));
    a.download = 'AES-7222808e.csv';
    a.click();
  });
}

function gen64x16() {
  const symbols = '0123456789abcdef';
  let s = '';
  for (let i = 0; i < 64; i++){
    const idx = Math.floor(Math.random() * symbols.length - 1) + 1;
    s += symbols[idx];
  }
  return s;
}