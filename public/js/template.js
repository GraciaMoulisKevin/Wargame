window.onload = function(){
    $('#modalWindowPseudo').modal('show');
};

let socket = io();
let roomName = window.location.pathname.slice(6);
let pseudo = "guest";
const messageForm = document.getElementById("sendContainer");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.getElementById("messageContainer");
const modalForm = document.getElementById("modalForm");
const playerListContainer = document.getElementById("playerListContainer")

socket.on('connect', function(data){
    socket.emit('room',roomName);
})
socket.on('systemMessage', function(data){
    appendMessage(data,"System");
})
socket.on('chatMessage', function(message,pseudo){
    appendMessage(message,pseudo);
})
socket.on('messageHistory',function(data){
    if(data == null){
        return;
    }
    for(const objMessage of data){
        appendMessage(objMessage.message,objMessage.pseudo);
    }
})
socket.on('playerList',function(data){
    playerListContainer.innerText = "";
    for(const objUser of data){
        if(objUser.leader){
            appendUser("♛" + objUser.pseudo, objUser.ready)
        } else {
            appendUser(objUser.pseudo, objUser.ready);
        }
        if(objUser.pseudo == pseudo){
            let button = $('#readyButton');
            if(objUser.ready){
                button.removeClass("btn-danger").addClass("btn-success");
            } else {
                button.removeClass("btn-success").addClass("btn-danger");
            }
        }
    }
})
socket.on('breakReady',function(){
    $('#readyButton').remove();
})
socket.on('invalidPseudo', function(bool){
    modalPseudoInvalid(bool);
})


messageForm.addEventListener('submit', function(e){
    e.preventDefault();
    const message = messageInput.value;
    socket.emit('sendChatMessage', message, roomName );
    messageInput.value = ''
})

modalForm.addEventListener('submit',function(e){
    e.preventDefault();
});

function closeModal(){
    pseudo = $('#modalPseudo').val();
    socket.emit('registerUser', pseudo, roomName);
}
function modalPseudoInvalid(bool){
    if(bool){
        $('#usernameTaken').css("display","block");
        return
    } else {
        $('#modalWindowPseudo').modal('hide');
    }
}

function appendMessage(message,pseudo){
    const messageElement = document.createElement('div');
    messageElement.innerHTML = "<b>" + pseudo + "</b> : " + message ;
    messageContainer.append(messageElement);
    messageContainer.scrollTo(0,messageContainer.scrollHeight);
}
function appendUser(pseudo,ready){
    let color = ""
    if(ready){
        color = "green"
    } else {
        color = "red"
    }
    const userElement = document.createElement('div');
    userElement.innerText = pseudo;
    userElement.style = "color:" + color;
    playerListContainer.append(userElement);
}
function readyUp(){
    let button = $('#readyButton');
    let rdy;
    if(button.hasClass("btn-danger")){
        rdy = true;
    } else {
        rdy = false;
    }
    socket.emit('readyUp',rdy, roomName);
}