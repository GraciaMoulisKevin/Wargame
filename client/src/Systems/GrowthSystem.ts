import System from "../../../ecs/System";


export default class GrowthSystem extends System {
    protected onDisable() {
    }

    protected onEnable() {
    }

    protected onUpdate() {
        const entities = this.game.manager.getEntitiesByComponents(['Shape']);

        for(const entityId of entities) {
            const shapeState = this.game.manager.getComponentDataByEntity(entityId, 'Shape');

            if(shapeState.type === 'circle') {
                shapeState.radius += 0.2;
                if(shapeState.radius >= 20) {
                    this.game.manager.eventHandler.callEvents(['CircleTooBig'], {
                        entityId: entityId
                    });
                }
            }
        }
    }
    
}
