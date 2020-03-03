function buildLevel(game, level){
    
    let hexagons = [];

    d3.json(`/statics/data/${level}`).then( function(data){
        
        let hexagonSize = data["hexagon_size"];

        for ( hexagon of data["hexagons"] ){
            
            hexagons.push(new Hexagon(game, hexagon.x, hexagon.y, hexagon.z, hexagon.type, hexagonSize ) );
        }
    });

    return hexagons;
}