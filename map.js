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
class Hexagon{
    
    constructor(data, id){ 
        this.x = data.x;
        this.y = data.y;
        this.z = data.z;
        this.id = id;
        this.type = data.type;
        if ( this.correctCoord(this.x, this.y, this.z) ) {
            this.createHexagon();
        }else{
            log_messages( {"type":"war", "message":"Invalid coordinate ("+this.x+", "+this.y+", "+this.z+")"} );
        }
    }

    correctCoord(x, y ,z){ return ( (x + y + z) == 0 ); }

    createHexagon(){

        let center_x = WIDTH/2,
        center_y = HEIGHT/2,
        diameter = RADIUS*2,
        spacement = (Math.sqrt(3) / 2) * RADIUS, // radius of the inscribed circle
        z_spacement = (3/4)*diameter,
        points = new Array(),
        can_create = true,
        temp_x,
        temp_y;

        let i = 0; while ( i < 6 && can_create == true ){
            
            let angle = degToRadian(60*(i+1)),
            pt_x = Math.sin(angle)*RADIUS,
            pt_y = -Math.cos(angle)*RADIUS;

            pt_x = ((pt_x*100)/100) + center_x;
            pt_y = ((pt_y*100)/100) + center_y + this.z * z_spacement ;

            // add correct spacement
            if( this.x != 0){ pt_x += this.x * spacement; }
            if( this.y != 0 ){ pt_x += -this.y * spacement; }

            // last verification to make sure pt_x && pt_y can be in the svg
            if ( pt_x <= WIDTH && pt_x >= 0 && pt_y <= HEIGHT && pt_y >= 0 ){
                points.push(new Array(pt_x,pt_y));
            }else {
                can_create = false; points = null;
                log_messages( {"type":"war", "message":"Invalid coordinate ("+this.x+", "+this.y+", "+this.z+")"} );
            }

            // [ TEMPORARY ] Allowed to print coord on each hexa
            if ( i == 3 ) { temp_x = pt_x; temp_y = pt_y }

            i++;
        }

        if ( can_create ){
            d3.select("#map > svg")
            .append("polygon")
            .attr("id", this.id)
            .attr("class", "hexagon")
            .attr("points", function(d){
                let attr_points = "";
                for ( let pts of points){
                    attr_points += pts[0]+","+pts[1]+" ";
                }
                return attr_points;
            })
            .style("stroke", "black")
            .style("fill", this.type)
            .on("click", function(){
                let color = d3.select(this).style("fill");
                if ( color == "red" ){
                    d3.select(this).style("fill", "rgba(0,0,0,0");
                }else{
                    d3.select(this).style("fill", "rgba(121,123,255,0.7)");
                }
                let id = d3.select(this).attr("id")
                pathfinder("x2y-2z0", id);
            });

            // [ TEMPORARY ] Print coord on each hexa
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
 * @param {int} deg 
 */
function degToRadian(deg){
    return Math.PI*deg/180;
}

/**
 * Send message on the console
 * @param {*} object 
 */
function log_messages(object){

    let succ_style = ['background: #044F06', 'line-height: 20px', 'color: #B8EBAD', 'text-align: center', 'font-weight: bold'].join(';');
    let war_style = ['background: #332B00', 'line-height: 20px', 'color: #EDCD90', 'text-align: center', 'font-weight: bold'].join(';');
    let err_style = ['background: #290000', 'line-height: 20px', 'color: #DF6D6D', 'text-align: center', 'font-weight: bold'].join(';');

    switch (object.type) {
        case "suc":
            console.log("%c [ SUCCESS ] %s " , succ_style, object.message);
            break;
        case "war":
            console.log("%c [ WARNING ] %s " , war_style, object.message);
            break;
        case "err":
            console.log("%c [ ERROR ] %s " , err_style, object.message);
            break;
        default: 
            break;
    }   
}

/**
 * Load the map
 * @param {*} data 
 */
function loadMap(data){
    d3.select("#map")
    .append("svg")
    .attr("id", "map_svg")
    .attr("width", data["width"])
    .attr("height", data["height"])
    .style("background-color", data["background-color"]);

    // [ TO KEEP ]
    for ( coord of data["hexagons"]){
        let id = "x" + coord.x + "y" + coord.y + "z" + coord.z;
        let hexa = new Hexagon(coord, id);
    }

    // [ BLACK MAGIC VERSION ]
    // let n = 3;
    // for ( let x = -n; x <= n; x++ ){
    //     for ( let y = -n; y <= n; y++ ){
    //         for ( let z = -n; z <= n; z++ ){
    //             if ( x + y + z == 0 ){
    //                 id = "";
    //                 coord = {"x" : x, "y" : y, "z" : z, "type" : "rgba(0,0,0,0)"};
    //                 id += "x" + x + "y" + y + "z" + z;
    //                 let hexa = new Hexagon(coord, id);
    //             }
    //         }
    //     }
    // }

    log_messages( {"type" : "suc", "message" : "map has been created"});
}

/**
 * Parse the id of an hexagon to extract coordinate
 * @param {String} id 
 */
function hexaIdParser(id){
    let points = "";
    if ( (/x(-?[0-9]{1,2})y(-?[0-9]{1,2})z(-?[0-9]{1,2})/.test(id) )){
        data = (/x(-?[0-9]{1,2})y(-?[0-9]{1,2})z(-?[0-9]{1,2})/.exec(id));
        points = { "x" : parseInt(data[1]), "y" : parseInt(data[2]), "z" : parseInt(data[3]) };
    }else{
        log_messages({ "type": "err", "message" : "Incorrect id give to hexaIdParser(id)"});
    }
    return points;
}

/**
 * Get the number of hexagons needed to reach an hexagon
 * @param {Object} id1 
 * @param {Object} id2 
 */
function getHexaDistanceById(coordA, coordB){
    return ( Math.abs(coordA.x - coordB.x) + Math.abs(coordA.y - coordB.y) + Math.abs(coordA.z - coordB.z))/2;
}

/**
 * Linear interpolation
 * @param {int} a 
 * @param {int} b 
 * @param {float} t 
 */
function lerp(a, b, t){
    return (a + (b-a) * t);
}

/**
 * Get the next hexagons where the units as to run
 * @param {Object} a 
 * @param {Object} b 
 * @param {float} t
 */
function getNextHexa(a, b, t){
    return {"x" : lerp(a.x, b.x, t), "y" : lerp(a.y, b.y, t), "z" :lerp(a.z, b.z, t)};
}

/**
 * round data to get proper coordinate
 * @param {Object} coord 
 */
function roundHexaCoord(data){

    var x = Math.round(data.x)
    var y = Math.round(data.y)
    var z = Math.round(data.z)

    var x_diff = Math.abs(x - data.x)
    var y_diff = Math.abs(y - data.y)
    var z_diff = Math.abs(z - data.z)

    if ( (x_diff >= y_diff) && (x_diff >= z_diff) ){
        x = -y-z;
    }else if (y_diff >= z_diff){
        y = -x-z;
    }else{
        z = -x-y;
    }

    return {"x" : x, "y" : y, "z" : z};
}

/**
 * Create a path from idA to idB
 * @param {String} idA 
 * @param {String} idB 
 */
function pathfinder(idA, idB){

    let coordA = hexaIdParser(idA);
    let coordB = hexaIdParser(idB);

    let n = getHexaDistanceById(coordA, coordB);

    for ( let i=0; i <= n; i++){
        let data = roundHexaCoord(getNextHexa(coordA, coordB, (1/n * i)));
        d3.select("#x"+data.x+"y"+data.y+"z"+data.z).style("fill", "rgba(121,123,255,0.7)");
    }
}

function start(){

    /**
     * Read map JSON data when the page is ready
     */
    $().ready(function(){
        d3.json("settings.json").then(function(data){
            RADIUS = data["radius"];
        });
        d3.json("map.json").then(function(data){
            WIDTH = data["width"];
            HEIGHT = data["height"];
            loadMap(data);
        });
    });

}