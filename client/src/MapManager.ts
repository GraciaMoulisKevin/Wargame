import Game from "../../ecs/Game";

interface MapDefinition {
    width: number,
    height: number,
    tile_size: number,
    layers: {
        name: string,
        tiles: [{
            x: number,
            y: number,
            z: number,
            type: string
        }]
    }
}

export default class MapManager {

    private game: Game;

    constructor(game) {
        this.game = game;
    }

    public createMap(mapDefinition: MapDefinition): number {
        const mapId = this.game.manager.createEntity(['Map']);

        let layers = [];
        for(const layer of mapDefinition.layers) {
            layers.push(layer.name);

            for(const tile of layer.tiles) {
                const tileId = this.game.manager.createEntity(['Renderable', 'MapTile', 'Position']);

                this.game.manager.setComponentDataForEntities([tileId], 'MapTile', {
                    mapId: mapId,
                    layer: layer.name,
                    x: tile.x,
                    y: tile.y,
                    z: tile.z,
                    type: tile.type
                });

                const center = this.getCenterCoordinateOfHexagons(tile.x, tile.y, tile.z, mapDefinition);

                this.game.manager.setComponentDataForEntities([tileId], 'Position', {
                    x: center.x,
                    y: center.y,
                });
            }
        }

        this.game.manager.setComponentDataForEntities([mapId], 'Map', {
            width: mapDefinition.width,
            height: mapDefinition.height,
            tile_size: mapDefinition.tile_size,
            layers: layers
        });

        return mapId;
    }

    private getCenterCoordinateOfHexagons(x, y, z, mapDefinition: MapDefinition): {x: number, y: number} {

        let x_spacing = (Math.sqrt(3) / 2) * mapDefinition.tile_size / 2; // size of the inscribed circle
        let z_spacing = (3 / 4) * mapDefinition.tile_size;

        let x_center = mapDefinition.width / 2 + (x * x_spacing) + (-y * x_spacing);
        let y_center = mapDefinition.height / 2 + (z * z_spacing);

        return {
            x: x_center,
            y: y_center
        };
    }

}
