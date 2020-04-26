var socket = io();
socket.on('connect',function(data){
    socket.emit('wantFiles');
})
socket.on('files', function(data) {
    document.getElementById('roomIndex').innerHTML = null;
    data.forEach(element => {
        let color = "green";
        if(element.isReady){
            color = "red";
        }
        document.getElementById('roomIndex').innerHTML += "<a class='list-group-item list-group-item-action' href='/room/" + element.roomName.slice(0,-5) + "' style='background-color:"+color+";'>" + element.roomName.slice(0,-5) + "<div style='float:right'>" + element.usersInside + "</div></a>";
    });
})