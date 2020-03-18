/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 * https://codesandbox.io/s/z2pqr9620m
 */

const MAP_WIDTH = 1440;
const MAP_HEIGHT = 1000;
const HEXAGON_SIZE = 80;

let CLICK = 0;
let PREVIOUS_CLICK_HEXAGON;
let REACHABLEHEXAGONS = [];

//CANVAS
let foregroundCanvas = document.getElementById("foreground-map");
let undergroundCanvas = document.getElementById("underground-map");

//CTX
let foregroundCtx = foregroundCanvas.getContext("2d");
let undergroundCtx = undergroundCanvas.getContext("2d");

//GAME
let game = new Game(MAP_WIDTH, MAP_HEIGHT, 0);

//ADD MAPS
let foregroundMap = game.addMap("foreground");
let undergroundMap = game.addMap("underground");

/**
 * MAIN FUNCTION
 */
$().ready(function () {

    undergroundMap.buildMap();
    foregroundMap.buildMap();

    let unitTest = new Unit("soldier", 730, 510);
    foregroundMap.addGameObject(unitTest);

    let unitTest2 = new Unit("soldier", 730, 510);
    undergroundMap.addGameObject(unitTest2);

    let lastTime = 0;

    function gameLoop(timestamp) {
        // let deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        //DRAW MAP
        foregroundMap.draw(foregroundCtx);
        undergroundMap.draw(undergroundCtx);

        requestAnimationFrame(gameLoop)
    }

    requestAnimationFrame(gameLoop);

    listenerHandler(foregroundCanvas, foregroundMap);
    listenerHandler(undergroundCanvas, undergroundMap);

});

/**
 * Manage onclick event on an hexagon
 * @param canvas
 * @param map
 */
