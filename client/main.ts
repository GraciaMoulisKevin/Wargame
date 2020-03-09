import * as io from 'socket.io-client';
import * as d3 from 'd3';
import Game from "../ecs/Game";
import MenuSystem from "./src/MenuSystem";
import Components from './src/Components/';

const socket = io();
const game: Game = new Game();

window.addEventListener('load', function () {

    registerComponents();

    game.manager.createEntity(['Map']);

    console.log(game.manager.getEntitiesByComponents(['Map']));

    game.start(socket);

});

function registerComponents() {
    for(const component of Components) {
        game.manager.registerComponent(component.name, component.state);
    }
}


