const indicator = document.getElementById('indicator');
if (indicator && typeof Gyroscope === "function") {
  window.addEventListener("deviceorientation", handleOrientation, true);
}

function handleOrientation(event) {
  const absolute = event.absolute;
  const alpha = event.alpha;
  const beta = event.beta;
  const gamma = event.gamma;

  const rad = Math.atan2(beta, gamma);
  const deg = rad * (180 / Math.PI) + 180;

  let bg = '0'

  for(let deg = -180, idx = 0;deg < 180; deg += 45, idx++){
    if (alpha >= deg && alpha < deg + 45){
      bg = idx.toString();
      break;
    }
  }
    indicator.style.setProperty('background-image', `url("./img/${bg}.png")`);
  }
