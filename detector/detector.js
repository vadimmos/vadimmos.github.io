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


  console.log(beta);
  console.log(gamma);
  console.log(deg);
  console.log('');

  let bg = '0'

  if (deg >= 337.5 && deg < 22.5) {
    bg = '4';
  } else if (deg >= 22.5 && deg < 67.5) {
    bg = '5';
  } else if (deg >= 67.5 && deg < 112.5) {
    bg = '6';
  } else if (deg >= 112.5 && deg < 157) {
    bg = '7';
  } else if (deg >= 157 && deg < 202.5) {
    bg = '0';
  } else if (deg >= 202.5 && deg < 247.5) {
    bg = '1';
  } else if (deg >= 247.5 && deg < 292.5) {
    bg = '2';
  } else if (deg >= 292.5 && deg < 337.5) {
    bg = '3';
  }
    indicator.style.setProperty('background-image', `url("./img/${bg}.png")`);
  }
