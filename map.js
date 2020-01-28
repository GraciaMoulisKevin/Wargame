/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

/**
 * MACROS
 */
RADIUS = 0;
CENTER_X = 0;
CENTER_Y = 0;

/**
 * Classes
 */
class Hexagon{
    
    constructor(coordonates){ 
        this.x = coordonates.x;
        this.y = coordonates.y;
        this.z = coordonates.z;
        this.createHexagon();
    }

    createHexagon(){

        let points = new Array(), 
        diameter = RADIUS*2,
        x_spacement = (Math.sqrt(3) / 2) * RADIUS * 2,
        y_spacement = (3/4)*diameter, 
        angle;

        for ( let i = 0; i < 6; i++ ){
            angle = degToRadian(60*(i+1));
            let pt_x = Math.sin(angle)*RADIUS;
            let pt_y = -Math.cos(angle)*RADIUS;
            
            pt_x = Math.round(pt_x*100)/100 + CENTER_X + this.x * x_spacement + this.z * RADIUS/2;
            pt_y = Math.round(pt_y*100)/100 + CENTER_Y + this.y * y_spacement + this.z * RADIUS/2;
            
            if ( this.y%2 != 0 ){ pt_x -= x_spacement/2;}
            points.push(new Array(pt_x,pt_y));
        }

        d3.select("#map > svg")
        .append("polygon")
        .attr("points", function(d,i){
            let attr_points = "";
            for ( let pts of points){
                attr_points += pts[0]+","+pts[1]+" ";
            }
            return attr_points;
        })
        .style("stroke", "black")
        .style("fill", "white")
        .append("svg").attr("width", 20).attr("height", 20)
        .append("text")
        .attr("x", points[0][0])
        .attr("y", points[0][1])
        .attr("fill", "red")
        .text("ALLO ?");
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
 * Read map JSON data when the page is ready
 */
$().ready(function(){
    d3.json("settings.json").then(function(data){
        RADIUS = data["radius"];
    });
    d3.json("map.json").then(function(data){
        CENTER_X = data["width"] / 2;
        CENTER_Y = data["height"] / 2;
        loadMap(data);
    });
});

/**
 * Load the map
 * @param {*} data 
 */
function loadMap(data){
    d3.select("#map")
    .append("svg")
    .attr("width", data["width"])
    .attr("height", data["height"])
    .attr("id", "map_svg")
    .style("background-color", "lightgray");
    
    for ( coord of data["hexagons"]){
        let hexa = new Hexagon(coord);
    }  



}

// (sqrt(3)/2) * r => espacement à utilser entre les hexagones