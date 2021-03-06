import './qr.js';
const body = document.body;
const main = document.querySelector('main');
main.style.setProperty('flex-direction', 'column');
main.style.setProperty('align-items', 'center');

const video = document.createElement('video');

const cnv = document.createElement('canvas');
cnv.style.setProperty('width', '256px');
cnv.style.setProperty('height', '256px');
cnv.width = 256;
cnv.height = 256;
video.style.setProperty('width', '256px');
video.style.setProperty('height', '256px');

const qr = document.createElement('qr-code');
main.appendChild(qr);
qr.data = 'какой-то текст';

const btn = document.createElement('button');
btn.textContent = 'START';
btn.addEventListener('click', () => start());
main.appendChild(btn);


function start(){
  if (!('BarcodeDetector' in window)) {
    alert('нету BarcodeDetector');
  } else {
    btn.disabled = true;
    main.appendChild(video);
    main.appendChild(cnv);
    function drawCanvas(img) {
      let ratio = Math.min(cnv.width / img.width, cnv.height / img.height);
      let x = (cnv.width - img.width * ratio) / 2;
      let y = (cnv.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, cnv.width, cnv.height);
      ctx.drawImage(img, 0, 0, img.width, img.height,
        x, y, img.width * ratio, img.height * ratio);
      return cnv.toDataURL();
    }
    const ctx = cnv.getContext('2d');
    const img = new Image();
    main.appendChild(img);
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: "environment" } }, audio: false })
      .then(async (stream) => {
        video.srcObject = stream;
        video.play();

        const track = stream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(track);
        const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });

        const interval = setInterval(async () => {
          const imageBitmap = await imageCapture.grabFrame();
          img.src = drawCanvas(imageBitmap);
          const barcodes = await barcodeDetector.detect(img);
          barcodes.forEach(barcode => {
            alert(JSON.stringify(barcode));
            if (barcode.rawValue) {
              clearInterval(interval);
              btn.disabled = false;
              alert(barcode.rawValue);
            }
          });
        }, 300);
      })
      .catch(function (err) {
        console.log("An error occurred: " + err);
      });
  }
}

