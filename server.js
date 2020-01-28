const app = require('express')();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = 3000
const bodyParser = require('body-parser')
const fs = require('fs') // filesystem
const template = __dirname + '/template.html'; //Raccourci vers le template

if(!fs.existsSync('/room')){
    fs.mkdirSync('/room')
}

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/room/*', (req,res) => {
    res.sendFile(__dirname + '/room/' + req.originalUrl.slice(6) + '.html', (err) => {
        if(err){
            res.redirect('/');
        }
    });
})

app.post('/', (req,res) => {
    let roomname = req.body.roomname.replace(/[^a-zA-Z0-9]/g, '');
    let roompath = __dirname + '/room/' + roomname + '.html';
    if(fs.existsSync(roompath)){
        res.redirect('/room/' + roomname);
    } else {
        fs.copyFile(template, roompath , (err) => {
            if(err) throw err;
            const files = fs.readdirSync(__dirname + '/room/');
            io.sockets.emit('files',files);
            res.redirect('/room/' + roomname);
        })
    }
})

io.on('connection', function(socket){
    const files = fs.readdirSync(__dirname + '/room/');
    socket.emit('files',files);
})

server.listen(port, () => {
    console.log(`Running on ${port}!`)
})