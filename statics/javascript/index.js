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
 * @param {Array} elements 
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

        elements.forEach(function (element) {
            if (hexagonCoordinate.x == element.x && hexagonCoordinate.y == element.y && hexagonCoordinate.z == element.z) {
                showAvailableMovements(map, elements, element);
            }
        });

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

    let x = Math.round(data.x)
    let y = Math.round(data.y)
    let z = Math.round(data.z)

    let x_diff = Math.abs(x - data.x)
    let y_diff = Math.abs(y - data.y)
    let z_diff = Math.abs(z - data.z)

    if ((x_diff >= y_diff) && (x_diff >= z_diff)) {
        x = -y - z;
    } else if (y_diff >= z_diff) {
        y = -x - z;
    } else {
        z = -x - y;
    }

    return {
        "x": x,
        "y": y,
        "z": z
    };
}

/**
 * 
 * @param {Number} x showAvailableMovements(map, elements, element);
 * @param {Number} y 
 * @param {Number} z
 */
function createCubeCoordinate(x, y, z) {
    return {
        "x": x,
        "y": y,
        "z": z
    };
}

/**
 * 
 * @param {*} hexagon 
 * @param {*} movement_points 
 */
function showAvailableMovements(map, elements, hexagon, movementPoints=1) {

    if (CLICK == 0) {
        let hexagons = getReachableHexagons(map, hexagon, movementPoints);
        map.setHexagonsAs(hexagons, "available");
        CLICK = 1;
    } else {
        map.restoreHexagonsType();
        CLICK = 0;
    }
}

/**
 * Return all reachable hexagon
 * @param {Object} map 
 * @param {Object} hexagon 
 * @param {Number} movementPoints 
 */
