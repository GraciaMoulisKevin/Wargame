import System from "../../../ecs/System";

export default class VelocitySystem extends System {
    protected onDisable() {
    }

    protected onEnable() {
    }

    protected onUpdate() {
        const entities = this.game.manager.getEntitiesByComponents(['Velocity', 'Position']);

        for(const entityId of entities) {
            const positionState = this.game.manager.getComponentDataByEntity(entityId, 'Position');
            const velocityState = this.game.manager.getComponentDataByEntity(entityId, 'Velocity');

            positionState.x += velocityState.x;
            positionState.y += velocityState.y;
            positionState.changed = velocityState.x !== 0 || velocityState.y !== 0;

        }
    }

}
