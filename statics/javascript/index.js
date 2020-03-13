/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 * https://codesandbox.io/s/z2pqr9620m
 */

MAP_WIDTH = 1440;
MAP_HEIGHT = 1000;
HEXAGON_SIZE = 80;
CLICK = 0;

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
        let deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        //DRAW MAP
        foregroundMap.draw(foregroundCtx);
        undergroundMap.draw(undergroundCtx);

        requestAnimationFrame(gameLoop)
    }

    requestAnimationFrame(gameLoop);

    addOnclickEventOnHexagon(foregroundCanvas, foregroundMap, foregroundMap.getHexagons());
    addOnclickEventOnHexagon(undergroundCanvas, undergroundMap, undergroundMap.getHexagons());

});

/**
 * Switch the maps
 */
function switchMap() {
    game.switch(foregroundMap, undergroundMap);
}

/**
 * Manage onclick event on an hexagon
 * @param canvas
 * @param map
 * @param elements
 */
function addOnclickEventOnHexagon(canvas, map, elements) {

    canvas.addEventListener('click', function (event) {
        //pointer position onclick
        let cursor_x = event.pageX;
        let cursor_y = event.pageY;

        //offset modifiers
        let x = cursor_x - canvas.offsetLeft;
        let y = cursor_y - canvas.offsetTop;

        //get cube coordinate of the hexagon clicked
        let hexagonCoordinate = pixelToHexagonCoordinate(x - MAP_WIDTH / 2, y - MAP_HEIGHT / 2);

        //THIS SHOULD BE FOR UNIT
        if ( CLICK === 0 ) {
            elements.forEach(function (element) {
                if (hexagonCoordinate.x == element.x && hexagonCoordinate.y == element.y && hexagonCoordinate.z == element.z) {
                    showAvailableMovements(map, elements, element);
                }
            });
        } else {
            map.restoreHexagonsType();
            CLICK = 0;
        }

    }, false);
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
 * Show all available movements on the map
 * @param {Object} map
 * @param {Object} elements
 * @param {Object} hexagon
 * @param movementPoints
 */
function showAvailableMovements(map, elements, hexagon, movementPoints=2) {
    let hexagons = getReachableHexagons(map, hexagon, movementPoints);
    map.setHexagonsAs(hexagons, "available");
    CLICK = 1;
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
            
            let neighbors = map.getNeighbors(hexagon);

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
 * Create a path from idA to idB
 * @param {Object} hexagonA
 * @param {Object} hexagonB
 */
function pathfinder(hexagonA,hexagonB){

    let visited = getReachableHexagons(hexagonA,MOVEMENT_POINTS);
    let path = [];
    let data = getHexagonDataset(hexagonB);

    path.push({
        "x": data.x,
        "y": data.y,
        "z": data.z
    });
    d3.select(`.${data.scale}-hexagon[data-x="${data.x}"][data-y="${data.y}"][data-z="${data.z}"]`).classed("pathfinder", true);

    let index = -1;
    for(let test of visited)
        if(test[0].isEqualNode(hexagonB))
            index = visited.indexOf(test);

    if(index!=-1){
        let lastDist = visited[index][1];
        let lastNode = visited[index][0];

        while(lastDist>0){
            let neighList = neighbors(lastNode);
            let i = 0;

            while(i<visited.length){
                for(let neigh of neighList){
                    if(neigh!=null){
                        if(i<visited.length && visited[i][0].isEqualNode(neigh)){

                            lastDist = visited[i][1];
                            lastNode = visited[i][0];
                            i = visited.length;
                            data = getHexagonDataset(lastNode);
                            path.unshift({
                                "x": data.x,
                                "y": data.y,
                                "z": data.z
                            });
                            d3.select(`.${data.scale}-hexagon[data-x="${data.x}"][data-y="${data.y}"][data-z="${data.z}"]`).classed("pathfinder", true);
                        }
                    }
                }
                i++;
            }
        }
    }
    else
        d3.select(`.${data.scale}-hexagon[data-x="${data.x}"][data-y="${data.y}"][data-z="${data.z}"]`).classed("pathfinder-unavailable", true);

    return path;
}

// // ________ ONCLICK MANAGER ________

// /**
//  * Manage onclick event on an hexagon
//  * @param {Array} elements 
//  */
// function addOnclickEventOnHexagon(elements) {

//     //get the canvas and is offset(Left/Top)
//     let canvas = document.getElementById('foreground-map');

//     canvas.addEventListener('click', function (event) {

//         //pointer position onclick
//         let cursor_x = event.pageX;
//         let cursor_y = event.pageY;
//         //offset modifiers
//         let x = cursor_x + canvas.offsetLeft;
//         let y = cursor_y - canvas.offsetTop;
//         //get cube coordinate of the hexagon clicked
//         let hexagon_coordinate = pixelToHexagonCoordinate(x - WIDTH / 2, y - HEIGHT / 2);
//         elements.forEach(function (element) {
//             if (hexagon_coordinate.x == element.x && hexagon_coordinate.y == element.y && hexagon_coordinate.z == element.z) {
//                 showAvailableMovement(elements, element);
//             }
//         });
//     }, false);
// }

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