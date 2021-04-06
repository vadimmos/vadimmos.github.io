import './qr.js';
const body = document.body;

const qr = document.createElement('qr-code');
body.appendChild(qr);
qr.data = 'какой-то текст';


if (!('BarcodeDetector' in window)) {
  alert('нету BarcodeDetector');
} else {
  const video = document.createElement('video');
  const main = document.querySelector('main');
  main.appendChild(video);

  const cnv = document.createElement('canvas');
  main.appendChild(cnv);
  const ctx = cnv.getContext('2d');
  const img = new Image();
  main.appendChild(img);
  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then(async (stream) => {
      video.srcObject = stream;
      video.play();

      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const barcodeDetector = new BarcodeDetector({ formats: ['qr_code'] });

      const imageBitmap = await imageCapture.grabFrame();
      drawCanvas(imageBitmap);

      const barcodes = barcodeDetector.detect(img)
      barcodes.forEach(barcode => console.log(barcode.rawData));
    })
    .catch(function (err) {
      console.log("An error occurred: " + err);
    });
}

function drawCanvas(img) {
  cnv.width = parseInt(getComputedStyle(cnv).width.split('px')[0]);
  cnv.height = parseInt(getComputedStyle(cnv).height.split('px')[0]);
  let ratio = Math.min(cnv.width / img.width, cnv.height / img.height);
  let x = (cnv.width - img.width * ratio) / 2;
  let y = (cnv.height - img.height * ratio) / 2;
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  ctx.drawImage(img, 0, 0, img.width, img.height,
    x, y, img.width * ratio, img.height * ratio);
  return cnv.toDataURL();
}

