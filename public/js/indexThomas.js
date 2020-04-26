/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

const GAME_LEVEL = 0;
const MAP = { width : 0, height : 0};
const UNIT = { width : 0, height : 0 };
const HEXAGON = { size : 0 };
const MOVEMENT_POINT = 3; // watch listenerHandler

let CLICK = 0;
let PREVIOUS_HEXAGON_CLICKED;
let PREVIOUS_UNIT_CLICKED;
let REACHABLEHEXAGONS = [];

//CANVAS
let foregroundCanvas = document.getElementById("foreground-map");
let undergroundCanvas = document.getElementById("underground-map");

//CTX
let foregroundCtx = foregroundCanvas.getContext("2d");
let undergroundCtx = undergroundCanvas.getContext("2d");

//GAME
let game, foregroundMap, undergroundMap;

/**
 * Manage onclick event on an hexagon
 * @param canvas
 * @param map
 */
function listenerHandler(canvas, map, movementPoints) {

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
                PREVIOUS_HEXAGON_CLICKED = clickedHexagon;
                try{
                    let unit = map.getUnitsOnHexagon(clickedHexagon);
                    if (unit){
                        PREVIOUS_UNIT_CLICKED = unit;
                        REACHABLEHEXAGONS = getReachableHexagons(map, clickedHexagon, movementPoints);
                        showAvailableMovements(canvas, map);
                        CLICK = 1;
                    }
                } catch (e) {
                    alert(e);
                }

            }

            //SECOND TIME OR MORE CLICK
            else {
            
                if (PREVIOUS_HEXAGON_CLICKED === clickedHexagon) {
                    map.restoreHexagonsType();
                    CLICK = 0;
                }

                //PATHFINDER
                else if (CLICK === 1) {
                    if ( PREVIOUS_HEXAGON_CLICKED.map === clickedHexagon.map ){ 
                        try {
                            let path = pathfinder(map, PREVIOUS_HEXAGON_CLICKED, clickedHexagon, movementPoints);
                            map.addMovement(PREVIOUS_UNIT_CLICKED, path);
                            map.restoreHexagonsType();
                            CLICK = 0;
                        } catch (e) {
                            console.error(e);
                        }
                    } else{
                        // go under the map;
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

    let q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / (HEXAGON.size / 2);
    let r = (2 / 3 * y) / (HEXAGON.size / 2);

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
 * Get axial coordinates representing the center of an hexagon
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
function getCenterCoordinate(map, x, y, z) {

    let x_spacing = (Math.sqrt(3) / 2) * HEXAGON.size / 2; // size of the inscribed circle
    let z_spacing = (3 / 4) * HEXAGON.size;

    let x_center = map.getWidth() / 2 + (x * x_spacing) + (-y * x_spacing);
    let y_center = map.getHeight() / 2 + (z * z_spacing);

    return { "x": Math.floor(x_center), "y": Math.floor(y_center) };
}

/**
 * Get random number between 0 (include) and the max (exclude)
 * @param {Number} max
 */
function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Return true if all movements have been done and then the player is ready to 
 */
function isReady(){
    return ( foregroundMap.getMovements().length === 0 && undergroundMap.getMovements().length === 0 )
}

/**
 * MAIN FUNCTION
 */
$().ready(async function () {

    await initialize();

    let lastTime = 0,
        deltaTime = 0,
        second = 0;

    function update(timestamp) {
        deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        second += deltaTime;

        //UPDATE MAPS
        foregroundMap.update(second);
        undergroundMap.update(second);

        if ( second >= 1000 ) { second = 0; }
        
        //DRAW MAP
        foregroundMap.draw(foregroundCtx);
        undergroundMap.draw(undergroundCtx);

        requestAnimationFrame(update)
    }

    requestAnimationFrame(update);

    listenerHandler(foregroundCanvas, foregroundMap, MOVEMENT_POINT);
    listenerHandler(undergroundCanvas, undergroundMap, MOVEMENT_POINT);

});

/**
 * Game initializer
 * @returns {Promise<number>}
 */
async function initialize(){

    // INITIALIZE JSON DATA
    const data = await d3.json(`/statics/data/level${GAME_LEVEL}.json`);

    MAP.width = data.map.width;
    MAP.height = data.map.height;

    HEXAGON.size = data.hexagon.size;

    UNIT.width = data.unit.width;
    UNIT.height = data.unit.height;

    //GAME
    game = new Game(MAP.width, MAP.height, GAME_LEVEL);

    //ADD & BUILD MAPS
    foregroundMap = game.addMap("foreground");
    undergroundMap = game.addMap("underground");

    await foregroundMap.buildMap();
    await undergroundMap.buildMap();

    return 1;
}