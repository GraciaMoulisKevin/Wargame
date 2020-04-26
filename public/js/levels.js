function buildLevel(map, level, type){
    
    let hexagons = [];

    d3.json(`../public/data/${level}`).then( function(data){
        
        let hexagonSize = data["hexagon_size"];
        
        for ( hexagon of data[type] ){
            
            hexagons.push(new Hexagon(map, hexagon.x, hexagon.y, hexagon.z, hexagon.type, hexagonSize));
        }
    });

    return hexagons;
}