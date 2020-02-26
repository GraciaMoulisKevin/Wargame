const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 3000
const bodyParser = require('body-parser')
const fs = require('fs') // filesystem
const template = __dirname + '/template.html'; // Template shortcut
const history = {};
const playerList = {};
const roomData = {};
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
        history[roomName] = [];
        playerList[roomName] = [];        
        roomData[roomName] = {ready: 0, max:2};
        
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
        socket.emit('messageHistory',history[roomName]);
    })
    
    socket.on('sendChatMessage', function(message,room){
        let pseudo = getUserPseudo(playerList[room],socket.id);
        history[room].push({message : message, pseudo : pseudo});
        let historyLength = history[room].length;
        let maxHistoryNumber = 20;
        if(historyLength > maxHistoryNumber){
            history[room].splice(0, historyLength - maxHistoryNumber)
        }
        if(message.length > 100){
            message = message.slice(0,100);
        }
        io.sockets.to(room).emit('chatMessage',message,pseudo);
    })
    
    socket.on('registerUser', function(pseudo, room){
        if(hasLeader(playerList[room])){
            playerList[room].push({id: socket.id,pseudo: pseudo, leader: false, ready: false});
        } else {
            playerList[room].push({id: socket.id,pseudo: pseudo, leader: true, ready: false});
        }
        sendUserList(room);
    })
    socket.on('disconnect', function(reason){
        let disconnectedRoom = socket.request.headers.referer.split("/").pop();
        if(disconnectedRoom != ""){
            if(playerList[disconnectedRoom] == null){
                return;
            }
            let playerNumber = getPlayerNumber(playerList[disconnectedRoom],socket.id)
            if(playerNumber == undefined) return;
            playerList[disconnectedRoom].splice(playerNumber, 1);
            if(!hasLeader(playerList[disconnectedRoom]) && playerList[disconnectedRoom][0] != undefined){
                playerList[disconnectedRoom][0].leader = true;
            }
            sendUserList(disconnectedRoom);
        }
    })
    socket.on('readyUp', function (ready, room){
        if(roomData[room].ready == roomData[room].max){
            console.log("game already launched");
            io.sockets.to(room).emit('breakReady');
            return;
        }
        if(ready && roomData[room].ready == roomData[room].max - 1){
            playerList[room][getPlayerNumber(playerList[room],socket.id)].ready = ready;
            sendUserList(room);
            roomData[room].ready++;
            io.sockets.to(room).emit('breakReady');
            io.sockets.to(room).emit('systemMessage', "Game Start!");
            console.log("launch game");
        } else {
            if(ready){
                roomData[room].ready++;
                playerList[room][getPlayerNumber(playerList[room],socket.id)].ready = true;
            } else {
                roomData[room].ready--;
                playerList[room][getPlayerNumber(playerList[room],socket.id)].ready = false;
            }
        }
        sendUserList(room);
        console.log(roomData[room]);
    })
})



/**
* Listening node.js
*/
server.listen(port, () => {
    let files = fs.readdirSync(__dirname + '/room/').map(room => room.slice(0,-5));
    for(let room of files){
        playerList[room] = [];
        history[room] = [];
        roomData[room] = {ready: 0, max:2};
    }
    console.log(`Running on ${port}! with rooms : ${files}`)
})

function hasLeader(roomArray){
    let flag = false;
    if(roomArray == null){
        return flag;
    }
    for(objUser of roomArray){
        if(objUser.leader){
            flag = true;
        }
    }
    return flag;
}

function getUserPseudo(array,id){
    for(obj of array){
        if(obj.id == id){
            return obj.pseudo
        }
    }
    return undefined;
}

function getPlayerNumber(array,id){
    for(let i = 0; i < array.length; i++){
        if(array[i].id == id){
            return i;
        }
    }
}
function sendUserList(room){
    io.sockets.to(room).emit('playerList', playerList[room].map(player => {
        return {
            pseudo: player.pseudo,
            leader: player.leader,
            ready: player.ready
        }
    }))
}