const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 3000
const bodyParser = require('body-parser')
const fs = require('fs') // filesystem
const template = __dirname + '/template.html'; // Template shortcut

/**
 * Create room folder (server)
 */
if(!fs.existsSync(__dirname +'/room')){
    fs.mkdirSync(__dirname + '/room')
}

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

/**
 * Send index.html to people that join on website root
 */
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})

/**
 * Room manager for direct linking:
 *  -> If a room exists send the .html file to the user inside /room/
 *  -> If a room doesn't exists send the user to the website root
 */
app.get('/room/*', (req,res) => {
    res.sendFile(__dirname + '/room/' + req.originalUrl.slice(6) + '.html', (err) => {
        if(err){
            res.redirect('/');
        }
    });
})

/**
 * Post request of root that creates / join a room by duplicating template.html
 */
app.post('/', (req,res) => {
    let roomName = req.body.roomName.replace(/[^a-zA-Z0-9]/g, '');
    let roomPath = __dirname + '/room/' + roomName + '.html';
    if(fs.existsSync(roomPath)){
        res.redirect('/room/' + roomName);
    } else {
        fs.copyFile(template, roomPath , (err) => {
            if(err) throw err;
            const files = fs.readdirSync(__dirname + '/room/');
            io.sockets.emit('files',files);
            res.redirect('/room/' + roomName);
        })
    }
})

/**
 * Socket.io basic connection :
 *  -> on root sends files
 *  -> in rooms, users join socket.io room of the room
 */
io.on('connection', function(socket){
    socket.on('wantFiles', function(){
        const files = fs.readdirSync(__dirname + '/room/');
        socket.emit('files',files);
    })
    socket.on('room', function(roomName){
        socket.join(roomName);
        
    })
    socket.on('sendChatMessage', function(message,pseudo,room){
        io.sockets.to(room).emit('chatMessage',pseudo + " :  " + message);
    })
})



/**
 * Listening node.js
 */
server.listen(port, () => {
    console.log(`Running on ${port}!`)
})