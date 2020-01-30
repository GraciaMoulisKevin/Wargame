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
            log_messages( {"type":"war", "message":"Invalid coordonate ("+this.x+", "+this.y+", "+this.z+")"} );
        }
    }

    getId(){
        return this.id;
        //return (this.x + "x" + -this.y + "x" + this.z);
    }
    correctCoord(x, y ,z){ 
        return ( (x + y + z) == 0 ); 
    }

    getCoord(){
        return {"x" : this.x, "y" : this.y, "z" : this.z }
    }

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
                log_messages( {"type":"war", "message":"Invalid coordonate ("+this.x+", "+this.y+", "+this.z+")"} );
            }

            // [ TEMPORARY ] Allowed to print coord on each hexa
            // if ( i == 3 ) { temp_x = pt_x; temp_y = pt_y }

            i++;
        }

        if ( can_create ){
            d3.select("#map > svg")
            .append("polygon")
            .attr("id", this.getId())
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
                console.log(color);
                if ( color == "red" ){
                    d3.select(this).style("fill", "blue");
                }else{
                    d3.select(this).style("fill", "red");
                }
            });
            // [ TEMPORARY ] Print coord on each hexa
            // d3.select("#map > svg").append("text")
            // .attr("x", temp_x)
            // .attr("y", temp_y)
            // .attr("fill", "red")
            // .html("&nbsp; x=" + this.x + " y=" + this.y + " z=" + this.z);
        }
    }
}

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

    let succ_style = [
        'background: #332B00'
        , 'line-height: 20px'
        , 'color: #EDCD90'
        , 'text-align: center'
        , 'font-weight: bold'
    ].join(';');

    let war_style = [
        'background: #332B00'
        , 'line-height: 20px'
        , 'color: #EDCD90'
        , 'text-align: center'
        , 'font-weight: bold'
    ].join(';');

    let err_style = [
        'background: #290000'
        , 'line-height: 20px'
        , 'color: #DF6D6D'
        , 'text-align: center'
        , 'font-weight: bold'
    ].join(';');

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

    d3.select("#map > svg")
    .append("polygon")
    .attr("id", "test0")
    .attr("points", function(d){
        points = [ [10,10], [50,10], [60,60], [10,60] ];
        let attr_points = "";
        for ( let pts of points){
            attr_points += pts[0]+","+pts[1]+" ";
        }
        return attr_points;
    })
    .style("fill", "green")
    .style("stroke", "black")
    .on("click", function(d){
        let color = d3.select(this).style("fill");
        console.log(color);
        if ( color == "red" ){
            d3.select(this).style("fill", "blue");
        }else{
            d3.select(this).style("fill", "red");
        }
    });

    let i = 0;
    for ( coord of data["hexagons"]){
        let hexa = new Hexagon(coord, "poly_"+i);
    }
    log_messages( {"type" : "war", "message" : "Fin de création des hexagones"});
}