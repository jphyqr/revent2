import React, { Component } from 'react'
import {Form, Button} from 'semantic-ui-react'
import Checkbox from "../../../../app/common/form/Checkbox";
import {connect} from 'react-redux'



const mapState = (state) => {

return {
  loading : state.async.loading
}
}



 class UserAgreementForm extends Component {
  state = {accepted:false}

  handleChange = (e, { value }) => this.setState({ accepted: !this.state.accepted})

  render() {
    const { value } = this.state
    const {updateTOS, loading} = this.props
    return (
      <Form >

      <Form.Field control={Checkbox}  onClick={this.handleChange} label={
                <label>
                  I accept{" "}
                  <a href="https://stripe.com/ca/connect-account/legal">
                    Revents Service Agreement
                  </a>{" "}
                  and the{" "}
                  <a href="https://stripe.com/ca/connect-account/legal">
                    Stripe Connected Account Agreeement
                  </a>
                </label>
              } />
      <Form.Field  control={Button} loading={loading} onClick={updateTOS}disabled={!this.state.accepted}>Accept Terms</Form.Field>
      
      
          </Form>
    )
  }
}




export default connect(mapState,null)(UserAgreementForm)
