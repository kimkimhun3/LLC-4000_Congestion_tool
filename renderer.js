// const { ipcRenderer } = require("electron");

var inputText = "";
var simpleB;
let jkjArmy = [];
let newArr = [];
let decodedStringFde9 = [];
let decodedStringFde8 = []; 
function hexToAscii(hex) {
  let asciiString = "";
  for (let i = 0; i < hex.length; i += 2) {
    const hexCode = parseInt(hex.substr(i, 2), 16);
    asciiString += String.fromCharCode(hexCode);
  }
  return asciiString;
}

let selectedDirectory;
let fileContent = "";
function submitForm() {}

function openFile() {
  ipcRenderer.send("open-file-dialog");
}
function openSaveDialog() {
  if (document.getElementById("portNumber1").value === "") {
    showAlert("ポート番号を入力してください！");
  } else {
    ipcRenderer.send("open-save-dialog");
  }
}
function openSaveDialog2() {
  if (document.getElementById("portNumber2").value === "") {
    showAlert("ポート番号を入力してください！");
  } else {
    ipcRenderer.send("open-save-dialog2");
  }
}
function openSaveDialog3() {
  if (
    document.getElementById("portNumber1").value === "" &&
    document.getElementById("portNumber2").value === ""
  ) {
    showAlert("ポート番号を入力してください！");
  } else {
    ipcRenderer.send("open-save-dialog3");
  }
}
function openSaveDialog4() {
  if (
    document.getElementById("portNumber1").value === "" &&
    document.getElementById("portNumber2").value === ""
  ) {
    showAlert("ポート番号を入力してください！");
  } else {
    ipcRenderer.send("open-save-dialog4");
  }
}
function saveFile() {
  const downloadBtn = document.getElementById("downloadBtn");
  const loadingOverlay = document.getElementById("loadingOverlay");
  handleConvert();
  const content = document.getElementById("fileContent").value;
  const content2 = document.getElementById("fileContent2").value;
  const content3 = document.getElementById("fileContent3").value;
  const content4 = document.getElementById("fileContent4").value;
  if (
    !window.currentFilePath &&
    !window.currentFilePath2 &&
    !window.currentFilePath3 &&
    !window.currentFilePath4
  ) {
    showAlert("ファイルパスを入力してください！");
  } else {
    loadingOverlay.style.display = "flex";
    ipcRenderer.send("save-filesssss", {
      filePath: window.currentFilePath,
      content,
      filePath2: window.currentFilePath2,
      content2,
      filePath3: window.currentFilePath3,
      content3,
    });
    if (window.currentFilePath4) {
    createExcelFile(window.currentFilePath4);} else {
      setTimeout(() => {
        // Hide loading overlay when the download is complete
        loadingOverlay.style.display = "none";
        showAlert("ファイルダウンロードを保存しました");
        ipcRenderer.send("download-complete");
      }, 1500); // Adjust the duration based on your actual download time
    }
   
  }
}
ipcRenderer.on("file-content", (event, content) => {
  inputText = content;
});
ipcRenderer.on("file-created", (event, filePath) => {
  window.currentFilePath = filePath;
  showAlert("ファイルを作成した：" + "<br>" + filePath);
  const filePathElement = document.getElementById("created-file1");
  filePathElement.innerHTML = filePath;
});
ipcRenderer.on("file-created-2", (event, filePath) => {
  window.currentFilePath2 = filePath;
  showAlert("ファイルを作成した:" + "<br>" + filePath);
  const filePathElement = document.getElementById("created-file2");
  filePathElement.innerHTML = filePath;
});
ipcRenderer.on("file-created-3", (event, filePath) => {
  window.currentFilePath3 = filePath;
  showAlert("ファイルを作成した:" + "<br>" + filePath);
  const filePathElement = document.getElementById("created-file3");
  filePathElement.innerHTML = filePath;
});
ipcRenderer.on("file-created-4", (event, filePath) => {
  window.currentFilePath4 = filePath;
  showAlert("ファイルを作成した:" + "<br>" + filePath);
  const filePathElement = document.getElementById("created-file4");
  filePathElement.innerHTML = filePath;
});
ipcRenderer.on("file-path", (event, filePath) => {
  const filePathElement = document.getElementById("uploaded-file-path");
  filePathElement.innerText = filePath;
});
function handleConvert() {
  const inputTexts = [
    "evt=0:JT=11825,JT-A=0,JT-SDA=0,RTT=111,RTT-A=0,RTT-SDA=0,RTT-STRD=0,RTT-LTRD=0,PLOST=29",
    "evt=40:JT=11825,JT-A=0,JT-SDA=0,RTT=111,RTT-A=0,RTT-SDA=0,RTT-STRD=0,RTT-LTRD=0,PLOST=29",
  ];
  const excelData = inputTexts
    .map((line) => {
      const values = line.split(",").map((pair) => pair.split("=")[1]);
      return values.join(",");
    })
    .join("\n");

  const fileContent = document.getElementById("fileContent");
  const fileContent2 = document.getElementById("fileContent2");
  const fileContent3 = document.getElementById("fileContent3");
  const fileContent4 = document.getElementById("fileContent4");
  const portNumber1 = document.getElementById("portNumber1").value;
  const portNumber2 = document.getElementById("portNumber2").value;
  const hexPort1 = parseInt(portNumber1).toString(16); //port1 convert to hexadecial
  const hexPort2 = parseInt(portNumber2).toString(16); //port2 convert to hexadecial
  const hexValues = inputText
    .split("\n")
    .map((line) => {
      const hexString = line.substring(6, 56).replace(/ /g, ""); // Extracting the hex values
      return hexString;
    })
    .flat();
  const resultArray = [];
  let currentSum = [];

  for (const hexString of hexValues) {
    let sum = "";
    if (hexString === "") {
      // Empty string encountered, add the current sum to the result array and reset for the next index
      resultArray.push(currentSum);
      currentSum = [];
    } else {
      // Convert each pair of hex characters to decimal and sum them
      sum += hexString;
      currentSum.push(sum);
    }
  }
  const groupFde8 = [];
  const groupFde9 = [];
  const allPort = [];
  const target = resultArray
    .filter((i) => i.length > 0)
    .map((item) => item.reduce((a, b) => a + b));
  for (const item of target) {
    if (item.includes(hexPort1)) {
      groupFde8.push(item);
    } else if (item.includes(hexPort2)) {
      groupFde9.push(item);
    }
  }
  for (const item of target) {
    if (item.includes(hexPort1) || item.includes(hexPort2)) {
      allPort.push(item);
    }
  }
  const decodeFde8 = groupFde8.map((item) => {
    const findFde8 = item.indexOf(hexPort1);
    return item.substr(findFde8 + 12);
  });
  const decodeFde9 = groupFde9.map((item) => {
    const findFde8 = item.indexOf(hexPort2);
    return item.substr(findFde8 + 12);
  });
  const allDecode = allPort.map((item) => {
    const findPort1 = item.indexOf(hexPort1);
    const findPort2 = item.indexOf(hexPort2);
    const indexToUse =
      findPort1 !== -1 ? findPort1 : findPort2 !== -1 ? findPort2 : -1;
    if (indexToUse !== -1) {
      return item.substr(indexToUse + 12);
    } else {
      // Handle the case where neither hexPort1 nor hexPort2 is found
      return null; // or any other value based on your requirement
    }
  });

  decodedStringFde8 = decodeFde8.map(hexToAscii);
  decodedStringFde9 = decodeFde9.map(hexToAscii);
  console.log("FDE9( Length: ",decodedStringFde9.length);
  console.log("Full Data: ", decodedStringFde9);
  // for (let i = 0; i < decodedStringFde9.length; i++) {
  //   newArr.filter(element => !elementsToRemove.includes(element)).map(element => element.replace(/[^a-zA-Z0-9=,:-]/g, ''));
  // }
  const elementsToRemove = [
    'pLuWgCCcC2BB4D3ECrEB2EB4DcBEB5EC2EBEC5C',
    'ouWgCCCcBcC2B4DScECEBEB4DSEB5ECsEBECC5C'
  ];
  
  newArr = decodedStringFde9.map((element, index) => {
    for (const pattern of elementsToRemove) {
      element = element.replace(pattern, '');
    }
  
    // Convert sequence numbers to integers
    element = element.replace(/(\d+)\s/g, (match, group1) => `${parseInt(group1, 10)} `);
  
    return element.replace(/[^a-zA-Z0-9=,:-]/g, '');
  }).filter(element => element !== undefined);
  

  console.log("This is new array:",newArr);
  // jkjArmy = decodedStringFde9.map((line) => line.replace(/\s+/g, '')).join('\n').split(',');
  // //jkjArmy = decodedStringFde9.map((str) => str.replace(/\n/g, ''));
  // //window.jkjArmy = jkjArmy;
  // console.log("jkjArmy Value: ",jkjArmy.length);

  const decodedAll = allDecode.map(hexToAscii);
  // Assign decoded strings to global variables
  window.decodedStringFde8 = decodedStringFde8
    .map((line) => line.replace(/\s+/g, ""))
    .join("\n");
  window.decodedStringFde9 = decodedStringFde9
    .map((line) => line.replace(/\s+/g, ""))
    .join("\n");
  window.decodedAll = decodedAll
    .map((line) => line.replace(/\s+/g, ""))
    .join("\n");
  window.excelData = excelData;

  fileContent.value = window.decodedStringFde8;
  fileContent2.value = window.decodedStringFde9;
  fileContent3.value = window.decodedAll;
  fileContent4.value = window.excelData;
}
function showAlert(message) {
  const alertOverlay = document.getElementById("alertOverlay");
  const alertModal = document.getElementById("alertModal");
  const alertMessage = document.getElementById("alertMessage");
  const alertCloseBtn = document.getElementById("alertCloseBtn");

  alertMessage.innerHTML = message.replace("\n", "<br>");
  alertOverlay.style.display = "flex";
  alertCloseBtn.addEventListener("click", () => {
    alertOverlay.style.display = 'none';
    closeAlert();
  });
  // Close the alert when the user presses Enter, Space, or Esc
  document.addEventListener("keydown", handleKeyDown);
}
function closeAlert() {
  const alertOverlay = document.getElementById("alertOverlay");
  alertOverlay.style.display = "none";
  // Remove the event listener to avoid potential memory leaks
  document.removeEventListener("keydown", handleKeyDown);
}
function handleKeyDown(event) {
  // Check if the pressed key is Enter (key code 13), Space (key code 32), or Esc (key code 27)
  if (event.keyCode === 13 || event.keyCode === 32 || event.keyCode === 27) {
    closeAlert();
  }
}

