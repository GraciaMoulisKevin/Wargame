import * as io from 'socket.io-client';
import * as d3 from 'd3';
import Game from "../ecs/Game";
import MenuSystem from "./src/MenuSystem";
import Components from './src/Components/';
import RenderSystem from "./src/Systems/RenderSystem";
import VelocitySystem from "./src/Systems/VelocitySystem";
import GrowthSystem from "./src/Systems/GrowthSystem";
import MapManager from "./src/MapManager";

const socket = io();
const game: Game = new Game();

window.addEventListener('load', function () {

    registerComponents();

    const testEntityId = game.manager.createEntity(['Renderable', 'Position', 'Velocity', 'Shape']);
    game.manager.setComponentDataForEntities([testEntityId], 'Velocity', {x: 0.5, y: 0.2});

    game.manager.registerSystem('RenderSystem', new RenderSystem(game));
    game.manager.enableSystem('RenderSystem');

    game.manager.registerSystem('VelocitySystem', new VelocitySystem(game));
    game.manager.enableSystem('VelocitySystem');

    game.manager.registerSystem('GrowthSystem', new GrowthSystem(game));
    //game.manager.enableSystem('GrowthSystem');

    const mapManager = new MapManager(game);
    $.getJSON('client/src/ressources/maps/level1.json', function (result) {
        mapManager.createMap(result);
    });

    game.manager.getSystemsNames().forEach(name => $('#systemselection').append($(`<option>`, {value: name, text: name})));

    game.start(socket);

    game.manager.eventHandler.registerListener('quandLaPageEstOuverteDepuis2sec', function () {
        console.log('oui');
    });

    game.manager.eventHandler.registerListener('quandLaPageEstOuverteDepuis2sec', function () {
        console.log('caca');
    });

    game.manager.eventHandler.registerListener('CircleTooBig', function (eventData) {
        const shapeState = game.manager.getComponentDataByEntity(eventData.entityId, 'Shape')['radius'] = 5;
    });

    setTimeout(function () {
        game.manager.eventHandler.callEvents(['quandLaPageEstOuverteDepuis2sec']);
    }, 2000);

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


