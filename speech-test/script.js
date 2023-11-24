var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

document.addEventListener(`DOMContentLoaded`, () => {
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'ru-RU';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  const sw = document.getElementById('switch');
  sw.addEventListener('click', (evt) => {
    if (sw.checked) {
      start();
    }
    if (sw.changed) {
      stop();
    }
  });

  const out = document.getElementById('out');
  const copyBtn = document.getElementById('copyBtn');

  copyBtn.addEventListener('click', () => {
    out.focus();
    out.select();
    document.execCommand('copy');
  });

  recognition.onresult = function (event) {
    out.value += event.results[0][0].transcript;
    stop();
  };

  recognition.onspeechend = function () {
    stop();
  };

  recognition.onnomatch = function (event) {
    stop();
  };

  recognition.onerror = function (event) {
    stop();
    out.value = 'Error occurred in recognition: ' + event.error;
  };
  function start() {
    try {
      recognition.start();
    } catch (err) {
      console.error(err);
    }
  }
  function stop() {
    recognition.stop();
    sw.disabled = false;
    sw.checked = false;
    out.value += '\n';
  }
});
