import * as io from 'socket.io-client';
import * as d3 from 'd3';

const socket = io();

//Make an SVG Container
let svgContainer = d3.select("body").append("svg")
    .attr("width", 800)
    .attr("height", 800)
    .style("border", "1px solid black");

//Draw the Circle
let circle = svgContainer.append("circle")
                         .attr("cx", 30)
                         .attr("cy", 30)
                         .attr("r", 20);

socket.on('test', function (state) {

    d3.select("circle").attr("cx", state.x);
    d3.select("circle").attr("cy", state.y);

});

