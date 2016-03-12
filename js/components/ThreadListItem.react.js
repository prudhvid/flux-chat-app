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

var ChatThreadActionCreators = require('../actions/ChatThreadActionCreators');
var React = require('react');
var classNames = require('classnames');
var RoomStore = require('../stores/RoomStore')

var ReactPropTypes = React.PropTypes;

var ThreadListItem = React.createClass({

  propTypes: {
    thread: ReactPropTypes.string
  },

  render: function() {
    var thread = RoomStore.getCurrentRoom();
    return (
      <li
        className={classNames({
          'thread-list-item': true,
          'active': thread === this.props.thread
        })}
        onClick={this._onClick}>
        <h5 className="thread-name">{this.props.thread}</h5>
      </li>
    );
  },

  _onClick: function() {
    ChatThreadActionCreators.clickThread(this.props.thread);
  }

});

module.exports = ThreadListItem;
