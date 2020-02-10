import * as io from 'socket.io-client';
import * as d3 from 'd3';
import Game from "../ecs/Game";
import MenuSystem from "./src/MenuSystem";

const socket = io();
const game: Game = new Game();

window.addEventListener('load', function () {

    registerComponents();

    game.start(socket);

});

function registerComponents() {
    const componentsToAdd: {name, state}[] = [];

    componentsToAdd.push({
        name: 'TransformComponent',
        state: {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            angle: 0
        }
    });

    for(const component of componentsToAdd) {
        game.manager.registerComponent(component.name, component.state);
    }
}


