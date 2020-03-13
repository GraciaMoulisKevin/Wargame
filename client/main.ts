import * as io from 'socket.io-client';
import * as d3 from 'd3';
import Game from "../ecs/Game";
import MenuSystem from "./src/MenuSystem";
import Components from './src/Components/';
import RenderSystem from "./src/Systems/RenderSystem";
import VelocitySystem from "./src/Systems/VelocitySystem";
import GrowthSystem from "./src/Systems/GrowthSystem";
import MapManager from "./src/MapManager";
import TextureManager from "./src/TextureManager";
import HealthSystem from "./src/Systems/HealthSystem";

const socket = io();
const game: Game = new Game();

window.addEventListener('load', function () {

    registerComponents();

    const testEntityId = game.manager.createEntity(['Renderable', 'Position', 'Velocity', 'Shape','Health']);
    game.manager.setComponentDataForEntities([testEntityId], 'Velocity', {x: 0.5, y: 0.2});
    game.manager.setComponentDataForEntities([testEntityId], 'Health', {hp: 3});

    game.manager.registerSystem('RenderSystem', new RenderSystem(game));
    game.manager.enableSystem('RenderSystem');

    game.manager.registerSystem('VelocitySystem', new VelocitySystem(game));
    game.manager.enableSystem('VelocitySystem');

    game.manager.registerSystem('GrowthSystem', new GrowthSystem(game));
    //game.manager.enableSystem('GrowthSystem');

    game.manager.registerSystem('HealthSystem', new HealthSystem(game));
    game.manager.enableSystem('HealthSystem');

    const mapManager = new MapManager(game);
    $.getJSON('client/src/ressources/maps/level1.json', function (result) {
        mapManager.createMap(result);
    });

    game.manager.getSystemsNames().forEach(name => $('#systemselection').append($(`<option>`, {value: name, text: name})));

    game.start(socket);

    game.manager.eventHandler.registerListener('tic dmg', function () {
        console.log('1 dmg');
        game.manager.setComponentDataForEntities([testEntityId], 'Health')['hp'] -= 1;
    });

    game.manager.eventHandler.registerListener('CircleTooBig', function (eventData) {
        const shapeState = game.manager.getComponentDataByEntity(eventData.entityId, 'Shape')['radius'] = 5;
    });

    game.manager.eventHandler.registerListener('HealthEqualZero', function (eventData) {
        console.log('mort');
        game.manager.getComponentDataByEntity(eventData.entityId, 'Shape')['radius'] = 0;
    });

    setTimeout(function () {
        game.manager.eventHandler.callEvents(['tic dmg']);
    }, 5000);

    TextureManager.addTexture('MAP_TILE_available', '/client/src/ressources/textures/map-tiles/available.png');
    TextureManager.addTexture('MAP_TILE_forest', '/client/src/ressources/textures/map-tiles/forest.png');
    TextureManager.addTexture('MAP_TILE_grass', '/client/src/ressources/textures/map-tiles/grass.png');
    TextureManager.addTexture('MAP_TILE_mountain', '/client/src/ressources/textures/map-tiles/mountain.png');
    TextureManager.addTexture('MAP_TILE_sand', '/client/src/ressources/textures/map-tiles/sand.png');
    TextureManager.addTexture('MAP_TILE_snow', '/client/src/ressources/textures/map-tiles/snow.png');
    TextureManager.addTexture('MAP_TILE_unavailable', '/client/src/ressources/textures/map-tiles/unavailable.png');
    TextureManager.addTexture('MAP_TILE_urban', '/client/src/ressources/textures/map-tiles/urban.png');
    TextureManager.addTexture('MAP_TILE_volcano', '/client/src/ressources/textures/map-tiles/volcano.png');
    TextureManager.addTexture('MAP_TILE_water', '/client/src/ressources/textures/map-tiles/water.png');

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


