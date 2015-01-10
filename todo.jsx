window.React = require('react');
var Dispatcher = require('flux').Dispatcher;
var EventEmitter = require('events').EventEmitter;
var R = require('ramda');

// patching in 'call' as it seemed to be missing
// from 0.8.0 even though it is documented
// http://ramdajs.com/docs/R.html#call
R.call = function call(fn) {
    return fn.apply(this, _slice(arguments, 1));
};

var data = [{
  id: 0,
  text: 'Shopping',
  children: [1,2,3]
}, {
  id: 1,
  parent: 0,
  text: 'Eggs',
}, {
  id: 2,
  parent: 0,
  text: 'Bread',
  children: [4]
}, {
  id: 3,
  parent: 0,
  text: 'Milk'
}, {
  id: 4,
  parent: 2,
  text: 'Flour',
  children: [5]
}, {
  id: 5,
  parent: 4,
  text: 'Grain'
}];

var getData = R.pipe(
  R.pipe(
    R.flip(R.call),
    R.flip(R.map)([
      R.pipe(
        R.propEq('id'),
        R.flip(R.find)(data),
        R.prop('children'),
        R.map(
          R.pipe(
            R.propEq('id'),
            R.flip(R.find)(data)
          )
        )
      ),
      R.pipe(
        R.propEq('id'),
        R.flip(R.find)(data)
      )
    ])
  ),
  R.apply(R.assoc('children'))
);

var TodoApp = React.createClass({
  getInitialState: function () {
    return getData(0);
  },
  render: function () {
    return (
      <div id="TodoApp">
        <h1>{this.state.text || 'Todo'}</h1>
        <button onClick={this.clickBack}>Back</button>
        <TodoList node={this.state} onClick={this.todoClick} />
      </div>
    );
  },
  todoClick: function (todoId) {
    this.setState(getData(todoId));
  },
  clickBack: function (e) {
    e.preventDefault();
    this.setState(getData(this.state.parent));
  }
});

var TodoList = React.createClass({
  render: function () {
    var children = (this.props.node.children || []).map(function (todo) {
      return (
        <Todo 
          key={todo.id}
          todo={todo}
          onClick={this.props.onClick}
        />
      );
    }, this);
    return (
      <div className="children">
        <ul>
          {children}
        </ul>
      </div>
    );
  }
});

var Todo = React.createClass({
  render: function () {
    return (
      <li onClick={this.handleClick}>
        {this.props.todo.text}
      </li>
    );
  },
  handleClick: function (e) {
    e.preventDefault();
    this.props.onClick(this.props.todo.id);
  }
});

React.render(
  <TodoApp />,
  document.getElementById('app')
);