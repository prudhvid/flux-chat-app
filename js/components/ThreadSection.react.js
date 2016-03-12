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

var React = require('react');
var ThreadListItem = require('../components/ThreadListItem.react');
var RoomStore = require('../stores/RoomStore');

function getStateFromStores() {
  console.log('rooms chnaged');
  console.log(RoomStore.getAll());
  return {
    rooms: RoomStore.getAll(),
    currentRoom: RoomStore.getCurrentRoom()
  };
}

var ThreadSection = React.createClass({

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    RoomStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    RoomStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var threadListItems = this.state.rooms.map(function(room) {
      return (
        <ThreadListItem
          key={room}
          thread={room}
          currenRoom={room}
        />
      );
    }, this);
   
    return (
      <div className="thread-section">
        <ul className="thread-list">
          {threadListItems}
          </ul>
      </div>
    );
  },

  /**
   * Event handler for 'change' events coming from the stores
   */
  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = ThreadSection;
