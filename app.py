from flask import Flask, render_template,url_for, send_from_directory,request 
from flask_socketio import SocketIO, emit
import flask
from flask.ext.wtf import Form
from wtforms.fields import StringField, SubmitField
from wtforms.validators import Required



class LoginForm(Form):
    """Accepts a nickname and a room."""
    name = StringField('Name', validators=[Required()])
    room = StringField('Room', validators=[Required()])
    submit = SubmitField('Enter Chatroom')



app = Flask(__name__,static_url_path="/home/prudhvi/workspace/Test/react/chat-app")
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


users = {}
rooms = ['hello','world']
messages = []
messages.append({"text":"Heyyy",
    "name":"prudhvi",
    "timestamp":"123",
    "room":'hello'}
    )


@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('/home/prudhvi/workspace/Test/react/chat-app/js', 'bundle.js')

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('/home/prudhvi/workspace/Test/react/chat-app/css', path)


@app.route('/',methods=['GET', 'POST'])
def index():
    form = LoginForm()
    if form.validate_on_submit():
        name = form.name.data
        room = form.room.data
        if not name in users:
            users[name] = {}
        if room != '' and not room in rooms:
            rooms.append(room)
            for key,value in users.items():
                users[key][room] = 0
            socketio.emit('new_room', room)
        
        return render_template('chat.html',name=name,room=room)
             
    elif request.method == 'GET':
        return render_template('index.html', form=form)

@app.route('/new_user/<string:name>')
def new_user(name):
    if not name in users  and name != '':
        users[name] = {}
        return render_template('chat.html',name=name)
    else:
        return render_template('index.html')



@app.route('/new_room/<string:name>')
def new_room(name):
    rv={}
    if name != '' and not name in rooms:
        rooms.append(name)
        for key,value in users.items():
            users[key][name] = 0
        socketio.emit('new_room', name)
        rv['result'] = True
    else:
        rv['result'] = False
    
    return flask.jsonify(**rv)


@app.route('/get_data')
def getdata():
    rv = {}
    rv['users'] = users
    rv['rooms'] = rooms
    rv['messages'] = messages

    return flask.jsonify(**rv)

# @socketio.on('message',namespace='/chat')
# def ms(msg):
#     print 'msg', msg

@socketio.on('new_message',namespace='/chat')
def msgrecvd(message):
    print "Received message ", message
    print type(message)
    messages.append(message)
    emit('new_message',message,broadcast=True)
    
    for key,value in users.items():
        if message['room'] in users[key]:
            users[key][message['room']] += 1
        else:
            users[key][message['room']] = 0
        




@socketio.on('my event')
def test_message(message):
    emit('my response', {'data': 'got it!'})




if __name__ == '__main__':
    socketio.run(app, debug=True)