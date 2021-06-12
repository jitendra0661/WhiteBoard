const activeToolEl = document.querySelector('#active-tool');
const brushColorBtn = document.querySelector('#brush-color');
const brushIcon = document.querySelector('#brush');
const brushSize = document.querySelector('#brush-size');
const brushSlider = document.querySelector('#brush-slider');
const bucketColorBtn = document.querySelector('#bucket-color');
const eraser = document.querySelector('#eraser');
const clearCanvasBtn = document.querySelector('#clear-canvas');
const saveStorageBtn = document.querySelector('#save-storage');
const loadStorageBtn = document.querySelector('#load-storage');
const clearStorageBtn = document.querySelector('#clear-storage');
const downloadBtn = document.querySelector('#download');
const { body } = document;


const canvas = document.createElement('canvas');
canvas.id = 'canvas';
const tool = canvas.getContext('2d');
let currentSize = 10;
let bucketColor = '#FFFFFF';
let currentColor;
let isEraser = false;
let isMouseDown = false;
let drawnArray = [];

//formatting brush size 
function displayBrushSize() {
  if (brushSlider.value < 10) {
    console.log(brushSlider.value);
    brushSize.textContent = `0${brushSlider.value}`;
  } else {
    console.log(brushSlider.value);
    brushSize.textContent = brushSlider.value;
  }
}

// setting brush size
brushSlider.addEventListener('change', () => {
  // console.log(brushSlider.value);
  currentSize = brushSlider.value;
  displayBrushSize();
});


// brush color setting 
brushColorBtn.addEventListener('change', (e) => {
  isEraser = false;
  brushColorBtn.value = e.target.value;
  currentColor = e.target.value;
});

// setting background color
bucketColorBtn.addEventListener('change', (e) => {
  bucketColor = e.target.value;
  createCanvas();
  restoreCanvas();
});

// eraser
eraser.addEventListener('click', () => {
  isEraser = true;
  brushIcon.style.color = 'white';
  eraser.style.color = 'black';
  activeToolEl.textContent = 'Eraser';
  currentColor = bucketColor;
  currentSize = 35;
});

//switching back to brush
function switchToBrush() {
  // console.log(brushColorBtn.Color);
  console.log(brushColorBtn.value);
  isEraser = false;
  activeToolEl.textContent = 'Brush';
  brushIcon.style.color = 'black';
  eraser.style.color = 'white';
  currentColor = brushColorBtn.value;
  currentSize = 10;
  brushSlider.value = 10;
  displayBrushSize();
}

//create canvas
function createCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
  tool.fillStyle = bucketColor;
  tool.fillRect(0, 0, canvas.width, canvas.height);
  body.appendChild(canvas);
  switchToBrush();
}

//clear canvas
clearCanvasBtn.addEventListener('click', () => {
  createCanvas();
  drawnArray = [];
  // Active Tool
  activeToolEl.textContent = 'Canvas Cleared';
  setTimeout(switchToBrush, 1500);
});

// draw what is store in array on canvas
function restoreCanvas() {
  for (let i = 1; i < drawnArray.length; i++) {
    tool.beginPath();
    tool.moveTo(drawnArray[i - 1].x, drawnArray[i - 1].y);
    tool.lineWidth = drawnArray[i].size;
    tool.lineCap = 'round';
    if (drawnArray[i].eraser) {
      tool.strokeStyle = bucketColor;
    } else {
      tool.strokeStyle = drawnArray[i].color;
    }
    tool.lineTo(drawnArray[i].x, drawnArray[i].y);
    tool.stroke();
  }
}

// store what is drawn on board in array
function storeDrawn(x, y, size, color, erase) {
  const line = {
    x,
    y,
    size,
    color,
    erase,
  };
  drawnArray.push(line);
}

// get mouse position
function getMousePosition(event) {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: event.clientX - boundaries.left,
    y: event.clientY - boundaries.top,
  };
}


canvas.addEventListener('mousedown', (event) => {
  isMouseDown = true;
  const currentPosition = getMousePosition(event);
  tool.moveTo(currentPosition.x, currentPosition.y);
  tool.beginPath();
  tool.lineWidth = currentSize;
  tool.lineCap = 'round';
  tool.strokeStyle = currentColor;
});


canvas.addEventListener('mousemove', (event) => {
  if (isMouseDown) {
    const currentPosition = getMousePosition(event);
    tool.lineTo(currentPosition.x, currentPosition.y);
    tool.stroke();
    storeDrawn(
      currentPosition.x,
      currentPosition.y,
      currentSize,
      currentColor,
      isEraser,
    );
  } else {
    storeDrawn(undefined);
  }
});

canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

// local storage
saveStorageBtn.addEventListener('click', () => {
  localStorage.setItem('savedCanvas', JSON.stringify(drawnArray));
  // Active Tool
  activeToolEl.textContent = 'Canvas Saved';
  setTimeout(switchToBrush, 1500);
});

// load from local storage
loadStorageBtn.addEventListener('click', () => {
  if (localStorage.getItem('savedCanvas')) {
    drawnArray = JSON.parse(localStorage.savedCanvas);
    restoreCanvas();
    // Active Tool
    activeToolEl.textContent = 'Canvas Loaded';
    setTimeout(switchToBrush, 1500);
  } else {
    activeToolEl.textContent = 'No Canvas Found';
    setTimeout(switchToBrush, 1500);
  }
});

//clear local storage
clearStorageBtn.addEventListener('click', () => {
  localStorage.removeItem('savedCanvas');
  
  activeToolEl.textContent = 'Local Storage Cleared';
  setTimeout(switchToBrush, 1500);
});

//download image
downloadBtn.addEventListener('click', () => {
  downloadBtn.href = canvas.toDataURL('image/jpeg', 1);
  downloadBtn.download = 'paint-example.jpeg';
  
  activeToolEl.textContent = 'Image File Saved';
  setTimeout(switchToBrush, 1500);
});


brushIcon.addEventListener('click', switchToBrush);

//on page load
createCanvas();
