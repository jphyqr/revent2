import React, { Component } from 'react'
import { Elements, StripeProvider , Button} from "react-stripe-elements";
import ConnectBankAccountModal from '../modals/ConnectBankAccountModal/ConnectBankAccountModal'
import { connect } from 'react-redux';
import { openModal } from '../modals/modalActions'





const actions = {
    openModal
}

 class TestBankConnect extends Component {



     
  render() {

    const {openModal} = this.props

    const isANewAccount = true; //get from redux later? or from stripe

if(isANewAccount){
    openModal('ConnectBankAccountModal', {data: 'CAN'})
}

    return (
        <StripeProvider apiKey="pk_test_Y9DV2lcx7cuPwunYtda4wGyu">
        <div className="example">
          <h1>Connect your account</h1>
          <Elements>
            <div>
            


            <h1>Proper form for Country</h1>
            />
            </div>
          </Elements>
 
          {/* <Button  primary onClick={this.submit}>
            Submit
          </Button> */}
        </div>
      </StripeProvider>
    )
  }
}


export default connect(null, actions)(TestBankConnect)