function getReachableHexagons(map, hexagon, movementPoints) {

    // visited => [ [indexHexagon, dist],  ... ]
    let visited = [];
    let change = true;

    visited.push([map.getIndex(hexagon), 0]);

    while (change) {

        change = false;

        for (let hex of visited) {
            
            let neigh = map.getNeighbors(hexagon);

            for (let neighbor of neigh) {

                console.log("voisin: " + neighbor);

                let dist = hex[1] + distFromName(map.getHexagon(neighbor).getSaveType());
                let ind = -1;

                // Pour chaque élément visité
                for (let element of visited){

                    // si l'indexe de l'élement et le même que celui du voisin actuellement lu
                    if ( element[0] == neighbor ){
                        console.log("je t'ai déjà vu toi");
                        ind = visited.indexOf(element);
                    }
                }

                //si on a pas trouvé le voisin dans visited et access => rajout
                if (ind == -1 && dist <= movementPoints) {
                    visited.push([neighbor, dist]);
                    change = true;
                } else if (ind != -1 && dist < visited[ind][1]) {
                    visited[ind] = [neighbor, dist];
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

function distFromName(name){
    switch(name){
        case "grass":
            return 1;
        case "forest":
            return 600;
        case "sand":
            return 2;
        case "snow":
            return 2;
        case "urban":
            return 1;
        case "volcano":
            return 6;
        case "water":
            return 3;
        case "mountain":
            return 5;
    }
    return 999999999;
}

// // ________ ONLOAD ________
// window.onload = start;

// // ________ CLASSES ________

// class Hexagon {

//   constructor(data, x, y) {

//       this.center_x = x;
//       this.center_y = y;
//       this.x = data.x;
//       this.y = data.y;
//       this.z = data.z;
//       this.type = data.type;

//       if (this.isCorrectCoordinate(this.x, this.y, this.z)) {
//           this.createHexagon();
//       } else {
//           logMessage({
//               "type": "war",
//               "message": " Hexagon::Constructor() : Invalid coordinate (" + this.x + ", " + this.y + ", " + this.z + ")"
//           });
//       }
//   }

//   isCorrectCoordinate(x, y, z) { return ((x + y + z) == 0); }

//   getImage(){ return document.getElementById("asset-" + this.type); }

//   draw(ctx) {

//       let canvas = document.getElementById('foreground-map');
//       let ctx = canvas.getContext("2d");

//       ctx.save();

//       ctx.translate(this.center_x, this.center_y);

//       ctx.rotate(degreeToRadian(-89.27));

//       ctx.drawImage(this.getImage(), -HEX_SIZE / 2, -HEX_SIZE / 2, HEX_SIZE, HEX_SIZE);

//       ctx.restore();
//   }
// }

// // ________ HELPFULL ________
// /**
//  * Transform degrees to radian
//  * @param {Number} deg 
//  */
// function degreeToRadian(deg) {
//     return Math.PI * deg / 180;
// }



// /**
//  * 
//  * @param {Number} x 
//  * @param {Number} y 
//  * @param {Number} z
//  */
// function createCubeCoordinate(x, y, z) {
//     return {
//         "x": x,
//         "y": y,
//         "z": z
//     };
// }

// // ________ HEXAGON COORDINATE ________

// /**
//  * Get the cube hexagon coordinate (x, y, z) where we clicked
//  * @param {Number} x 
//  * @param {Number} y 
//  */
// function pixelToHexagonCoordinate(x, y) {

//     let q = (Math.sqrt(3) / 3 * x - 1 / 3 * y) / (HEX_SIZE / 2);

//     let r = (2 / 3 * y) / (HEX_SIZE / 2);

//     return roundHexagonCoordinate(createCubeCoordinate(q, -q - r, r));
// }

// /**
//  * Linear interpolation
//  * @param {Number} a 
//  * @param {Number} b 
//  * @param {Number} t
//  */
// function linearInterpolation(a, b, t) {
//     return (a + (b - a) * t);
// }

// /**
//  * Get axial coordinates representing the center of an hexagon
//  * @param {Number} x 
//  * @param {Number} y 
//  * @param {Number} z 
//  */
// function getCenterCoordinateOfHexagons(x, y, z) {

//     let x_spacing = (Math.sqrt(3) / 2) * HEX_SIZE / 2; // HEX_SIZE of the inscribed circle

//     let z_spacing = (3 / 4) * HEX_SIZE;

//     let x_center = WIDTH / 2 + (x * x_spacing) + (-y * x_spacing);

//     let y_center = HEIGHT / 2 + (z * z_spacing);

//     return {
//         "x": x_center,
//         "y": y_center
//     };
// }

// /**
//  * round data to get proper coordinate
//  * @param {Object} data
//  */
// function roundHexagonCoordinate(data) {

//     let x = Math.round(data.x)
//     let y = Math.round(data.y)
//     let z = Math.round(data.z)

//     let x_diff = Math.abs(x - data.x)
//     let y_diff = Math.abs(y - data.y)
//     let z_diff = Math.abs(z - data.z)

//     if ((x_diff >= y_diff) && (x_diff >= z_diff)) {
//         x = -y - z;
//     } else if (y_diff >= z_diff) {
//         y = -x - z;
//     } else {
//         z = -x - y;
//     }

//     return {
//         "x": x,
//         "y": y,
//         "z": z
//     };
// }

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

// // ________ MAIN ________

// /**
//  * Start function when document start
//  */
// function start() {

//     /**
//      * Read map JSON data when the page is ready
//      */
//     $().ready(function () {

//         d3.json("statics/data/settings.json").then(function (data) {

//             HEX_SIZE = data["radius"];

//         });

//         d3.json("statics/data/map_save.json").then(function (data) {

//             WIDTH = data["width"];

//             HEIGHT = data["height"];

//             loadMap(data);

//             myGameArea.start();
//         });
//     });
// }

// /**
//  * Load the map
//  * @param {Object} data 
//  */
// function loadMap(data) {

//     let map = d3.select("#map");

//     map.append("canvas")
//         .attrs({
//             id: "underground-map",
//             width: data["width"],
//             height: data["height"],
//         })

//         .styles({
//             opacity: 0.2,
//             "background-color": "gray",
//             top: "200px",
//             left: "-250px",
//             transform: "scale(0.7, 0.7)"
//         });

//     map.append("canvas")
//         .attrs({
//             id: "foreground-map",
//             width: data["width"],
//             height: data["height"]
//         })

//         .styles({
//             opacity: 1,
//             top: "200px",
//             left: "0px"
//         });

//     var elements = [];

//     for (coordinate of data["hexagons"]) {

//         let center = getCenterCoordinateOfHexagons(coordinate.x, coordinate.y, coordinate.z);

//         let hexagon = new Hexagon(coordinate, center.x, center.y);

//         elements.push(hexagon);
//     }

//     addOnclickEventOnHexagon(elements);

//     logMessage({
//         "type": "suc",
//         "message": "loadMap() : map has been created"
//     });
// }

// /**
//  * Switch the maps
//  */
// function switchMap() {

//     let top_map;

//     let bottom_map;

//     if (ACTUAL_MAP == "foreground") {

//         top_map = "#underground-map";

//         bottom_map = "#foreground-map";

//         ACTUAL_MAP = "underground";

//     } else {

//         top_map = "#foreground-map";

//         bottom_map = "#underground-map";

//         ACTUAL_MAP = "foreground";
//     }

//     d3.select(top_map)
//         .transition()
//         .duration(300)
//         .styles({

//             opacity: 1,

//             top: '200px',

//             left: '0px',

//             transform: "scale(1, 1)"

//         });

//     d3.select(bottom_map)
//         .transition()
//         .duration(300)
//         .styles({

//             opacity: 0.2,

//             top: '200px',

//             left: '-250px',

//             transform: "scale(0.7, 0.7)"

//         });

// }

// /**
//  * 
//  * @param {*} hexagon 
//  * @param {*} movement_points 
//  */
// function showAvailableMovement(elements, hexagon, movement_points=1) {

//     elements.forEach(function(element){

//         if ( isReachable(element, hexagon, movement_points)) {

//             element.showAsAvailable();

//         }
//     });

//     console.log(nb);
// }

// /**
//  * 
//  * @param {Object} element 
//  * @param {Object} origin 
//  * @param {Number} movement_points 
//  */
// function isReachable(element, origin, movement_points){

//     if ( element.x >= origin.x - movement_points && element.x <= origin.x + movement_points ){

//         if ( element.y >= origin.y - movement_points && element.y <= origin.y + movement_points ){

//             if ( element.z >= origin.z - movement_points && element.z <= origin.z + movement_points ){

//                 return true;

//             }
//         }

//     } else {

//         return false;

//     }
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