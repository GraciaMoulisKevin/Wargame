import * as express from 'express';
import * as socketIO from 'socket.io';
import Game from "./ecs/Game";
import LocationSystem from "./server/Systems/LocationSystem";
import TestListeners from "./server/Listeners/TestListeners";

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

const server = app.listen(3000, () => {
    console.log('Application lancée sur le port 3000');

    const game: Game = new Game();

    game.manager.registerComponent('Location', {x: 0, y: 0, test_x:1, test_y:1});
    game.manager.registerComponent('Transform', {width: 0, height: 0, angle: 0});
    game.manager.createEntity(['Location']);
    game.manager.createEntity(['Transform']);
    const id = game.manager.createEntity(['Location', 'Transform']);

    //game.manager.deleteEntity(id);
    game.manager.createEntity(['Location']);

    console.log(game.manager.getComponentDataByEntity(1, 'Transform'));

    game.manager.registerSystem('LocationSystem', new LocationSystem(game));
    game.manager.enableSystem('LocationSystem');

    new TestListeners().register(game);

    game.start(io);
});

export const io = socketIO.listen(server);

io.on('connection', function (socket) {

});



