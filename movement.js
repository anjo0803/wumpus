/*
Functions for moving things around the map.
*/

function action(direction) {
    if(running) {

        // If a movement key was pressed:
        if(['W', 'A', 'S', 'D'].includes(direction)) {

            // Either move or shoot
            if(!shooting) movePlayer(direction);
            else shoot(direction);
        }

        // If shooting mode switch key was pressed:
        else if(direction == 'Q') {
            if(!['L', 'R'].includes(MAP[PLAYER.x][PLAYER.y])) switchShooting();
            // TODO else play sound
        }
    } 
}

function movePlayer(direction) {
    toNextRoom(PLAYER, direction);
    document.documentElement.style.setProperty('--player-x', PLAYER.x);
    document.documentElement.style.setProperty('--player-y', PLAYER.y);
    document.getElementById('character').setAttribute('class', 'scalable ' 
        + (MAP[PLAYER.x][PLAYER.y] == 'R' ? PLAYER.tunnel == -1 ? 'cell-bottom cell-right' : 'cell-top cell-left'
            : MAP[PLAYER.x][PLAYER.y] == 'L' ? PLAYER.tunnel == -1 ? 'cell-bottom cell-left' : 'cell-top cell-right'
            : 'cell-center'));
    printCell(PLAYER.x, PLAYER.y);
    if(WUMPUS.x == PLAYER.x && WUMPUS.y == PLAYER.y) gameEnd('wumpus');
    else if(['P', 'PD'].includes(MAP[PLAYER.x][PLAYER.y])) gameEnd('pit');
}

function shoot(direction) {
    let target = toNextCrossing(PLAYER, direction);
    if(target.x == WUMPUS.x && target.y == WUMPUS.y) gameEnd('victory');
    else gameEnd('wumpus');
}

function toNextRoom(position, direction) {
    if(MAP[position.x][position.y] == 'L') {
        if(position.tunnel == -1 && (['W', 'D'].includes(direction))) return position;
        else if(position.tunnel == 1 && (['S', 'A'].includes(direction))) return position;
    } else if(MAP[position.x][position.y] == 'R') {
        if(position.tunnel == -1 && (['W', 'A'].includes(direction))) return position;
        else if(position.tunnel == 1 && (['S', 'D'].includes(direction))) return position;
    }
    
    // Calculate the new position
    if(direction == 'W') position.y--;
    else if(direction =='S') position.y++;
    else if(direction == 'A') position.x--;
    else if(direction == 'D') position.x++;

    // Wrap movement around on the map edges
    if(position.x < 0) position.x = MAP.length - 1;
    else if(position.x >= MAP.length) position.x = 0;
    else if(position.y < 0) position.y = MAP[0].length - 1;
    else if(position.y >= MAP[0].length) position.y = 0;

    //Adjust tunnel value if position is now in tunnel
    if(MAP[position.x][position.y] == 'L') {
        if(['W', 'D'].includes(direction)) position.tunnel = -1;
        else position.tunnel = 1;
    } else if(MAP[position.x][position.y] == 'R') {
        if(['W', 'A'].includes(direction)) position.tunnel = -1;
        else position.tunnel = 1;
    } else position.tunnel = 0;

    return position;
}

function toNextCrossing(position, direction) {
    let ret = toNextRoom({
        x: position.x,
        y: position.y,
        tunnel: position.tunnel
    }, direction);

    while(['L', 'R'].includes(MAP[ret.x][ret.y])) {
        if(direction == 'W') toNextRoom(ret, direction = MAP[ret.x][ret.y] == 'L' ? 'A' : 'D');
        else if(direction == 'A') toNextRoom(ret, direction = MAP[ret.x][ret.y] == 'L' ? 'W' : 'S');
        else if(direction == 'S') toNextRoom(ret, direction = MAP[ret.x][ret.y] == 'L' ? 'D' : 'A');
        else if(direction == 'D') toNextRoom(ret, direction = MAP[ret.x][ret.y] == 'L' ? 'S' : 'W');
        else {
            console.error('Illegal Movement!');
            break;
        }
    } 
    return ret;
}
