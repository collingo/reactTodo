window.React = require('react');
var Dispatcher = require('flux').Dispatcher;
var EventEmitter = require('events').EventEmitter;
var _ = require('lodash');

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

var getData = function (nodeId) {
  return (function (x) {
    x.children = x.children.map(function (todoId) {
      return data[todoId];
    });
    return x;
  })(_.clone(_.find(data, function (node) {
      return node.id === nodeId;
  })));
};

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
    console.log(this.props);
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
    console.log('clicked', this.props.todo.id);
    this.props.onClick(this.props.todo.id);
  }
});

React.render(
  <TodoApp />,
  document.getElementById('app')
);