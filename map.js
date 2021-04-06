/*
Map drawing & manipulation functions.
*/

function genMap() {
    MAP.length = 0;     // Reset the map, and fill it with empty cells
    for(let i = 0; i < DIM.w; i++) {
        MAP[i] = [];
    }

    // First of all, place the crossings on the map -
    // The exact amount depends on the size of the map and the difficulty chosen
    for(let cAmount = Math.max(15, Math.round(DIM.w * DIM.h * (0.7 - difficulty / 10))); cAmount > 0; cAmount--) {
        let x = 0, y = 0;
        while(MAP[x = Math.floor(Math.random() * DIM.w)][y = Math.floor(Math.random() * DIM.h)] != null) continue;
        MAP[x][y] = 'C';
    }

    // Now, generate randomly rotated tunnels across the empty (non-crossing) fields.
    for(let x = 0; x < DIM.w; x++) for(let y = 0; y < DIM.h; y++) 
        if(MAP[x][y] == null) MAP[x][y] = Math.floor(Math.random() * 100) >= 50 ? 'R' : 'L';

    // Then place the pits
    for(let pAmount = Math.max(2, Math.round(DIM.w * DIM.h * (0.02 + difficulty * 0.01))); pAmount > 0; pAmount--) {
        let x, y;
        while(['L', 'R'].includes(MAP[x = Math.floor(Math.random() * DIM.w)][y = Math.floor(Math.random() * DIM.h)])) continue;
        MAP[x][y] = 'P';
        placePitWarnings({
            x: x,
            y: y,
            tunnel: 0
        });
    }

    // The center-piece: Place the Wumpus at either a crossing or a pit
    while(['L', 'R'].includes(MAP[WUMPUS.x = Math.floor(Math.random() * DIM.w)][WUMPUS.y = Math.floor(Math.random() * DIM.h)])) continue;

    // Place the red dots as wumpus hints
    placeDots(WUMPUS, 3, null);

    // And finally, position the player at a random, non-dotted crossing.
    while(MAP[PLAYER.x = Math.floor(Math.random() * DIM.w)][PLAYER.y = Math.floor(Math.random() * DIM.h)] != 'C') continue;
    printCell(PLAYER.x, PLAYER.y);

}

// Two crossings in each direction from the Wumpus carry a red dot as visual warning
function placeDots(position, radius, lastDirection) {
    if(radius == 0) return;
    else {
        radius--;
        if(!MAP[position.x][position.y].includes('D') && !['R', 'L'].includes(MAP[position.x][position.y])) MAP[position.x][position.y] += 'D';
        let directions = ['W', 'A', 'S', 'D'];
        if(lastDirection != null) directions.splice(directions.indexOf(lastDirection));
        for(let direction of directions) placeDots(toNextCrossing(position, direction), radius);
    }
}

// One crossing in each direction from a pit is green as visual warning
function placePitWarnings(position) {
    for(let direction of ['W', 'A', 'S', 'D']) {
        let warnPos = toNextCrossing(position, direction);
        if(!MAP[warnPos.x][warnPos.y].includes('P')) MAP[warnPos.x][warnPos.y] += 'P';
    }
}

// Draws the cell at the specified position onto the canvas
function printCell(x, y) {
    CV.drawImage(document.getElementById(MAP[x][y]), x * DIM.size, y * DIM.size, DIM.size, DIM.size);
}

// Draws the entire map onto the canvas.
function printMap() {
    for(let x = 0; x < MAP.length; x++) for(let y = 0; y < MAP[x].length; y++) printCell(x, y);
}