function listenerHandler(canvas, map, movementPoints=2) {

    let hexagons = map.getHexagons();

    // Add onclick event
    canvas.addEventListener('click', function (event) {

        // Get hexagon where we clicked
        let cursor = getCursorCoordinateOnCanvas(event, canvas);
        let hexagonCoordinate = pixelToHexagonCoordinate(cursor.x, cursor.y); //get cube coordinate of the hexagon clicked
        let getClickedHexagon = function () {
            let hexagon;
            hexagons.forEach(function (element) {
                if (hexagonCoordinate.x === element.x && hexagonCoordinate.y === element.y && hexagonCoordinate.z === element.z) {
                    hexagon = element;
                }
            });
            if (!hexagon){
                throw "Can't find hexagon !";
            } else {
                return hexagon;
            }
        };

        try{
            let clickedHexagon = getClickedHexagon();

            //FIRST TIME CLICK
            if (CLICK === 0) {
                PREVIOUS_CLICK_HEXAGON = clickedHexagon;
                try{
                    REACHABLEHEXAGONS = getReachableHexagons(map, clickedHexagon, movementPoints);
                    showAvailableMovements(canvas, map);
                    CLICK = 1;
                } catch (e) {
                    alert(e);
                }

            }

            //SECOND TIME OR MORE CLICK
            else {
                //CLICK ON SAME HEXAGON TWICE
                if (PREVIOUS_CLICK_HEXAGON === clickedHexagon) {
                    map.restoreHexagonsType();
                    CLICK = 0;
                }

                //PATHFINDER
                else if (CLICK === 1) {
                    try {
                        map.restoreHexagonsType();
                        let path = pathfinder(map, PREVIOUS_CLICK_HEXAGON, clickedHexagon, movementPoints);
                        map.setHexagonsAs(path, "unavailable", 1500);
                        CLICK = 0;
                    } catch (e) {
                        console.error(e);
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
    });
}

/**
 * Return all reachable hexagon
 * @param {Class} map
 * @param {Object} hexagon
 * @param {Number} movementPoints
 */
function getReachableHexagons(map, hexagon, movementPoints) {

    let visited = [];
    let change = true;

    visited.push([map.getIndex(hexagon), 0]);

    while (change) {
        change = false;

        // for each hexagon of visited
        for (let hexagonVisited of visited) {

            let neighbors = map.getNeighbors(map.getHexagon(hexagonVisited[0]));

            // for each neighbors
            for (let neighbor of neighbors) {

                let distance = hexagonVisited[1] + map.getMovementPointRequire(map.getHexagon(neighbor));
                let index = -1;

                // For each element of visited
                for (let element of visited){

                    // If we already visited this element
                    if ( element[0] === neighbor ){
                        index = visited.indexOf(element);
                    }
                }

                // if we don't found this neighbors in visited and he is accessible then we add it to visited
                if (index === -1 && distance <= movementPoints) {
                    visited.push([neighbor, distance]);
                    change = true;
                } else if (index !== -1 && distance < visited[index][1]) {
                    visited[index] = [neighbor, distance];
                    change = true;
                }
            }
        }
    }

    if (visited.length > 1){
        reachableSort(visited);
        return visited;
    } else {
        throw "You don't have enough movement points to move here !";
    }

}

/**
 * Show all available movements on the map
 * @param {Object} canvas
 * @param {Object} map
 * @param {Object} elements
 * @param {Object} hexagon
 * @param movementPoints
 */
function showAvailableMovements(canvas, map) {
    let indexes = getIndexesOfReachableHexagons();
    map.setHexagonsAs(indexes, "available");
}

/**
 * Create a path
 * @param {Object} map
 * @param {Object} hexagonA
 * @param {Object} hexagonB
 */
function pathfinder(map, hexagonA, hexagonB, movementPoints){

    let path = [];
    path.push(map.getIndex(hexagonB));

    let index = -1;

    // Check if hexagonB is reachable
    for (let hexagon of REACHABLEHEXAGONS) {
        if (hexagon[0] == map.getIndex(hexagonB)) {
            index = REACHABLEHEXAGONS.indexOf(hexagon);
        }
    }

    if(index != -1){
        let lastNode = REACHABLEHEXAGONS[index][0];
        let lastDist = REACHABLEHEXAGONS[index][1];

        while(lastDist > 0){

            let neighbors = map.getNeighbors(map.getHexagon(lastNode));
            let i = 0;

            while(i < REACHABLEHEXAGONS.length){
                for(let neighbor of neighbors){
                    if(i < REACHABLEHEXAGONS.length && REACHABLEHEXAGONS[i][0] == neighbor){

                        lastDist = REACHABLEHEXAGONS[i][1];
                        lastNode = REACHABLEHEXAGONS[i][0];
                        i = REACHABLEHEXAGONS.length;
                        path.unshift(lastNode);
                    }
                }
                i++;
            }
        }
    }
    else {
        throw "Can't find a path !";
        path = null;
    }

    console.log(path);
    return path
}

/* #_______ SIMPLE FUNCTION _______# */

/**
 * Switch the maps
 */
function switchMap() {
    game.switch(foregroundMap, undergroundMap);
}

/**
 * round data to get proper coordinate
 * @param {Object} data
 */
function roundHexagonCoordinate(data) {

    let x = Math.round(data.x);
    let y = Math.round(data.y);
    let z = Math.round(data.z);

    let x_diff = Math.abs(x - data.x);
    let y_diff = Math.abs(y - data.y);
    let z_diff = Math.abs(z - data.z);

    if ((x_diff >= y_diff) && (x_diff >= z_diff)) {
        x = -y - z;
    } else if (y_diff >= z_diff) {
        y = -x - z;
    } else {
        z = -x - y;
    }
    return { "x": x,  "y": y,  "z": z };
}

/**
 * Create a simple object of coordinate
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
function createCubeCoordinate(x, y, z) {
    return { "x": x,  "y": y,  "z": z };
}

/**
 * Return correct necessary coordinate on canvas by adding offsets and parameters of the canvas
 * @param canvas
 * @param event
 * @returns {{x: number, y: number}}
 */
function getCursorCoordinateOnCanvas(event, canvas){

    //pointer position onclick
    let cursor_x = event.pageX;
    let cursor_y = event.pageY;

    //offset modifiers
    let x = cursor_x - canvas.offsetLeft;
    let y = cursor_y - canvas.offsetTop;

    return {x: x-(canvas.width/2), y: y-(canvas.height/2)};
}

/**
 * Get the cube hexagon coordinate (x, y, z) where we clicked
 * @param {Number} x
 * @param {Number} y
 */
function pixelToHexagonCoordinate(x, y) {

    let q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / (HEXAGON_SIZE / 2);
    let r = (2 / 3 * y) / (HEXAGON_SIZE / 2);

    return roundHexagonCoordinate(createCubeCoordinate(q, -q - r, r));
}

/**
 * Ascending sort reachable hexagons by the distance
 * @param T
 */
function reachableSort(T) {
    for (let i = T.length - 1; i >= 0; i--) {
        for (let j = 0; j < i; j++) {
            if (T[j + 1][1] < T[j][1]) {
                let ech = T[j];
                T[j] = T[j + 1];
                T[j + 1] = ech;
            }
        }
    }
}

/**
 * Only return the index of the reachable hexagon
 * @returns {[]}
 */
function getIndexesOfReachableHexagons(){
    let indexes = [];
    for(let hexagon of REACHABLEHEXAGONS){
        indexes.push(hexagon[0]);
    }
    return indexes;
}

/**
 * MEMO
 * https://www.youtube.com/watch?v=3EMxBkqC4z0;
 * https://jsfiddle.net/BmeKr/ EVENT LISTENER ON CLICK OF CANVAS
 *
//https://editor.method.ac/
//https://i.pinimg.com/originals/ae/2e/3b/ae2e3be46e63253f38e6e0d21ed574e1.png
//https://img.itch.zone/aW1hZ2UvMTA5MTYwLzEyMDY4MjYucG5n/original/7SEYHd.png
//https://img.itch.zone/aW1hZ2UvMjM3NjUwLzExMzExNDIucG5n/original/693xiv.png
//https://opengameart.org/sites/default/files/Preview_100.png
 */