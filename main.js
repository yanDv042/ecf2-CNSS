const { app, BrowserWindow } = require('electron');
const path = require('path');

// fenetre principale de l'app
function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'src', 'preload.js'), 
      contextIsolation: true,     
      nodeIntegration: false,     
      enableRemoteModule: false,   
       webSecurity: false
    }
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html')); 
}

// Lancement de l'app quand Electron est prêt
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Fermer l'app quand toutes les fenêtres sont fermées
app.on('window-all-closed', () => {
  // Sur Windows et Linux, on ferme ; sur macOS, on reste ouvert
  if (process.platform !== 'darwin') app.quit();
});
