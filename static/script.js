var socket = io();
var nameForm = document.getElementById('name-form');
var messageInput = document.getElementById('message-input');
var sendButton = document.getElementById('send-button');

function addMessage(name, msg) {
    var chatbox = document.getElementById('chatbox');
    var messageElement = document.createElement('p');
    messageElement.textContent = name + ': ' + msg;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight; 
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});





document.getElementById('set-name-button').addEventListener('click', setName);
document.getElementById('name-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        setName();
    }
});
var clientNAme = "";

function setName() {
    var name = document.getElementById('name-input').value;
    if (name.trim() !== "") {
        socket.emit('set_name', name);
        clientNAme = name;
        document.getElementById('name-form').style.display = 'none';
        document.getElementById('sendbox').style.display = 'block';
    }
}

function sendMessage() {
    var messageInput = document.getElementById('message-input');
    var message = messageInput.value;
    if (message.trim() !== "") {
        socket.emit('message', message);
        messageInput.value = '';
    }
}

socket.on('message', (data) => {
    const messagesDiv = document.getElementById('messages');
    const newMessage = document.createElement('div');
    newMessage.classList.add('message');
    if (data.name === 'System') {
        newMessage.classList.add('system');
    } else if (data.name === clientNAme) {
        newMessage.classList.add('clientmsg');
    } else {
        newMessage.classList.add('user');

    }

    var sentence =`  ${data.msg} `;
    var smallerText = `<span style='font-size: 0.5em; line-height: 0px;'>  ${data.name} : </span>`;



    newMessage.innerHTML = smallerText+ sentence;
    messagesDiv.appendChild(newMessage);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
});




socket.on('connect', function() {
    console.log('Connected to server');
});