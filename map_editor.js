function startEdition(type){
    d3.selectAll(".hexagon")
        .on("click", function(){
            d3.select(this)
                .attr("data-type", type);
        })
}
function stopEdition(type){
    d3.selectAll(".hexagon")
        .on("click", function(){
            onclickHexagonEvent(this);
    })
}

function printEdition(){
    
}
