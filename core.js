/*
Core functions of the game.
*/

const VERSION = '0.1 α';
console.log('Wumpus v' + VERSION + ' by anjo');

// Canvas to draw the discovered pathway on.
const CV = document.getElementById('bgpath').getContext('2d');

// Two-dimensional array representing the game map. The outer array represents the x axis, the inner one the y axis.
const MAP = []; 

// The dimensions object saves data about the current map and cell sizes.
const DIM = {
    w: 10,
    h: 10,
    size: 50
}

// The wumpus object saves the location of the wumpus on the map.
const WUMPUS = {
    x: -1,
    y: -1,
    tunnel: 0
}

// The player object saves the location of the player's character on the map.
const PLAYER = {
    x: 4,
    y: 4,
    tunnel: 0
}

var running = false;

var shooting = false;

// The difficulty multiplier (either 0 = Easy, 1 = Hard, or 2 = Pro)
var difficulty = 1;

// Calculates the sizes of the canvas, and subsequently the game map,
// depending on the screen size.
function adjustSizes() {

    // The map will measure 10 cells in the direction in which the screen is largest
    let width = document.getElementById('game').clientWidth,
        height = document.getElementById('game-display').clientHeight;
    DIM.size = Math.floor(Math.min(width, height) / 6);

    // Update the CSS variables to adapt to the calculated dimensions
    document.documentElement.style.setProperty('--cell-size', DIM.size + 'px');
    document.documentElement.style.setProperty('--cells-x', DIM.w = Math.floor(width / DIM.size));
    document.documentElement.style.setProperty('--cells-y', DIM.h = Math.floor(height / DIM.size));

    // Update the canvas to reflect those changes
    document.getElementById('bgpath').setAttribute('width', DIM.w * DIM.size);
    document.getElementById('bgpath').setAttribute('height', DIM.h * DIM.size);
}

// Sets everything up for a new game session.
function newGame() {
    document.getElementById('wumpus').hidden = true;
    CV.clearRect(0, 0, document.getElementById('bgpath').width, document.getElementById('bgpath').height);
    if(shooting) switchShooting();
    
    genMap();

    document.documentElement.style.setProperty('--wumpus-x', WUMPUS.x);
    document.documentElement.style.setProperty('--wumpus-y', WUMPUS.y);
    document.documentElement.style.setProperty('--player-x', PLAYER.x);
    document.documentElement.style.setProperty('--player-y', PLAYER.y);

    running = true;
}

// Ends the game due to the provided cause.
function gameEnd(cause) {
    running = false;
    window.alert(cause == 'wumpus' ? 'The Wumpus got you D:'
        : cause == 'pit' ? 'You fell into a pit D:'
        : cause == 'victory' ? 'You got the Wumpus :D'
        : 'You broke the game .-.')
    printMap();
    document.getElementById('wumpus').hidden = false;
}

function switchShooting() {
    shooting = !shooting;
    document.getElementById('character').setAttribute('class', 
        document.getElementById('character').getAttribute('class').replace(' shooting', '') + (shooting ? ' shooting' : ''));
}

document.addEventListener('keydown', e => action(e.key.toUpperCase()));

document.getElementById('character').addEventListener('click', e => {
    if(running) switchShooting();
});

adjustSizes();
newGame();
