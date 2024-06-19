# app.py (Python code - same as before)
from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, join_room

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

clients = {} 

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    if 'name' in session:
        join_room('chatroom') 

@socketio.on('set_name')
def handle_set_name(name):
    session['name'] = name
    clients[request.sid] = name
    join_room('chatroom')
    emit('message', {'name': 'System', 'msg': f'{name} has joined the chat'}, room='chatroom')

@socketio.on('message')
def handle_message(msg):
    name = session.get('name', 'Unknown')
    emit('message', {'name': name, 'msg': msg}, room='chatroom')

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=80, debug=True)