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
    printMap();
}

function printMap(){
    let textarea = d3.select("body").append("p").html("Actual Map").append("textarea"),
        n = d3.selectAll(".hexagon").size() - 1,
        str = "";
    
    d3.selectAll(".hexagon").each(function(d,i){
        if ( i < n ){
            str += `{ "x": ${this.getAttribute("data-x")}, "y": ${this.getAttribute("data-y")}, "z": ${this.getAttribute("data-z")}, "type": "${this.getAttribute("data-type")}"},\n`
        } else {
            str += `{ "x": ${this.getAttribute("data-x")}, "y": ${this.getAttribute("data-y")}, "z": ${this.getAttribute("data-z")}, "type": "${this.getAttribute("data-type")}"}\n`
        }
        console.log(i + " < " + n);
    });

    textarea.html(str);
}

function randomMap(n){
    let textarea = d3.select("body").append("p").html("Random Map").append("textarea"),
        str = "",
        type = ["grass", "mountain", "water", "volcano", "sand", "snow", "forest", "urban"];

    for ( let x = -n; x <= n; x++ ){
        for ( let y = -n; y <= n; y++ ){
            for ( let z = -n; z <= n; z++ ){
                if ( x + y + z == 0 ){
                    let r = Math.floor((Math.random() * type.length));
                    str += `{"x" : ${x}, "y" : ${y}, "z" : ${z}, "type" : "${type[r]}"},\n`;
                }
            }
        }
    }
    textarea.html(str);
}