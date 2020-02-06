import System from "../../ecs/System";
import Game from "../../ecs/Game";

export default class LocationSystem extends System {

    public onDisable(): void {

    }

    public onEnable(): void {

    }

    public onUpdate(): void {

        const entities = this.game.manager.getEntitiesByComponents(['Location']);

        for(const entityId of entities) {
            let locationState = this.game.manager.getComponentDataByEntity(entityId, 'Location');

            const baseLocation = {x: locationState['x'], y: locationState['y']};

            locationState['x'] += locationState['test_x'];
            locationState['y'] += locationState['test_y'];

            if(locationState['x'] !== baseLocation.x || locationState['y'] !== baseLocation.y) {
                this.game.manager.eventHandler.callEvents(['EntityMoves'], {entityId: entityId, baseLocation: baseLocation, newLocation:locationState});
            }
        }

    }


}
