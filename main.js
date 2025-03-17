const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let mainWindow;
let serverProcess;

app.whenReady().then(() => {
    // Iniciar el servidor en segundo plano
    serverProcess = spawn("node", ["server.js"], {
        cwd: __dirname, // Asegurar que corre en la ruta del proyecto
        detached: true, // Permite que siga ejecutándose aunque Electron se cierre
        stdio: "ignore" // Evita bloquear la ejecución de Electron
    });

    serverProcess.unref(); // Permite que el proceso siga corriendo en segundo plano

    // Crear la ventana de Electron
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        webPreferences: {
            nodeIntegration: false
        }
    });

    mainWindow.loadURL("http://localhost:3000"); // Cargar la app desde el servidor

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
});

// Cerrar el servidor cuando la app se cierra
app.on("window-all-closed", () => {
    if (serverProcess) {
        serverProcess.kill(); // Detener el servidor al cerrar la app
    }
    if (process.platform !== "darwin") {
        app.quit();
    }
});
