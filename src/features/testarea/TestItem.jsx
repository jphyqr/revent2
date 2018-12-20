import React, { Component } from 'react'

class TestItem extends Component {
  render() {
    return (<li ref={ element => this.listItem = element }>
        {this.props.children}
      </li>);
  }
}


export default TestItem