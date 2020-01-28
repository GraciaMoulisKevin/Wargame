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
        this.y = coordonates.y; // '-' to simplify in my head
        this.z = coordonates.z;
        this.createHexagon();
    }

    createHexagon(){

        let points = new Array(), 
        diameter = RADIUS*2,
        spacement = (Math.sqrt(3) / 2) * RADIUS,
        z_spacement = (3/4)*diameter,
        angle,
        temp_x,
        temp_y;

        for ( let i = 0; i < 6; i++ ){
            
            angle = degToRadian(60*(i+1));
            let pt_x = Math.sin(angle)*RADIUS;
            let pt_y = -Math.cos(angle)*RADIUS;

            pt_x = ((pt_x*100)/100) + CENTER_X;
            pt_y = ((pt_y*100)/100) + CENTER_Y + this.z * z_spacement ;

            if (this.x != 0 || this.y != 0){
                if( this.x != 0){
                    pt_x += this.x * spacement;
                }
                if( this.y != 0 ){
                    pt_x += -this.y * spacement;
                }
            }

            points.push(new Array(pt_x,pt_y));

            if ( i == 3 ) {
                temp_x = pt_x;
                temp_y = pt_y
            }
        }

        d3.select("#map > svg")
        .append("polygon")
        .attr("id", this.x + "x" + -this.y + "x" + this.z)
        .attr("points", function(d){
            let attr_points = "";
            for ( let pts of points){
                attr_points += pts[0]+","+pts[1]+" ";
            }
            return attr_points;
        })
        .style("stroke", "black")
        .style("fill", "white");
    
        d3.select("#map > svg").append("text")
        .attr("x", temp_x)
        .attr("y", temp_y)
        .attr("fill", "red")
        .html("&nbsp; x=" + this.x + " y=" + this.y + " z=" + this.z);

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