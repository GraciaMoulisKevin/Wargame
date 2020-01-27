/**
 * Author : Canta Thomas
 * 
 * Git Repository : https://github.com/GraciaMoulisKevin/Wargame
 * 
 * Copyright : 2020 Ⓒ
 */

/**
 * Read map JSON data when the page is ready
 */
$().ready(function(){
    d3.json("map.json").then(function(data){
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
    .style("background-color", "gray");
}
