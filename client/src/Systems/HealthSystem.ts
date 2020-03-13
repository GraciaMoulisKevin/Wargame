import System from "../../../ecs/System";


export default class HealthSystem extends System {
    protected onDisable() {
    }

    protected onEnable() {
    }

    protected onUpdate() {
        const entities = this.game.manager.getEntitiesByComponents(['Health']);

        for(const entityId of entities) {
            const healthState = this.game.manager.getComponentDataByEntity(entityId, 'Health');

            if(healthState.hp === 0) {
                this.game.manager.eventHandler.callEvents(['HealthEqualZero'], { entityId: entityId });
            }
        }
    }
}
