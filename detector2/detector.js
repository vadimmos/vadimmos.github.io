const indicator = document.getElementById('indicator');
const DIR_MAP = ['n', 'ne', 'e', 'es', 's', 'sw', 'w', 'wn'];
let bg = DIR_MAP[0];
let alpha = 0;
let coords = { latitude: 0, longitude: 0 };

const TARGET = { latitude: 54.644905, longitude: 39.656434 };

if (indicator && typeof Gyroscope === "function") {
  window.addEventListener("deviceorientation", (event) => {
    alpha = event.alpha;
    print();
  }, true);
}
if (indicator && 'geolocation' in navigator) {
  indicator.style.setProperty('color', 'lime');
  indicator.style.setProperty('white-space', 'pre');
  navigator.geolocation.getCurrentPosition(() => {
    navigator.geolocation.watchPosition(success, error, { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 });
  });
} else {
  indicator.style.setProperty('color', 'red');
  indicator.textContent = 'ERROR';
}

/** @type {PositionCallback}*/
function success(pos) {
  coords.latitude = pos.coords.latitude;
  coords.longitude = pos.coords.longitude;
  print();
}
function error(err) {
  indicator.style.setProperty('color', 'red');
  indicator.textContent = JSON.stringify(err);
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

function print() {
  const azimut = { x: TARGET.latitude - coords.latitude, y: TARGET.longitude - coords.longitude};
  const angle = getAngle(azimut.x, azimut.y, Math.sin(alpha), Math.cos(alpha));
  indicator.textContent = `
  target: ${JSON.stringify(TARGET)}
  current:${JSON.stringify(coords)}
  angle: ${angle}
  `;
  for (let deg = 0, idx = 0; deg < 360; deg += 45, idx++) {
    if (angle >= deg && angle < deg + 45) {
      bg = DIR_MAP[idx];
      break;
    }
  }
  indicator.style.setProperty('background-image', `url("./img/${bg}.png")`);
}

function getAngle(x1, y1, x2, y2) {
  // return Math.acos((y1 - y2) / (Math.sqrt(Math.abs(x1 ** 2 - x2 ** 2)) + Math.sqrt(Math.abs(y1 ** 2 - y2 ** 2)))) * (180 / Math.PI) + 180;
  return Math.acos((x1 * x2 + y1 * y2) / (Math.sqrt(x1 ** 2 + y1 ** 2) * Math.sqrt(x2 ** 2 + y2 ** 2))) * (180 / Math.PI) + 180;
}
