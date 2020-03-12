import Game from "../../ecs/Game";

export default class MapManager {

    private game: Game;

    constructor(game) {
        this.game = game;
    }

    public createMap(mapDefinition: object, level: number): number {
        const mapId = this.game.manager.createEntity(['Map']);

        

        this.game.manager.setComponentDataForEntities([mapId], 'Map', {});

        return mapId;
    }

}
