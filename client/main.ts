import * as io from 'socket.io-client';
import * as d3 from 'd3';
import Game from "../ecs/Game";
import MenuSystem from "./src/MenuSystem";

const socket = io();

window.addEventListener('load', function () {

    const game: Game = new Game();

    game.manager.registerComponent('Menu', {x: 0, y: 0, width: 0, height: 0, active: false});
    const menuPrincipal = game.manager.createEntity(['Menu']);
    const menuPrincipalState = {
        x: window.innerWidth-200/2,
        y: window.innerHeight-500/2,
        width: 200,
        height: 500,
        active: true
    };

    game.manager.setComponentDataForEntities([menuPrincipal], 'Menu', menuPrincipalState);

    game.manager.registerSystem('MenuSystem', new MenuSystem(game));
    game.manager.enableSystem('MenuSystem');

    game.start(socket);

});
