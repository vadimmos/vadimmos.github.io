window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js')
      console.log('Service worker successfully registered', reg);
    } catch (err) {
      console.error(err);
    }
  }
});