/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */



var ChatServerActionCreators = require('../actions/ChatServerActionCreators');
var io = require('socket.io-client');
// !!! Please Note !!!
// We are using localStorage as an example, but in a real-world scenario, this
// would involve XMLHttpRequest, or perhaps a newer client-server protocol.
// The function signatures below might be similar to what you would build, but
// the contents of the functions are just trying to simulate client-server
// communication and server-side processing.
var userName = document.getElementById("username").getAttribute("name");

var socket = io.connect('http://' + document.domain + ':' + location.port + '/chat');

socket.on('connect',function(){
  console.log('socket connected successfully');
});

socket.on('new_message',function(data){
  
  var msg=data;
  ChatServerActionCreators.receiveCreatedMessage(msg);
});

module.exports = {

  getAllMessages: function() {
    // simulate retrieving data from a database
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        rawData = JSON.parse(xhttp.responseText);
        console.log(rawData);
        ChatServerActionCreators.receiveAll(rawData);    
      }
    };
    xhttp.open("GET",'http://' + document.domain+":"+location.port+"/get_data", true);
    xhttp.send();
    
  },

  createMessage: function(message, threadName) {
    // simulate writing to a database
    var send_msg = {
      user : userName,
      room : threadName,
      timestamp : Date.now(),
      text : message
    };

    console.log(send_msg);
    socket.emit('new_message',send_msg);
  }

};