function parseEventData(dataString) {
  const eventData = {};
  const keyValuePairs = dataString.split(':').pop().split(',');

  keyValuePairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    eventData[key] = parseInt(value, 10);
  });

  return eventData;
}

function createExcelFile(filePath) {
  // Assuming newArr is your array of data
  const dataObjects = newArr
    .filter((dataString) => !dataString.includes('pLuWgCCcC2BB4D3ECrEB2EB4DcBEB5EC2EBEC5C') && !dataString.includes('ouWgCCCcBcC2B4DScECEBEB4DSEB5ECsEBECC5C'))
    .map(parseEventData);

  if (!dataObjects || dataObjects.length === 0) {
    console.error('Data objects are undefined or have length 0.');
    return;
  }

  // Extract all unique property names from all data points
  const allProperties = Array.from(new Set(dataObjects.flatMap((item) => Object.keys(item))));

  // Prepare data for xlsx-chart for all data
  const chartData = {};
  allProperties.forEach((columnName) => {
    chartData[columnName] = dataObjects.map((item) => (item && item[columnName] !== undefined ? item[columnName] : null));
  });
  const jtChartData = {
    JT: dataObjects.map((item) => (item && item['JT'] !== undefined ? item['JT'] : null)),
  }
  const jtAChartData = {
    'JT-A': dataObjects.map((item) => (item && item['JT-A'] !== undefined ? item['JT-A'] : null)),
  };
  const jtSDAChartData = {
    'JT-SDA': dataObjects.map((item) => (item && item['JT-SDA'] !== undefined ? item['JT-SDA'] : null)),
  };
  const rttChartData = {
    RTT: dataObjects.map((item) => (item && item['RTT'] !== undefined ? item['RTT'] : null)),
  };
  const rttAChartData = {
    'RTT-A': dataObjects.map((item) => (item && item['RTT-A'] !== undefined ? item['RTT-A'] : null)),
  };
  const rttSDAChartData = {
    'RTT-SDA': dataObjects.map((item) => (item && item['RTT-SDA'] !== undefined ? item['RTT-SDA'] : null)),
  };
  const rttSTRDChartData = {
    'RTT-STRD': dataObjects.map((item) => (item && item['RTT-STRD'] !== undefined ? item['RTT-STRD'] : null)),
  };
  const rttLTRDChartData = {
    'RTT-LTRD': dataObjects.map((item) => (item && item['RTT-LTRD'] !== undefined ? item['RTT-LTRD'] : null)),
  };
  const plostChartData = {
    PLOST: dataObjects.map((item) => (item && item['PLOST'] !== undefined ? item['PLOST'] : null)),
  }
  const xlsxChart = new XLSXChart();

  // Prepare options for the first chart (all data)
  const opts = {
    chart: 'line',
    titles: allProperties,
    fields: dataObjects.map((_, i) => i), // Use allProperties for fields
    data: chartData,
    chartTitle: 'All Data Line Chart',
    lineWidth: 0.2,
    lineStyle: Array(allProperties.length).fill('none'),
  };
  console.log(typeof dataObjects.map((_, i) => i));
  console.log("Ah nis ey ke: ",dataObjects.map((_, i) => i));

  const fieldDataset = dataObjects.map((_, i) => i)
  const ouropts = {
    charts: [
      {
        chart: 'column',
        titles: allProperties,
        fields: fieldDataset,
        data: chartData,
        chartTitle: 'All Data Line Chart',
        lineWidth: 0.2,
        lineStyle: Array(allProperties.length).fill('none'),
      },
      {
        chart: 'column',
        titles: ['JT'],
        fields: fieldDataset,
        data: jtChartData,
        chartTitle: 'JT Line Chart',
        lineWidth: 0.2,
        lineStyle: ['blue'],
      },
      {
        chart: 'column',
        titles: ['JT-A'],
        fields: fieldDataset,
        data: jtAChartData,
        chartTitle: 'JT-A Line Chart',
        lineWidth: 0.2,
        lineStyle: ['red'],
      },
      {
        chart: 'column',
        titles: ['JT-SDA'],
        fields: fieldDataset,
        data: jtSDAChartData,
        chartTitle: 'JT-SDA Line Chart',
        lineWidth: 0.2,
        lineStyle: ['blue'],
      },
      {
        chart: 'column',
        titles: ['RTT'],
        fields: fieldDataset, // Use allProperties for fields
        data: rttChartData,
        chartTitle: 'RTT Line Chart',
        lineWidth: 0.2,
        lineStyle: ['green'],
      },
      {
        chart: 'column',
        titles: ['RTT-A'],
        fields: fieldDataset,
        data: rttAChartData,
        chartTitle: 'RTT-A Line Chart',
        lineWidth: 0.2,
        lineStyle: ['yellow'],
      },
      {
        chart: 'column',
        titles: ['RTT-SDA'],
        fields: fieldDataset,
        data: rttSDAChartData,
        chartTitle: 'RTT-SDA Line Chart',
        lineWidth: 0.2,
        lineStyle: ['purple'],
      },
      {
        chart: 'column',
        titles: ['RTT-STRD'],
        fields: fieldDataset,
        data: rttSTRDChartData,
        chartTitle: 'RTT-STRD Line Chart',
        lineWidth: 0.2,
        lineStyle: ['cyan'],
      },
      {
        chart: 'column',
        titles: ['RTT-LTRD'],
        fields: fieldDataset,
        data: rttLTRDChartData,
        chartTitle: 'RTT-LTRD Line Chart',
        lineWidth: 0.2,
        lineStyle: ['orange'],
      },
      {
        chart: 'column',
        titles: ['PLOST'],
        fields: fieldDataset,
        data: plostChartData,
        chartTitle: 'PLOST Line Chart',
        lineWidth: 0.2,
        lineStyle: ['yellow'],
      },
    ],
  };

    // table: {
    //   titles: allProperties,
    //   fields: dataObjects.map((_, i) => i),
    //   data: chartData, // Use the same data as the "All Data Line Chart"
    // },
  
  xlsxChart.generate(ouropts, function (err, data) {
  const loadingOverlay = document.getElementById("loadingOverlay");
    console.log('here');
    if (err) {
      console.error(err);
    } else {
      loadingOverlay.style.display = "flex";
      fs.writeFileSync(filePath, data);
         loadingOverlay.style.display = "none";
      showAlert("ファイルダウンロードを保存しました");
      console.log('Excel file with line chart created successfully at:', filePath);
    }
  });
  

  // xlsxChart.generate(ouropts, function (err, data) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     fs.writeFileSync(filePath, data);
  //     console.log('Excel file with line chart created successfully at:', filePath);
  //   }
  // });
}