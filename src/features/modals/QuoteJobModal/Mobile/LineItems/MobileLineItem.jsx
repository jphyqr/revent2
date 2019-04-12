import React, { Component } from "react";
import { reduxForm, Field } from "redux-form";
import { Grid, Accordion, Popup, Statistic, Label, Form, Button } from "semantic-ui-react";
import DateInput from "../../../../../app/common/form/DateInput";
import {compose} from 'redux'
import { connect } from "react-redux";
import SelectInput from "../../../../../app/common/form/SelectInput";
import TextInput from "../../../../../app/common/form/TextInput";
const taxes = [
  { key: "gst5pst5", text: "GST 5% PST 5%", value: "gst5pst5" },

  { key: "gst5", text: "GST 5%", value: "gst5" },
  { key: "pst5", text: "PST 5%", value: "pst5" },
  { key: "noTax", text: "No Tax", value: "noTax" }
];

const mapState = (state, ownProps) => {
  
   const {phase} = ownProps || {}
   const {phaseName} = phase
  return {
    initialValues: state.quote&&state.quote.lineItems&&state.quote.lineItems[phaseName] ||{},
    form: ownProps.phase.phaseName 

  };
};
class MobileLineItem extends Component {
  state = {
    deposit: 0,
    calculatedTax: 0,
    due: 0,
    phaseName: "",
    subTotal:0,
    total:0,
    buttonLoading: false
  };



  renderPopupContent = phase => {
    let panels = [];
    //get the titles of the fieldTitles
    for (
      var i = 0;
      i < (phase.sectionsIncluded && phase.sectionsIncluded.length);
      i++
    ) {
      panels.push({
        key: i,
        title: phase.sectionsIncluded[i].sectionName,
        content: { content: this.expandSection(phase.sectionsIncluded[i]) }
      });
    }



    return (
      <div>
        <Accordion panels={panels} exclusive={false} />
      </div>
    );
  };

  renderPanels = phase => {
    return [
      {
        key: `${phase.phaseName}_contract`,
        title: `${phase.phaseName} Contract`,
        content: { content: this.renderPopupContent(phase) }
      }
    ];
  };
  expandSection = section => {
 

    let sectionPanels = [];
    for (
      var i = 0;
      i < (section.clausesIncluded && section.clausesIncluded.length);
      i++
    ) {
      sectionPanels.push({
        key: i,
        title: section.clausesIncluded[i].clause,
        content: section.clausesIncluded[i].clause
      });
    }

    console.log({ sectionPanels });

    return (
      <div>
        <Accordion panels={sectionPanels} exclusive={false} />
      </div>
    );
  };

  calculateTotalandTax = (phase, values) =>{
    
   // let deposit = Number(values[`${phase.phaseName}_deposit`]||0)
   // let due = Number(values[`${phase.phaseName}_due`]||0)
    let taxType="noTax";
    let due=0
    let deposit=0

     console.log('calculateTotalandTax Values', values)
     console.log('calculateTotalandTax phase', phase)
     console.log('due', values[`${phase.phaseName}_due`])
     console.log('tax', values[`${phase.phaseName}_tax`])
     console.log('deposit', values[`${phase.phaseName}_deposit`])
    if(!values[`${phase.phaseName}_due`]){
        due=0
        console.log("DUE IS EMPTY")
     }else{
        due = values[`${phase.phaseName}_due`]
     }

    if(!values[`${phase.phaseName}_deposit`]){
        deposit=0
        console.log("DEPOSIT IS EMPTY")
     }else{
        deposit = values[`${phase.phaseName}_deposit`]
     }
    if(!values[`${phase.phaseName}_tax`]){
       taxType="noTax"
       console.log("TAX IS EMPTY")
    }else{
        taxType = values[`${phase.phaseName}_tax`]
       
    }
    

    let subTotal = due+deposit
    let taxRate



    switch(taxType){
      case 'gst5pst5':
        taxRate = 0.1
      break;
      case 'gst5':
      taxRate=0.05
      break
      case 'pst5':
      taxRate=0.05
      break;
      case 'noTax':
      taxRate=0.00
      break;
      default:
      taxRate=0.00
    }

    let calculatedTax = subTotal*taxRate;
    console.log('calculatedTax', calculatedTax)
    let sum = calculatedTax+subTotal
    console.log('sum', sum)
    this.setState({subTotal, calculatedTax, sum})
  }

