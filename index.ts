import * as express from 'express';
import * as socketIO from 'socket.io';
import Component from "./server/Component";
import LocationSystem from "./server/Systems/LocationSystem";
import Game from "./server/Game";

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

const server = app.listen(3000, () => {
   console.log('Application lancée sur le port 3000');

   Game.getManager().addComponentType(new Component('Location', {x: 0, y: 0, test_x:2, test_y:1}));
   Game.getManager().createEntity(['Location']);

   Game.getManager().addSystem(new LocationSystem());

});

export const io = socketIO.listen(server);

io.on('connection', function (socket) {

});

Game.start(io);

