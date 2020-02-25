/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

// ________ ONLOAD ________
window.onload = start;

// ________ MACROS ________

RADIUS = 0;
WIDTH = 0;
HEIGHT = 0;
PREVIOUS_SELECTED_UNIT = null;
ACTUAL_MAP = "foreground";
MOVEMENT_POINT = 1;

// ________ CLASSES ________

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
            // if (i == 3) {
            //     temp_x = pt_x;
            //     temp_y = pt_y
            // }

            i++;
        }

        if (can_create) {

            
            d3.select("#foreground-map")
                .append("polygon")
                .attr("class", "hexagon foreground-hexagon")
                .attr("data-scale", "foreground")
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
                .style("fill", "lightgreen")
                .on("click", function () {
                    onclickHexagonEvent(this);
                });

            d3.select("#underground-map")
                .append("polygon")
                .attr("class", "hexagon underground-hexagon")
                .attr("data-scale", "underground")
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
                .style("fill", "lightgray")
                .on("click", function () {
                    onclickHexagonEvent(this)
                });


            // [ TEMPORARY ] Print coordinate on each hexagon
            // d3.select("#foreground-map").append("text")
            //     .attr("x", temp_x)
            //     .attr("y", temp_y)
            //     .attr("fill", "red")
            //     .html("&nbsp; x=" + this.x + " y=" + this.y + " z=" + this.z);
        }
    }
}

// ________ HELPFULL ________

/**
 * Transform degrees to radian
 * @param {Number} deg 
 */
function degreeToRadian(deg) {
    return Math.PI * deg / 180;
}

/**
 * Send message on the console
 * @param {Object} object 
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
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} z
 */
