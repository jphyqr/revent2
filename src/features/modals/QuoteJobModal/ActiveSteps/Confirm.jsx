import React, { Component } from 'react'
import {Button} from 'semantic-ui-react'
class Confirm extends Component {
  render() {
    const {submitted} = this.props
    return (
      <div>
      {submitted ? "Quote Submitted!" : <Button onClick={()=>this.props.handleSubmitQuote()}>Submit Quote!</Button>}
      </div>
    )
  }
}

export default Confirm