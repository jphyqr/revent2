import React, { Component } from "react";
import { Grid, Header, Button } from "semantic-ui-react";
import { objectToArray } from "../../../../../../app/common/util/helpers";

class PaymentsTab extends Component {
  render() {
    const { lineItems } = this.props;
    const lineItemsArray = objectToArray(lineItems) || [];
    console.log({ lineItemsArray });

    let payments = [];

    for (var i = 0; i < (lineItemsArray && lineItemsArray.length); i++) {
      const item = lineItemsArray[i];
      const id = item.id;

      let deposit = Number(item[`${id}_deposit`]);
      let due = Number(item[`${id}_due`]);
      let taxType = item[`${id}_tax`];

      //  let subTotal = due+deposit
      let taxRate;

      switch (taxType) {
        case "gst5pst5":
          taxRate = 0.1;
          break;
        case "gst5":
          taxRate = 0.05;
          break;
        case "pst5":
          taxRate = 0.05;
          break;
        case "noTax":
          taxRate = 0.0;
          break;
        default:
          taxRate = 0.0;
      }

      if (deposit > 0) {
        let depositTax = deposit * taxRate;
        let depositPayment = depositTax + deposit;
        payments.push({ id: id, type: "deposit", amount: depositPayment });
      }

      if (due > 0) {
        let dueTax = due * taxRate;
        let duePayment = dueTax + deposit;
        payments.push({ id: id, type: "due", amount: duePayment });
      }
    }
    console.log({ payments });

    return (
      <div style={{ width: "100%" }}>
        <div
          style={{
            width: "600px",
            height: "400px",
            marginLeft: "auto",
            marginTop: "30px",
            marginRight: "auto",
            display: "block",
            backgroundColor: "lightgrey"
          }}
        >
          <Grid>
            <Grid.Column width={10}>
            <div style={{maxHeight: 350, minHeight:350}}>
            <Header as="h3">Payment Items</Header>
              <div
                style={{
                  width: "100%",
                  overflowX: "hidden",
                  overflowY: "auto",
                  minHeight: "300px",
                  maxHeight: "300px",
                 // backgroundColor: "white"
                }}
              >
              
                {payments &&
                  payments.map(payment => (
                    <div
                      style={{
                        fontSize: "14px",
                        height: "30px",
                        margin: "5px",
                        padding:"5px",
                        width: "100%",
                        backgroundColor:"white"
                      }}
                    >
                   
                      <Grid>
                        <Grid.Column
                          style={{
                            textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden"
                          }}
                          width={5}
                        >
                          {payment.id}
                        </Grid.Column>
                        <Grid.Column width={3}>{payment.type}</Grid.Column>
                        <Grid.Column width={4}>{`$${payment.amount}`}</Grid.Column>
                        <Grid.Column width={4} >not funded</Grid.Column>
                      </Grid>
                    </div>
                  ))}
              </div>
              <Button positive style={{width:"100%"}}>FUND NEXT PAYMENT OF $1100</Button>
              </div>
            </Grid.Column>
            <Grid.Column width={6} />
          </Grid>
        </div>
      </div>
    );
  }
}

export default PaymentsTab;
