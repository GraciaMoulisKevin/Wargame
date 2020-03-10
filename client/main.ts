import * as io from 'socket.io-client';
import * as d3 from 'd3';
import Game from "../ecs/Game";
import MenuSystem from "./src/MenuSystem";
import Components from './src/Components/';
import RenderSystem from "./src/Systems/RenderSystem";
import VelocitySystem from "./src/Systems/VelocitySystem";

const socket = io();
const game: Game = new Game();

window.addEventListener('load', function () {

    registerComponents();

    const testEntityId = game.manager.createEntity(['Renderable', 'Position', 'Velocity']);
    game.manager.setComponentDataForEntities([testEntityId], 'Velocity', {x: 0.5, y: 0.2});

    game.manager.registerSystem('RenderSystem', new RenderSystem(game));
    game.manager.enableSystem('RenderSystem');

    game.manager.registerSystem('VelocitySystem', new VelocitySystem(game));
    game.manager.enableSystem('VelocitySystem');

    game.manager.getSystemsNames().forEach(name => $('systemselection').append(`<option>${name}</option>`))

    game.start(socket);

});

function registerComponents() {
    for(const component of Components) {
        game.manager.registerComponent(component.name, component.state);
    }
}

document.getElementById('stopbutton').onclick = function () {
    if(game.manager.isSystemEnabled($('#systemselection').find(":selected").text()))
        game.manager.pauseSystem($('#systemselection').find(":selected").text());
    else
        game.manager.resumeSystem($('#systemselection').find(":selected").text());
}


