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
var RoomStore = require('../stores/RoomStore');
var ActionTypes = ChatConstants.ActionTypes;
var CHANGE_EVENT = 'change';

var _messages = {};


function _addMessages(data) {
  console.log(data);
  var rawMessages = data.messages;
  

  rawMessages.forEach(function(message) {
    if(_messages[message.room])
      _messages[message.room].push(message);
    else
      _messages[message.room]=[message];
  });


}

function _addMessage(msg){
  _messages[msg.room].push(msg);
}


var MessageStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },


  getAll: function(room) {
    if(_messages[room])
      return _messages[room];
    else
      return [];
  }

});

MessageStore.dispatchToken = ChatAppDispatcher.register(function(action) {

  switch(action.type) {
    case ActionTypes.RECEIVE_ALL:
      ChatAppDispatcher.waitFor([RoomStore.dispatchToken]);
      _addMessages(action.data);
      MessageStore.emitChange();
      break;
    case ActionTypes.RECEIVE_MESSAGE:
      _addMessage(action.message);
      MessageStore.emitChange();
    default:
      // do nothing
  }

});

module.exports = MessageStore;
