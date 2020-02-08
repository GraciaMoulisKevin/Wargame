/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

/**
 * onload of the document execute start();
 */
window.onload = start;

/**
 * MACROS
 */
RADIUS = 0;
WIDTH = 0;
HEIGHT = 0;

/**
 * Classes
 */
class Hexagon {

    constructor(data, id) {
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.id = id;
        this.type = data.type;
        if (this.isCorrectCoordinate(this.x, this.y, this.z)) {
            this.createHexagon();
        } else {
            logMessage({
                "type": "war",
                "message": " Hexagon::Constructor() : Invalid coordinate (" + this.x + ", " + this.y + ", " + this.z + ")"
            });
        }
    }

    isCorrectCoordinate(x, y, z) {
        return ((x + y + z) == 0);
    }

    createHexagon() {

        let center_x = WIDTH / 2,
            center_y = HEIGHT / 2,
            diameter = RADIUS * 2,
            spacing = (Math.sqrt(3) / 2) * RADIUS, // radius of the inscribed circle
            z_spacing = (3 / 4) * diameter,
            points = new Array(),
            can_create = true,
            temp_x,
            temp_y;

        let i = 0;
        while (i < 6 && can_create == true) {

            let angle = degreeToRadian(60 * (i + 1)),
                pt_x = Math.sin(angle) * RADIUS,
                pt_y = -Math.cos(angle) * RADIUS;

            pt_x = ((pt_x * 100) / 100) + center_x;
            pt_y = ((pt_y * 100) / 100) + center_y + this.z * z_spacing;

            // add correct spacing
            if (this.x != 0) {
                pt_x += this.x * spacing;
            }
            if (this.y != 0) {
                pt_x += -this.y * spacing;
            }

            // last verification to make sure pt_x && pt_y can be in the svg
            if (pt_x <= WIDTH && pt_x >= 0 && pt_y <= HEIGHT && pt_y >= 0) {
                points.push(new Array(pt_x, pt_y));
            } else {
                can_create = false;
                points = null;
                logMessage({
                    "type": "war",
                    "message": "Hexagon::createHexagon() : Invalid coordinate (" + this.x + ", " + this.y + ", " + this.z + ")"
                });
            }

            // [ TEMPORARY ] Allowed to print coordinate on each hexagon
            if (i == 3) {
                temp_x = pt_x;
                temp_y = pt_y
            }

            i++;
        }

        if (can_create) {
            d3.select("#map > svg")
                .append("polygon")
                .attr("class", "hexagon")
                .attr("data-x", this.x)
                .attr("data-y", this.y)
                .attr("data-z", this.z)
                .attr("points", function (d) {
                    let attr_points = "";
                    for (let pts of points) {
                        attr_points += pts[0] + "," + pts[1] + " ";
                    }
                    return attr_points;
                })
                .style("stroke", "black")
                .style("fill", this.type)
                .on("click", function () {
                    let dataset = $(this).data(),
                        x = dataset.x,
                        y = dataset.y,
                        z = dataset.z;

                    moveUnityTo(0, {
                        "x": x,
                        "y": y,
                        "z": z
                    });
                    console.log(`coord : x(${x}) y(${y}) z(${z})`);
                });

            // [ TEMPORARY ] Print coordinate on each hexagon
            d3.select("#map > svg").append("text")
                .attr("x", temp_x)
                .attr("y", temp_y)
                .attr("fill", "red")
                .html("&nbsp; x=" + this.x + " y=" + this.y + " z=" + this.z);
        }
    }
}

/**
 * Transform degrees to radian
 * @param {Int} deg 
 */
function degreeToRadian(deg) {
    return Math.PI * deg / 180;
}

/**
 * Send message on the console
 * @param {*} object 
 */
function logMessage(object) {

    let successStyle = ['background: #044F06', 'line-height: 20px', 'color: #B8EBAD', 'text-align: center', 'font-weight: bold'].join(';');
    let warningStyle = ['background: #332B00', 'line-height: 20px', 'color: #EDCD90', 'text-align: center', 'font-weight: bold'].join(';');
    let errorStyle = ['background: #690000', 'line-height: 20px', 'color: #FF7074', 'text-align: center', 'font-weight: bold'].join(';');

    switch (object.type) {
        case "suc":
            console.log("%c [ SUCCESS ] %s ", successStyle, object.message);
            break;
        case "war":
            console.log("%c [ WARNING ] %s ", warningStyle, object.message);
            break;
        case "err":
            console.log("%c [ ERROR ] %s ", errorStyle, object.message);
            break;
        default:
            break;
    }
}

/**
 * Get the number of hexagons needed to reach an hexagon
 * @param {Object} id1 
 * @param {Object} id2 
 */
function getDistanceBetweenHexagon(coordA, coordB) {
    return (Math.abs(coordA.x - coordB.x) + Math.abs(coordA.y - coordB.y) + Math.abs(coordA.z - coordB.z)) / 2;
}

/**
 * Linear interpolation
 * @param {Number} a 
 * @param {Number} b 
 * @param {Number} t
 */
