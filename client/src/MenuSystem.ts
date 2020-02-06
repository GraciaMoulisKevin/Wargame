import System from "../../ecs/System";
import * as d3 from 'd3';

export default class MenuSystem extends System {

    protected onDisable() {
    }

    protected onEnable() {
        const entities = this.game.manager.getEntitiesByComponents(['Menu']);

        for(const entityId of entities) {
            const menuState = this.game.manager.getComponentDataByEntity(entityId, 'Menu');
            if(!menuState.active) return;

            let myData = ["Hello World!"];

            d3.select('body')
                .append('div')
                .attr('class', 'menu')
                .style('position', 'absolute')
                .style('top', `${menuState.y}px`)
                .style('left', `${menuState.x}px`)
                .style('width', `${menuState.width}px`)
                .style('height', `${menuState.height}px`)
                .data(myData)
                .text(function (d) {
                    return d;
                });

            console.log(d3.select('.menu').data());
        }
    }

    protected onUpdate() {

    }

}