function createCoordinate(x, y, z) {
    return {
        "x": x,
        "y": y,
        "z": z
    };
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
 * Uncolored all colored hexagon
 */
function uncoloredHexagon() {
    d3.selectAll(".colored")
        .classed("colored", false)
        .style("fill", "rgba(0,0,0,0)");
}

/**
 * Check if two hexagon belong to the same scale
 * @param {Node} hexagonA 
 * @param {Node} hexagonB
 * @return null if false else the scale
 */
function isOnSameScale(nodeA, nodeB) {
    let scaleA = nodeA.getAttribute("data-scale"),
        scaleB = nodeB.getAttribute("data-scale");

    if (scaleA == scaleB) {
        return scaleA;
    } else {
        logMessage({
            "type": "err",
            "message": "isHexagonBelongToSameScale( :node, :node ) : The nodes gives don't belong to the same scale"
        });
        return null;
    }
}

// ________ GET (HEXAGON) ________

/**
 * Return all data attribute (data-placement, data-x, data-y ...)
 * @param {Node} hexagon 
 */
function getHexagonDataset(node) {
    return $(node).data();
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

    return {
        "x": x,
        "y": y
    };

}

/**
 * Get the number of hexagons needed to reach an hexagon
 * @param {Node} hexagonA 
 * @param {Node} hexagonB
 */
function getDistanceBetweenHexagon(hexagonA, hexagonB) {
    let coordA = getHexagonDataset(hexagonA),
        coordB = getHexagonDataset(hexagonB);
    return (Math.abs(coordA.x - coordB.x) + Math.abs(coordA.y - coordB.y) + Math.abs(coordA.z - coordB.z)) / 2;
}

/**
 * Get the next hexagons where the units as to run
 * @param {Object} hexagonA
 * @param {Object} hexagonB
 * @param {Number} t
 */
function getNextHexagonCoordinate(hexagonA, hexagonB, t) {
    let coordA = getHexagonDataset(hexagonA),
        coordB = getHexagonDataset(hexagonB);
    return {
        "x": linearInterpolation(coordA.x, coordB.x, t),
        "y": linearInterpolation(coordA.y, coordB.y, t),
        "z": linearInterpolation(coordA.z, coordB.z, t)
    };
}

// ________ GET (UNIT) ________

/**
 * Return data attribute (data-scale, data-x, data-y & data-z)
 * @param {Node} unit
 */
function getUnitDataset(unit){
    return {
        "scale": unit.getAttribute("data-scale"),
        "x": parseInt(unit.getAttribute("data-x")),
        "y": parseInt(unit.getAttribute("data-y")),
        "z": parseInt(unit.getAttribute("data-z"))
    }
}

/**
 * Return the hexagon where the unit is
 * @param {Node} unit
 * @return {Node} a node
 */
function getHexagonWhereUnitIsLocated(unit){
    let data = getUnitDataset(unit);
    return d3.select(`.hexagon[data-scale="${data.scale}"][data-x="${data.x}"][data-y="${data.y}"][data-z="${data.z}"]`).node();
}
// ________ MAIN ________

/**
 * Switch the maps
 */
function switchMap(){

    let top_map, bottom_map;
    
    if ( ACTUAL_MAP == "foreground" ){
        top_map = "#underground-map";
        bottom_map = "#foreground-map";
        ACTUAL_MAP = "underground";
    } else {
        top_map = "#foreground-map";
        bottom_map = "#underground-map";
        ACTUAL_MAP = "foreground";
    }

    d3.select(top_map)
        .transition()
        .duration(300)
        .attr("transform", "rotate(-5,"+WIDTH/2+","+HEIGHT/2+") translate(100, -50) scale(1.1, 1.1)")
        .style("opacity", 1);

    d3.select(bottom_map)
        .transition()
        .duration(300)
        .attr("transform", "rotate(-5,"+WIDTH/2+","+HEIGHT/2+") translate(-100, 50) scale(0.7, 0.7)")
        .style("opacity", 0.2);

}

/**
 * Create a path from idA to idB
 * @param {Node} hexagonA 
 * @param {Node} hexagonB 
 */
function pathfinder(hexagonA, hexagonB) {

    let scale = isOnSameScale(hexagonA, hexagonB);
    if (scale != null) {
        let n = getDistanceBetweenHexagon(hexagonA, hexagonB);
        let path = [];

        for (let i = 0; i <= n; i++) {
            let data = roundHexagonCoordinate(getNextHexagonCoordinate(hexagonA, hexagonB, (1 / n * i)));
            d3.select(`.${scale}-hexagon[data-x="${data.x}"][data-y="${data.y}"][data-z="${data.z}"]`)
                .classed("colored", true)
                .style("fill", "rgba(150,150,255,0.4)");

            path.push({
                "x": data.x,
                "y": data.y,
                "z": data.z
            });
        }
        return path;
    } else {
        return null;
    }
}

/**
 * 
 * @param {Node} hexagon 
 */
function showAllowedMovement(hexagon, movement_points) {

    let data = getHexagonDataset(hexagon);

    for (let x = data.x - movement_points; x <= data.x + movement_points; x++) {
        for (let y = data.y - movement_points; y <= data.y + movement_points; y++) {
            for (let z = data.z - movement_points; z <= data.z + movement_points; z++) {
                if (x + y + z == 0) {
                    d3.select(`.${data.scale}-hexagon[data-x="${x}"][data-y="${y}"][data-z="${z}"]`)
                        .classed("colored", true)
                        .style("fill", "rgba(150,150,255,0.4)");
                }
            }
        }
    }
}

/**
 * Load the map
 * @param {Object} data 
 */
function loadMap(data) {

    let svg = d3.select("#map")
        .append("svg")
        .attr("id", "svg-map")
        .attr("width", data["width"])
        .attr("height", data["height"]);

    svg.append("g")
        .attrs({
            id : "underground-map",
            transform : "rotate(-5,"+WIDTH/2+","+HEIGHT/2+") translate(-100, 50) scale(0.7,0.7)"
        })
        .style("opacity", 0.2);

    svg.append("g")
        .attrs({
            id : "foreground-map",
            transform : "rotate(-5,"+WIDTH/2+","+HEIGHT/2+") translate(100, -50) scale(1.1, 1.1)"
        })
        .style("opacity", 1);

    for (coordinate of data["hexagons"]) {
        let hexagon = new Hexagon(coordinate);
    }

    logMessage({
        "type": "suc",
        "message": "loadMap() : map has been created"
    });
}

function onclickHexagonEvent(hexagon) {
    if ( PREVIOUS_SELECTED_UNIT != null ){
        if (isOnSameScale(PREVIOUS_SELECTED_UNIT, hexagon) == null ){
            return null;
        } else {
            uncoloredHexagon();
            let unitHexagon = getHexagonWhereUnitIsLocated(PREVIOUS_SELECTED_UNIT);
            PREVIOUS_SELECTED_UNIT = null;
            pathfinder(unitHexagon, hexagon);
            moveUnit(0, unitHexagon, hexagon);
        }
    }
}

/**
 * 
 * @param {Node} unit 
 */
function onclickUnitEvent(unit) {
    
    let hexagon = getHexagonWhereUnitIsLocated(unit);

    if (PREVIOUS_SELECTED_UNIT == null){
        PREVIOUS_SELECTED_UNIT = unit;
        showAllowedMovement(hexagon, MOVEMENT_POINT);
    } else if ( PREVIOUS_SELECTED_UNIT.isEqualNode(unit) ){
        uncoloredHexagon();
        PREVIOUS_SELECTED_UNIT = null;
    } else if ( !PREVIOUS_SELECTED_UNIT.isEqualNode(unit) ){
        uncoloredHexagon();
        showAllowedMovement(hexagon, MOVEMENT_POINT);
        PREVIOUS_SELECTED_UNIT = unit;
    } else {
        showAllowedMovement(hexagon, MOVEMENT_POINT);
        PREVIOUS_SELECTED_UNIT = unit;
    }
}

function axialToCubeCoordinate(_x, _y){
    let x = _x, z = _y, y = -x-z;
    console.log(createCoordinate(x,y,z));
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
            createUnit("soldat", "foreground");
            createUnit("sapeur", "underground");
        });
    });
}

