const indicator = document.getElementById('indicator');
const DIR_MAP = ['n', 'ne', 'e', 'es', 's', 'sw', 'w', 'wn'];
let bg = DIR_MAP[0];

const TARGET = { latitude: 54.644905, longitude: 39.656434 };

if (indicator && 'geolocation' in navigator) {
  indicator.style.setProperty('color', 'lime');
  indicator.style.setProperty('padding', '16px');
  indicator.style.setProperty('white-space', 'pre');
  navigator.geolocation.watchPosition(success, error, { enableHighAccuracy: true, timeout: 1000, maximumAge: 0 });
} else {
  indicator.style.setProperty('color', 'red');
  indicator.textContent = 'ERROR';
}

/** @type {PositionCallback}*/
function success(pos) {
  indicator.textContent = `target: ${JSON.stringify(TARGET)}\r\ncurrent:${JSON.stringify(pos)}`;
}
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}
indicator.style.setProperty('background-image', `url("./img/${bg}.png")`);
