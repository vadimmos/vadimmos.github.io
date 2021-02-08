const indicator = document.getElementById('indicator');
if (indicator && typeof Gyroscope === "function") {
  window.addEventListener("deviceorientation", handleOrientation, true);
}
let debug = null;
let id = 0;
let count = 0;
function cheat() {
  clearTimeout(id);
  count++;
  id = setTimeout(() => {
    if (count >= 10) {
      window.removeEventListener('click', cheat);
      debug = document.createElement('div');
      debug.style.setProperty('position', 'fixed');
      debug.style.setProperty('top', '100px');
      debug.style.setProperty('left', '45%');
      debug.style.setProperty('color', 'red');
      document.body.appendChild(debug);
    }
    count = 0;
  }, 1000);
}
window.addEventListener('click', cheat);

function handleOrientation(event) {
  const absolute = event.absolute;
  const alpha = event.alpha;
  const beta = event.beta;
  const gamma = event.gamma;

  const rad = Math.atan2(beta, gamma);
  const deg = rad * (180 / Math.PI) + 180;

  let bg = '0'

  for (let deg = 0, idx = 0; deg < 360; deg += 45, idx++) {
    if (alpha >= deg && alpha < deg + 45) {
      bg = idx.toString();
      break;
    }
  }
  if (debug) {
    debug.textContent = alpha;
  }
  indicator.style.setProperty('background-image', `url("./img/${bg}.png")`);
}