// ________ TEMPORARY ________

function createUnit(type, scale) {

    let startCoordinate = createCoordinate(0, 0, 0);

    let coord = getCenterCoordinateOfHexagons(startCoordinate),
        cx = coord.x,
        cy = coord.y,
        r = 10;

    d3.select(`#${scale}-map`)
        .append("circle")
        .attrs({
            id : function(){ return ( type == "soldat" )? "lerond" : "" },
            class : type,
            "data-scale" : scale,
            "data-x" : 0,
            "data-y" : 0,
            "data-z" : 0,
            cx : cx,
            cy : cy,
            r : r
        })
        .style("fill", function(){
            return ( type == "soldat" )? "red" : "blue";
        })
        .on("click", function () {
            onclickUnitEvent(this);
        });
}

/**
 * 
 * @param {Number} i (by default use 0) 
 * @param {Node} unit 
 * @param {Node} hexagonA 
 */
function moveUnit(i, hexagonA, hexagonB) {

    i++;

    let path = pathfinder(hexagonA, hexagonB);
    let node = d3.select("#lerond")

    if (i < path.length) {
        var timer = setTimeout(function () {
            let center = getCenterCoordinateOfHexagons(path[i]);
            
            node.attrs({
                "data-x" : path[i].x,
                "data-y" : path[i].y,
                "data-z" : path[i].z
            });
            
            node.transition()
                .attrs({
                    cx : center.x,
                    cy : center.y
                });

            moveUnit(i, hexagonA, hexagonB);
        }, 700);
    } else {
        logMessage({
            "type": "suc",
            "message": "moveUnityTo() : Unit done movement"
        });
        uncoloredHexagon();
    }
}




// ################################## ARCHIVE ############################### //
/**
//  * Parse the id of an hexagon to extract coordinate
//  * @param {String} id 
//  */
// function hexagonIdParser(id) {
//     let points;
//     if ((/x(-?[0-9]{1,2})y(-?[0-9]{1,2})z(-?[0-9]{1,2})/.test(id))) {
//         data = (/x(-?[0-9]{1,2})y(-?[0-9]{1,2})z(-?[0-9]{1,2})/.exec(id));
//         points = {
//             "x": parseInt(data[1]),
//             "y": parseInt(data[2]),
//             "z": parseInt(data[3])
//         };
//     } else {
//         logMessage({
//             "type": "err",
//             "message": "hexagonIdParser( :string ) : Incorrect id type of hexagon \n id = " + id
//         });
//     }
//     return points;
// }

// function getDataHexagonAttributs(){

//     let data = d3.selectAll("hexagon");
//     let node = data["_groups"][0];

//     for ( hexagon of node ){
//         console.log(hexagon.attributes);
//     }
// }

//[ BLACK MAGIC VERSION ]
// let n = 3; for ( let x = -n; x <= n; x++ ){
//     for ( let y = -n; y <= n; y++ ){
//         for ( let z = -n; z <= n; z++ ){
//             if ( x + y + z == 0 ){
//                 id = "";
//                 coordinate = {"x" : x, "y" : y, "z" : z, "type" : "rgba(0,0,0,0)"};
//                 id += "x" + x + "y" + y + "z" + z;
//                 let hconsole.log("")
//     }
// }