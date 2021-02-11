export function attachStyle(s, id) {
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement('style');
    style.id = id + '-style';
    document.head.appendChild(style);
  }
  style.textContent = s;
}