function linearInterpolation(a, b, t) {
    return (a + (b - a) * t);
}

/**
 * Get the next hexagons where the units as to run
 * @param {Object} coordA
 * @param {Object} coordB
 * @param {Number} t
 */
function getNextHexagonCoordinate(coordA, coordB, t) {
    return {
        "x": linearInterpolation(coordA.x, coordB.x, t),
        "y": linearInterpolation(coordA.y, coordB.y, t),
        "z": linearInterpolation(coordA.z, coordB.z, t)
    };
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
 * Create a path from idA to idB
 * @param {String} coordinateA 
 * @param {String} coordinateB 
 */
function pathfinder(coordinateA, coordinateB) {

    let n = getDistanceBetweenHexagon(coordinateA, coordinateB);
    let path = [];

    for (let i = 0; i <= n; i++) {
        let data = roundHexagonCoordinate(getNextHexagonCoordinate(coordinateA, coordinateB, (1 / n * i)));
        d3.select(`.hexagon[data-x="${data.x}"][data-y="${data.y}"][data-z="${data.z}"]`).style("fill", "rgba(121,123,255,0.7)");
        path.push({
            "x": data.x,
            "y": data.y,
            "z": data.z
        });
    }

    return path;
}

/**
 * Load the map
 * @param {Object} data 
 */
function loadMap(data) {
    d3.select("#map")
        .append("svg")
        .attr("id", "map_svg")
        .attr("width", data["width"])
        .attr("height", data["height"])
        .style("background-color", data["background-color"]);

    for (coordinate of data["hexagons"]) {
        let hexagon = new Hexagon(coordinate);
    }

    logMessage({
        "type": "suc",
        "message": "loadMap() : map has been created"
    });

    //[ BLACK MAGIC VERSION ]
    // let n = 3; for ( let x = -n; x <= n; x++ ){
    //     for ( let y = -n; y <= n; y++ ){
    //         for ( let z = -n; z <= n; z++ ){
    //             if ( x + y + z == 0 ){
    //                 id = "";
    //                 coordinate = {"x" : x, "y" : y, "z" : z, "type" : "rgba(0,0,0,0)"};
    //                 id += "x" + x + "y" + y + "z" + z;
    //                 let hexagon = new Hexagon(coord, id);
    //             }
    //         }
    //     }
    // }

}

/**
 * Start function when document start
 */
function start() {

    /**
     * Read map JSON data when the page is ready
     */
    $().ready(function () {
        d3.json("settings.json").then(function (data) {
            RADIUS = data["radius"];
        });
        d3.json("map.json").then(function (data) {
            WIDTH = data["width"];
            HEIGHT = data["height"];
            loadMap(data);
            createUnity();
        });
    });
}

function createUnity() {

    let startCoordinate = {
        "x": -3,
        "y": 1,
        "z": 2
    };
    let coord = getCenterCoordinateOfHexagons(startCoordinate),
        cx = coord.x,
        cy = coord.y,
        r = 10;

    d3.select("#map_svg")
        .append("circle")
        .attr("id", "lerond")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", r)
        .style("fill", "red");
}

function moveUnityTo(i, coord) {

    i++;
    let circle = d3.select("#lerond");
    let path = pathfinder({
        "x": -3,
        "y": 1,
        "z": 2
    }, {
        "x": coord.x,
        "y": coord.y,
        "z": coord.z
    });

    if (i < path.length) {
        var timer = setTimeout(function () {
            let center = getCenterCoordinateOfHexagons(path[i]);
            console.log(center);
            d3.select("#lerond").transition().attr("cx", center.x).attr("cy", center.y);
            moveUnityTo(i, coord);
        }, 700);
    } else {
        logMessage({
            "type": "suc",
            "message": "moveUnityTo() : Unit done movement"
        })
        return null;
    }
}

/**
 * 
 * @param {String} id 
 */
function getCenterCoordinateOfHexagons(coord) {
    let center_x = WIDTH / 2,
        center_y = HEIGHT / 2,
        diameter = RADIUS * 2,
        spacing = (Math.sqrt(3) / 2) * RADIUS, // radius of the inscribed circle
        z_spacing = (3 / 4) * diameter;

    x = center_x + (coord.x * spacing) + (-coord.y * spacing);
    y = center_y + (coord.z * z_spacing);

    let coordinate = {
        "x": x,
        "y": y
    };
    return coordinate;
}

/**
 * Parse the id of an hexagon to extract coordinate
 * @param {String} id 
 */
function hexagonIdParser(id) {
    let points;
    if ((/x(-?[0-9]{1,2})y(-?[0-9]{1,2})z(-?[0-9]{1,2})/.test(id))) {
        data = (/x(-?[0-9]{1,2})y(-?[0-9]{1,2})z(-?[0-9]{1,2})/.exec(id));
        points = {
            "x": parseInt(data[1]),
            "y": parseInt(data[2]),
            "z": parseInt(data[3])
        };
    } else {
        logMessage({
            "type": "err",
            "message": "hexagonIdParser( :string ) : Incorrect id type of hexagon \n id = " + id
        });
    }
    return points;
}