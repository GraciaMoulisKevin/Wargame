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
    }[]
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
        }

        this.game.manager.setComponentDataForEntities([mapId], 'Map', {
            width: mapDefinition.width,
            height: mapDefinition.height,
            tile_size: mapDefinition.tile_size,
            layers: layers
        });

        console.log(this.game.manager.getComponentDataByEntity(mapId, 'Map'));

        return mapId;
    }

}
