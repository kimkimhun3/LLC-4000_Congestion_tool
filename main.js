const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs');
const ExcelJS = require('exceljs');

let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './jkj.ico',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
  }).then((file) => {
    if (!file.canceled && file.filePaths.length > 0) {
      const content = fs.readFileSync(file.filePaths[0], 'utf-8');
      event.reply('file-path', file.filePaths[0]);
      event.reply('file-content', content);
    }
  });
});

ipcMain.on('open-save-dialog', (event) => {
  dialog.showSaveDialog(win, {
    defaultPath: 'new-file.txt',
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
  }).then((file) => {
    if (!file.canceled) {
      fs.writeFileSync(file.filePath, '', 'utf-8');
      event.reply('file-created', file.filePath);
    }
  });
});

ipcMain.on('open-save-dialog2', (event) => {
  dialog.showSaveDialog(win, {
    defaultPath: 'new-file.txt',
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
  }).then((file) => {
    if (!file.canceled) {
      fs.writeFileSync(file.filePath, '', 'utf-8');
      event.reply('file-created-2', file.filePath);
    }
  });
});

ipcMain.on('open-save-dialog3', (event) => {
  dialog.showSaveDialog(win, {
    defaultPath: 'new-file.txt',
    filters: [{ name: 'Text Files', extensions: ['txt'] }],
  }).then((file) => {
    if (!file.canceled) {
      fs.writeFileSync(file.filePath, '', 'utf-8');
      event.reply('file-created-3', file.filePath);
    }
  });
});

ipcMain.on('open-save-dialog4', (event) => {
  dialog.showSaveDialog(win, {
    defaultPath: 'new-file.xlsx',
    filters: [{ name: 'Excel Files', extensions: ['xlsx'] }],
  }).then((file) => {
    if (!file.canceled) {
      // createExcelFile(file.filePath);
      fs.writeFileSync(file.filePath, '', 'utf-8');
      event.reply('file-created-4', file.filePath);
    }
  });
});

ipcMain.on('save-filesssss', (event, args) => {
  if (args.filePath) fs.writeFileSync(args.filePath, args.content, 'utf-8');
  if (args.filePath2) fs.writeFileSync(args.filePath2, args.content2, 'utf-8');
  if (args.filePath3) fs.writeFileSync(args.filePath3, args.content3, 'utf-8');
  // if (args.filePath4) saveExcelFile(args.filePath4, args.content4, 'utf-8');
});

function createExcelFile(filePath) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet 1');
  const dataForExcel = ['evt=40:JT=11825,JT-A=0,JT-SDA=0,RTT=111,RTT-A=0,RTT-SDA=0,RTT-STRD=0,RTT-LTRD=0,PLOST=29', 
  'evt=40:JT=34716,JT-A=0,JT-SDA=0,RTT=77,RTT-A=0,RTT-SDA=0,RTT-STRD=0,RTT-LTRD=0,PLOST=29', 
  'evt=40:JT=26840,JT-A=0,JT-SDA=0,RTT=86,RTT-A=0,RTT-SDA=0,RTT-STRD=0,RTT-LTRD=0,PLOST=29', 
  'evt=40:JT=26840,JT-A=0,JT-SDA=0,RTT=86,RTT-A=0,RTT-SDA=0,RTT-STRD=0,RTT-LTRD=0,PLOST=29', 
];

  const dataObjects = dataForExcel.map(parseEventData);
  const columns = Object.keys(dataObjects[0]).map((key) => ({
    header: key,
    key: key,
    width: 20,
  }));


  worksheet.columns = columns;
  worksheet.addRows(dataObjects);

  workbook.xlsx.writeFile(filePath)
    .then(() => {
      console.log('Excel file created successfully at:', filePath);
    })
    .catch((error) => {
      console.error('Error creating Excel file:', error);
    });
}

function saveExcelFile(filePath, content) {
  // If you want to modify an existing Excel file, you can do so here.
  // For simplicity, this example assumes you are creating a new Excel file every time.
}


