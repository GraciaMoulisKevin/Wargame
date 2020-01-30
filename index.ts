import * as express from 'express';
import * as socketIO from 'socket.io';
import * as http from 'http';
import Manager from "./server/Manager";
import Component from "./server/Component";

const app = express();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

const server = app.listen(3000, () => {
   console.log('Application lancée sur le port 3000');

   const manager = new Manager();

   manager.addComponentType(new Component('Location', {x: 0, y: 0}));
   manager.createEntity(['Location']);
});

const io = socketIO.listen(server);

io.on('connection', function (socket) {

});

