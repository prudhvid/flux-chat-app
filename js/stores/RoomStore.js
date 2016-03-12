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


var ChatAppDispatcher = require('../dispatcher/ChatAppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ActionTypes = ChatConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _currentRoom = document.getElementById("currentroom").getAttribute("name");
console.log(_currentRoom);
var _rooms = [];

function _addRooms(data) {
  var rooms = data.rooms;
  rooms.forEach(function(message) {
    _rooms.push(message);
  });
  console.log('rooms1');
  console.log(rooms);
}



var RoomStore = assign({}, EventEmitter.prototype, {

  
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  

  getAll: function() {
    return _rooms;
  },


  getCurrentRoom: function() {
    return _currentRoom;
  }

});

RoomStore.dispatchToken = ChatAppDispatcher.register(function(action) {

  switch(action.type) {

    case ActionTypes.CLICK_THREAD:
      _currentRoom = action.room;
      _rooms[_rooms.length] = _currentRoom;
      RoomStore.emitChange();
      break;

    case ActionTypes.RECEIVE_MESSAGE:
      if (_rooms[action.message.room])
        _rooms[action.message.room] += 1;
      else
        _rooms[action.message.room] = 1;

      RoomStore.emitChange();
      break;
    case ActionTypes.RECEIVE_ALL:
      _addRooms(action.data);
      RoomStore.emitChange();
      break;

    default:
      // do nothing
  }

});

module.exports = RoomStore;
