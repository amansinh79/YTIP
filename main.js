const { app, BrowserWindow } = require("electron")

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 660,
    height: 400,
  })

  mainWindow.loadURL(process.argv[2])
}

app.whenReady().then(() => {
  createWindow()

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit()
})
