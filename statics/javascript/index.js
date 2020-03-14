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

    listenerHandler(foregroundCanvas, foregroundMap, foregroundMap.getHexagons());
    listenerHandler(undergroundCanvas, undergroundMap, undergroundMap.getHexagons());

});

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
    reachableSort(visited);
    return visited;
}

/**
 * Show all available movements on the map
 * @param {Object} canvas
 * @param {Object} map
 * @param {Object} elements
 * @param {Object} hexagon
 * @param movementPoints
 */
function showAvailableMovements(canvas, map, elements, hexagon, movementPoints) {
    let hexagons = getReachableHexagons(map, hexagon, movementPoints);
    map.setHexagonsAs(hexagons, "available");
}

/**
 * Manage onclick event on an hexagon
 * @param canvas
 * @param map
 * @param hexagons
 */
function listenerHandler(canvas, map, hexagons, movementPoints=2) {

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
                showAvailableMovements(canvas, map, hexagons, clickedHexagon, movementPoints);
                CLICK = 1;
            }

            //SECOND TIME OR MORE CLICK
            else {

                //CLICK ON SAME HEXAGON TWICE
                if (PREVIOUS_CLICK_HEXAGON === clickedHexagon) {
                    console.log("clicked on same hex");
                    map.restoreHexagonsType();
                    CLICK = 0;
                }

                //PATHFINDER
                else if (CLICK === 1) {
                    try {
                        let path = pathfinder(map, PREVIOUS_CLICK_HEXAGON, clickedHexagon, movementPoints);
                        map.restoreHexagonsType();
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
 * Create a path
 * @param {Object} map
 * @param {Object} hexagonA
 * @param {Object} hexagonB
 */
function pathfinder(map, hexagonA, hexagonB, movementPoints){

    let hexagons = map.getHexagonsAvailable();
    let path = [];
    //
    // path.push({x: data.x, y: data.y, z: data.z });

    // let index = -1;
    // for (let test of hexagons) {
    //     if (test[0].isEqualNode(hexagonB)) {
    //         index = hexagons.indexOf(test);
    //     }
    // }

    // if(index != -1){
    //     let lastDist = hexagons[index][1];
    //     let lastNode = hexagons[index][0];
    //
    //     while(lastDist>0){
    //         let neighList = neighbors(lastNode);
    //         let i = 0;
    //
    //         while(i<hexagons.length){
    //             for(let neigh of neighList){
    //                 if(neigh!=null){
    //                     if(i<hexagons.length && hexagons[i][0].isEqualNode(neigh)){
    //
    //                         lastDist = hexagons[i][1];
    //                         lastNode = hexagons[i][0];
    //                         i = hexagons.length;
    //                         data = getHexagonDataset(lastNode);
    //                         path.unshift({
    //                             "x": data.x,
    //                             "y": data.y,
    //                             "z": data.z
    //                         });
    //                         d3.select(`.${data.scale}-hexagon[data-x="${data.x}"][data-y="${data.y}"][data-z="${data.z}"]`).classed("pathfinder", true);
    //                     }
    //                 }
    //             }
    //             i++;
    //         }
    //     }
    // }
    // else
    //     d3.select(`.${data.scale}-hexagon[data-x="${data.x}"][data-y="${data.y}"][data-z="${data.z}"]`).classed("pathfinder-unavailable", true);
    //
    // return path;

    if (path){
        return path;
    } else {
        throw "Can't find a path !";
    }
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