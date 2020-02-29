/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

/**
 * MEMO
 * https://www.youtube.com/watch?v=3EMxBkqC4z0;
 * https://jsfiddle.net/BmeKr/ EVENT LISTENER ON CLICK OF CANVAS
 *
 */

// ________ ONLOAD ________
window.onload = start;

// ________ MACROS ________

RADIUS = 0;
WIDTH = 0;
HEIGHT = 0;
PREVIOUS_SELECTED_UNIT = null;
ACTUAL_MAP = "foreground";
MOVEMENT_POINTS = 2;

// ________ CLASSES ________

class Hexagon {

    constructor(data) {

        this.x = data.x;

        this.y = data.y;
        
        this.z = data.z;

        this.type = data.type;

        this.image = document.getElementById("asset-"+this.type);

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
        
        let center = this.getCenterCoordinateOfHexagons();

        let canvas = document.getElementById('foreground-map');

        let ctx = canvas.getContext("2d");
        
        ctx.drawImage(this.image, center.x, center.y, RADIUS * 2, RADIUS * 2);
    }

    getCenterCoordinateOfHexagons() {

        let diameter = RADIUS * 2;

        let spacing = (Math.sqrt(3) / 2) * RADIUS; // radius of the inscribed circle
        
        let z_spacing = (3 / 4) * diameter;

        x = WIDTH / 2 + (this.x * spacing) + (-this.y * spacing);

        y = HEIGHT / 2 + (this.z * z_spacing);

        return {
            "x": x,
            "y": y
        };
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

// ________ HEXAGON COORDINATE ________
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

// ________ MAIN ________

/**
 * Start function when document start
 */
function start() {

    /**
     * Read map JSON data when the page is ready
     */
    $().ready(function () {
        d3.json("statics/javascript/settings.json").then(function (data) {
            RADIUS = data["radius"];
        });
        d3.json("statics/javascript/map_save.json").then(function (data) {
            WIDTH = data["width"];
            HEIGHT = data["height"];
            loadMap(data);
        });
    });
}

/**
 * Load the map
 * @param {Object} data 
 */
function loadMap(data) {

    let canvas = d3.select("#map");

    canvas.append("canvas")
        .attrs({
            id: "underground-map",
            width: data["width"],
            height: data["height"],
        })
        .styles({
            opacity: 0.2,
            "background-color": "gray",
            top: "0px",
            left: "0px",
            transform: "scale(0.7, 0.7)"
        });

    canvas.append("canvas")
        .attrs({
            id: "foreground-map",
            width: data["width"],
            height: data["height"]
        })
        .styles({
            opacity: 1,
            "background-color": "red",
            top: "150px",
            left: "250px",
            transform: "scale(1.1, 1.1)"
        });

    for (coordinate of data["hexagons"]) {
        let hexagon = new Hexagon(coordinate);
    }


    logMessage({
        "type": "suc",
        "message": "loadMap() : map has been created"
    });
}

/**
 * Switch the maps
 */
function switchMap() {

    let top_map;
    
    let bottom_map;

    if (ACTUAL_MAP == "foreground") {

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
        .styles({
            opacity: 1,
            top : '150px',
            left: '250px',
            transform: "scale(1.1, 1.1)"
        });

    d3.select(bottom_map)
        .transition()
        .duration(300)
        .styles({
            opacity: 0.2,
            top : '0px',
            left: '0px',
            transform: "scale(0.7, 0.7)"
        });

}

//https://editor.method.ac/
//https://i.pinimg.com/originals/ae/2e/3b/ae2e3be46e63253f38e6e0d21ed574e1.png
//https://img.itch.zone/aW1hZ2UvMTA5MTYwLzEyMDY4MjYucG5n/original/7SEYHd.png
//https://img.itch.zone/aW1hZ2UvMjM3NjUwLzExMzExNDIucG5n/original/693xiv.png
//https://opengameart.org/sites/default/files/Preview_100.png