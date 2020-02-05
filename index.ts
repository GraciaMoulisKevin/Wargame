import * as express from 'express';
import * as socketIO from 'socket.io';
import Game from "./server/Game";

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

const server = app.listen(3000, () => {
    console.log('Application lancée sur le port 3000');

    Game.manager.registerComponent('Location', {x: 0, y: 0, test_x:1, test_y:1});
    Game.manager.registerComponent('Transform', {width: 0, height: 0, angle: 0});
    Game.manager.createEntity(['Location']);
    Game.manager.createEntity(['Transform']);
    const id = Game.manager.createEntity(['Location', 'Transform']);

    Game.manager.deleteEntity(id);
    Game.manager.createEntity(['Location']);

    console.log(Game.manager.getEntitiesByComponents(['Location']))
});

export const io = socketIO.listen(server);

io.on('connection', function (socket) {

});

Game.start(io);

