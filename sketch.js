let img;
let cellSize = 8.5;
let gridWidth;
let gridHeight;
let grid;
let backgroundColor;
let foregroundColor;
let tracks = [
  'Song1.mp3', 'Song3.mp3',
  'Song4.mp3', 'Song5.mp3','Song8.mp3','Song9.mp3',
  'Song10.mp3','Song11.mp3',
  'Song12.mp3','Song13.mp3',
  'Song14.mp3','Song15.mp3',
  'Song16.mp3','Song17.mp3',
  'Song20.mp3','Song21.mp3',
  'Song22.mp3',
  
  // Add more tracks if you want
];
let loadedTracks = [];
let isPlaying = false;
let updateCount = 0;
let currentTrack;
function preload() {
  img = loadImage("ConwaysGOL2.png");
  loadedTracks = tracks.map((track) => loadSound(track));
}

function setup() {
  createCanvas(img.width, img.height);
  gridWidth = floor(width / cellSize);
  gridHeight = floor(height / cellSize);
  backgroundColor = color(random(255), random(255), random(255));
  foregroundColor = getComplementaryColor(backgroundColor);
  grid = createRandomGrid();
}
function playRandomTrack() {
  if (!isPlaying) {
    isPlaying = true;
    let tracksToPlay = loadedTracks.filter(track => !track.isPlaying());
    if (tracksToPlay.length > 0) {
      let randomTrack = random(tracksToPlay);

      // Stop the previous track immediately before playing a new one
      loadedTracks.forEach(track => {
        if (track.isPlaying()) {
          track.stop();
        }
      });

      // Use a callback to play the new track after the previous track has stopped
      randomTrack.play(0, 1, 1, 0, undefined, () => {
        isPlaying = false;
        playRandomTrack();
      });
    } else {
      isPlaying = false;
    }
  }
}

function getComplementaryColor(inputColor) {
  let r = 255 - inputColor.levels[0];
  let g = 255 - inputColor.levels[1];
  let b = 255 - inputColor.levels[2];
  return color(r, g, b);
}

function draw() {
  displayGrid();
  image(img, 0, 0, width, height); // display the loaded image on top of the grid
  updateGrid();
  if (!isPlaying) {
    playRandomTrack();
  }
}

function mousePressed() {
  let clickedColor = get(mouseX, mouseY);
  if (isNeonGreenOrSalmonPink(clickedColor)) {
    backgroundColor = color(random(255), random(255), random(255));
    foregroundColor = getComplementaryColor(backgroundColor);
    grid = createRandomGrid(); // Restart the Game of Life animation
    isPlaying = false; // Stop the current track
    playRandomTrack(); // Play a new track
  }
}

function isNeonGreenOrSalmonPink(color) {
  return isNeonGreen(color) || isSalmonPink(color);
}

function isNeonGreen(color) {
  let r = color[0];
  let g = color[1];
  let b = color[2];

  let rMin = 0;
  let rMax = 100;
  let gMin = 200;
  let gMax = 255;
  let bMin = 0;
  let bMax = 100;

  return (
    r >= rMin && r <= rMax && g >= gMin && g <= gMax && b >= bMin && b <= bMax
  );
}

function isSalmonPink(color) {
  let r = color[0];
  let g = color[1];
  let b = color[2];

  let rMin = 190;
  let rMax = 255;
  let gMin = 83;
  let gMax = 150;
  let bMin = 103;
  let bMax = 170;

  return (
    r >= rMin && r <= rMax && g >= gMin && g <= gMax && b >= bMin && b <= bMax
  );
}

function createRandomGrid() {
  let grid = new Array(gridWidth);
  for (let i = 0; i < gridWidth; i++) {
    grid[i] = new Array(gridHeight);
    for (let j = 0; j < gridHeight; j++) {
      grid[i][j] = random() > random(0.3, 0.7) ? 1 : 0;
    }
  }
  return grid;
}

function displayGrid() {
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      if (grid[i][j] === 1) {
        fill(foregroundColor);
      } else {
        fill(backgroundColor);
      }
      rect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
}

function updateGrid() {
  let newGrid = new Array(gridWidth);
  let activeCells = 0;
  let oldGrid = grid;

  for (let i = 0; i < gridWidth; i++) {
    newGrid[i] = new Array(gridHeight);
    for (let j = 0; j < gridHeight; j++) {
      let neighbors = countNeighbors(i, j);
      let oldState = oldGrid[i][j];
      let newState;
      if (oldState === 1) {
        if (neighbors < 2 || neighbors > 3) {
          newState = 0;
        } else {
          newState = 1;
        }
      } else {
        if (neighbors === 3) {
          newState = 1;
        } else {
          newState = 0;
        }
      }

      newGrid[i][j] = newState;
      if (newState === 1) {
        activeCells++;
      }
    }
  }

  grid = newGrid;

  // Check if the grid has changed from the previous state
  let hasChanged = false;
  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      if (oldGrid[i][j] !== grid[i][j]) {
        hasChanged = true;
        break;
      }
    }
  }

  // If the grid has changed, play a new track
  if (hasChanged) {
    playRandomTrack();
  }

  // Increment updateCount
  updateCount++;
}
function countNeighbors(x, y) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      let col = (x + i + gridWidth) % gridWidth;
      let row = (y + j + gridHeight) % gridHeight;
      count += grid[col][row];
    }
  }
  return count;
}