  onFormSubmit = async values => {
    const {selectedItemIndex, phase, phasesLength} = this.props
    this.setState({buttonLoading: true})
      
   this.calculateTotalandTax(phase, values)
      await this.props.handleUpdateLineItem(false, values, this.props.phase);
      
      this.setState({buttonLoading: false})

   if(selectedItemIndex<(phasesLength-1)){
     this.props.handleSelectItem(selectedItemIndex+1)
   } else{
    this.props.handleSelectItem(-1)
   }

  };

  render() {
    const {  phase, index, bidType, selectedItemIndex, handleSelectItem , initialValues, quote} =
      this.props || {};
      const lineItem=quote&&quote.lineItems&&quote.lineItems[phase&&phase.phaseName] ||{}
      const {buttonLoading} = this.state
     
      const {total, subtotal, calculatedTax} = lineItem
    return (
      <div style={{ paddingBottom: "10px" }}>
        <div
        style={{width:"100%", backgroundColor: index === selectedItemIndex ? 'green' : 'grey',marginBottom: "1px", paddingTop:'1px'}}
          onClick={() => handleSelectItem(index)}
          
        >
        <Grid >
          <Grid.Column style={{marginBottom:"0px", color: 'white'}}width={10}> {phase.phaseName}</Grid.Column>

          <Grid.Column style={{marginBottom:"0px",fontStyle:'italic', color:'white' }} width={6}>{subtotal>0?total:null}</Grid.Column>
        </Grid>
         
 

      
        </div>
        {index === selectedItemIndex && (
          <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
            <Grid style={{ margin: "10px" }}>
           
              <Grid.Row style={{ paddingTop: 6, paddingBottom:0, margin:0 }}>
                <Grid.Column style={{ paddingTop:"5px", marginTop:"5px" }} width={4}>
                  Deposit{" "}
                </Grid.Column>
                <Grid.Column style={{ paddingRight: "0px" }} width={12}>
                  {" "}
                  <Field
                    key={`${index}_deposit`}
                    type="text"
                    fluid
                    name={`${phase.phaseName}_deposit`}
                    value={this.state.deposit}
                    component={TextInput}
                    placeholder={`Deposit Required`}
                  />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ paddingTop: 6, paddingBottom:0, margin:0 }}>
            <Grid.Column style={{ paddingTop:"5px", marginTop:"5px" }} width={4}>
                  Due{" "}
                </Grid.Column>
                <Grid.Column style={{ paddingRight: "0px" }} width={12}>
                  {" "}
                  <Field
                    key={`${index}due`}
                    type="text"
                    value={this.state.due}
                    name={`${phase.phaseName}_due`}
                   
                    component={TextInput}
                    placeholder={`Due`}
                  />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ paddingTop: 6, paddingBottom:0, margin:0 }}>
                <Grid.Column style={{ paddingRight: "0px" }} width={4}>
                  {" "}
                  Tax
                </Grid.Column>
                <Grid.Column style={{ paddingRight: "0px" }} width={12}>
                  {" "}
                  <Field
                    style={{ maxWidth: "10px" }}
                    key={`${index}due`}
                    name={`${phase.phaseName}_tax`}
                    type="text"
                    options={taxes}
                    component={SelectInput}
                    placeholder={`Tax`}
                  />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ paddingTop: 6, paddingBottom:0, margin:0 }}>
                <Grid.Column style={{ paddingRight: "0px" }} width={4}>
                  {" "}
                </Grid.Column>
                <Grid.Column width={12}>
                  {" "}
                  <Button loading={buttonLoading} positive type="submit">
                    Update
                  </Button>
                </Grid.Column>
           





</Grid.Row>
<Grid.Row style={{ paddingTop: 6, paddingBottom:0, margin:0 }}>
<Accordion
  style={{ marginTop: "0px" }}
  panels={this.renderPanels(phase)}
/>
              </Grid.Row>


            </Grid>
          </Form>
        )}
      </div>
    );
  }
}

export default connect(
  mapState, 
  null
)(
  reduxForm({
   enableReinitialize: true,
  })(MobileLineItem)
);




