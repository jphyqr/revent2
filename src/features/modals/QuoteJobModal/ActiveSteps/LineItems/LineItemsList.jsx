import React, { Component } from "react";
import { Grid, Accordion, Popup, Label, Form, Statistic , Button} from "semantic-ui-react";
import DateInput from "../../../../../app/common/form/DateInput";
import SelectInput from "../../../../../app/common/form/SelectInput";
import TextInput from "../../../../../app/common/form/TextInput";

import LineItem from './LineItem'




class LineItemsList extends Component {


  state={
    selectedItemIndex:-1,
    total: 0,
    tax: 0,
    subtotal: 0,
  }


componentDidMount()
{
  const {quote, phases} = this.props || {}
  const {lineItems} = quote ||{}
  console.log('COMP DID MOUNT', lineItems)
let subtotal=0;
let total=0;
let calculatedTax = 0;


 if(phases&&phases.length>0){
   this.setState({selectedItemIndex:0})
 }
  lineItems&&Object.keys(lineItems).forEach((e) => {
    console.log(e)
    let item = lineItems[e]
    console.log('subtota', item["subtotal"])
   subtotal = subtotal+Number(item["subtotal"])
   calculatedTax = calculatedTax+Number(item["calculatedTax"])
   total = total + Number(item["total"])
   
});
this.setState({subtotal, calculatedTax, total})

}


  componentWillReceiveProps = nextProps => {

     const {quote} = nextProps || {}
     const {lineItems} = quote ||{}
     console.log('COMP RECEIVE PROPS', lineItems)
   let subtotal=0;
   let total=0;
   let calculatedTax = 0;
     lineItems&&Object.keys(lineItems).forEach((e) => {
       console.log(e)
       let item = lineItems[e]
       console.log('subtota', item["subtotal"])
      subtotal = subtotal+Number(item["subtotal"])
      calculatedTax = calculatedTax+Number(item["calculatedTax"])
      total = total + Number(item["total"])
      
  });
  this.setState({subtotal, calculatedTax, total})

  }


  handleSelectItem = (index) =>{
    console.log('clicked index', index)
    this.setState({selectedItemIndex:index})
  }

  render() {
    const { phases, bidType, handleUpdateLineItem, quote } = this.props || {};
    
    const {selectedItemIndex} = this.state
    return (
      <div>
      <div style={{height: '350px',  overflowY:'auto', overflowX:'hidden'}}>
      
          {phases &&
            phases.map((phase, index) => (

              
              <div style={{marginBottom:"20px", }}>
                <LineItem phasesLength={phases.length} quote={quote} handleUpdateLineItem={handleUpdateLineItem} handleSelectItem={this.handleSelectItem} selectedItemIndex={selectedItemIndex} phase={phase} index ={index} bidType={bidType}/>
              </div>
            ))
            }
      </div>
      <Grid>
            <Grid.Column width={12}>      <Statistic.Group size={'mini'}>
          <Statistic>
            <Statistic.Value>{this.state.subtotal}</Statistic.Value>
            <Statistic.Label>Subtotal</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{this.state.calculatedTax}</Statistic.Value>
            <Statistic.Label>Tax</Statistic.Label>
          </Statistic>
          <Statistic color='green'>
            <Statistic.Value>{this.state.total}</Statistic.Value>
            <Statistic.Label color='green'>Total</Statistic.Label>
          </Statistic>
        </Statistic.Group>
        </Grid.Column>
        <Grid.Column><Button onClick={()=>this.props.handleLineItemNext(this.state.total)} primary>Next</Button></Grid.Column>

      </Grid>



      </div>
    );
  }
}

export default (
  LineItemsList
);
