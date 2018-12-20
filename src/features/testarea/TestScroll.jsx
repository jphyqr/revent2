import React, { Component } from "react";
import TestItem from "./TestItem";
import ReactDOM from "react-dom";
const ITEMS = [
  { key: 1, item: "one", active: true },
  { key: 2, item: "two", active: false },
  { key: 3, item: "tree", active: false },
  { key: 4, item: "four", active: false },
  { key: 5, item: "five", active: false },
  { key: 6, item: "six", active: false },
  { key: 7, item: "seven", active: false },
  { key: 8, item: "eight", active: false }
];
let _nodes = new Map();

class TestScroll extends Component {
  state = { items: [], index: 0 };

  handleRemove = () => {
    this.setState({ items: this.state.items.slice(1) });
  };

  handleAdd = () => {
    let startNumber = 0;
    if (this.state.items.length) {
      startNumber = this.state.items[this.state.items.length - 1];
    }

    let newItems = this.state.items.splice(0);
    for (let i = startNumber; i < startNumber + 100; i++) {
      newItems.push(i);
    }

    this.setState({ items: newItems });
  };

  handleShow = i => {
    this.setState({ index: i });
    const node = _nodes.get(i);
    console.log(_nodes);
    if (node) {
      ReactDOM.findDOMNode(node).scrollIntoView({
        block: "end",
        behavior: "smooth"
      });
    }
  };

  render() {
    return (
      <div id="list" 
      style={{overflow:"auto", height:"128px"}}
      >
        <ul>
          {this.state.items.map((item, i) => (
            <TestItem key={i} ref={element => this._nodes.set(i, element)}>
              {item}
            </TestItem>
          ))}
        </ul>
        <button onClick={this.handleShow.bind(this, 0)}>0</button>
        <button onClick={this.handleShow.bind(this, 50)}>50</button>
        <button onClick={this.handleShow.bind(this, 99)}>99</button>
        <button onClick={this.handleAdd}>Add</button>
        <button onClick={this.handleRemove}>Remove</button>
        {this.state.index}
      </div>
    );
  }
}

export default TestScroll;
