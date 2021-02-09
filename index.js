import { MenuItem, VBMenu } from './components/menu/menu.js'
window.addEventListener('load', async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker successfully registered', reg);
    } catch (err) {
      console.error(err);
    }
  }
  const mainMenu = document.getElementById('mainMenu');
  if (mainMenu && mainMenu instanceof VBMenu)
  mainMenu.items = [
    new MenuItem('SQL', '/sql-test'),
    new MenuItem('minesweeper', '/minesweeper'),
    new MenuItem('detector', '/detector'),
    new MenuItem('detector 2', '/detector2'),
    new MenuItem('S.E.A.R.C.H.E.R.', '/s.e.a.r.c.h.e.r.'),
  ]
});