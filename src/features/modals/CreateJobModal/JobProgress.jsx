import React, { Component } from "react";
import { Step, Icon, Responsive } from "semantic-ui-react";

class JobProgress extends Component {

  state = {}

  handleOnUpdate = (e, { width }) => this.setState({ width })
  render() {
    const { showState , compactDisplayMode} = this.props;
    const {
      showSchedule,
      showPhotos,
      showOverview,
      showBasic,
      showCustom,
      showContract,
      showConfirm
    } = showState;

    const {width} = this.state
    const fluid = (width <= 768) ? true : false
    return (
<div>
{compactDisplayMode ? <div>

<Step.Group  fluid size='mini' style={{marginTop:5, marginBottom:2}} unstackable>
<Step
          completed={
            showCustom ||
            showSchedule ||
            showContract ||
            showConfirm ||
            showPhotos
          }
          active={showBasic}
          disabled={!showBasic}
        >       
      <Step.Content>
        <Step.Title>Basic</Step.Title>
      </Step.Content>
    </Step>
              <Step
          completed={showConfirm || showSchedule || showContract || showPhotos}
          active={showCustom}
          disabled={!showCustom}
        >
          <Responsive as={Icon} {...Responsive.onlyComputer}>
            <Icon name="credit card" />
          </Responsive>
          <Step.Content>
            <Step.Title>Job Specific</Step.Title>
          </Step.Content>
        </Step>

        <Step
          completed={showConfirm || showSchedule || showContract}
          active={showPhotos}
          disabled={!showPhotos}
        >

          <Step.Content>
            <Step.Title>Job Photos</Step.Title>
          </Step.Content>
        </Step>


</Step.Group>


<Step.Group fluid size='mini' style={{marginTop:0}} unstackable>



<Step
          completed={showConfirm || showContract}
          active={showSchedule}
          disabled={!showSchedule}
        >
   

          <Step.Content>
            <Step.Title>Schedule</Step.Title>
          </Step.Content>
        </Step>
        <Step
          completed={showConfirm}
          active={showContract}
          disabled={!showContract}
        >
       

          <Step.Content>
            <Step.Title>Contract</Step.Title>
          </Step.Content>
        </Step>
        <Step active={showConfirm} disabled={!showConfirm}>
     

          <Step.Content>
            <Step.Title>Confirm</Step.Title>
          </Step.Content>
        </Step>
    


</Step.Group>






</div>: <div>

<Responsive as={Step}   fireOnMount onUpdate={this.handleOnUpdate}>
  <Step.Group  fluid={fluid} size='mini'>
        {/* <Step completed={showContract||showConfirm||showBasic||showSchedule||showCustom} active={showOverview} disabled={!showOverview}>
          <Icon name='globe' />
          <Step.Content>
            <Step.Title>Overview </Step.Title>
          </Step.Content>
        </Step> */}
        <Step
          completed={
            showCustom ||
            showSchedule ||
            showContract ||
            showConfirm ||
            showPhotos
          }
          active={showBasic}
          disabled={!showBasic}
        >
          <Responsive as={Icon} {...Responsive.onlyComputer}>
            <Icon name="legal" />
          </Responsive>
          <Step.Content>
            <Step.Title>Basic Info</Step.Title>
          </Step.Content>
        </Step>

        <Step
          completed={showConfirm || showSchedule || showContract || showPhotos}
          active={showCustom}
          disabled={!showCustom}
        >
          <Responsive as={Icon} {...Responsive.onlyComputer}>
            <Icon name="credit card" />
          </Responsive>
          <Step.Content>
            <Step.Title>Job Specific Info</Step.Title>
          </Step.Content>
        </Step>
        <Step
          completed={showConfirm || showSchedule || showContract}
          active={showPhotos}
          disabled={!showPhotos}
        >
          <Responsive as={Icon} {...Responsive.onlyComputer}>
            <Icon name="credit card" />
          </Responsive>
          <Step.Content>
            <Step.Title>Job Photos</Step.Title>
          </Step.Content>
        </Step>
        <Step
          completed={showConfirm || showContract}
          active={showSchedule}
          disabled={!showSchedule}
        >
          <Responsive as={Icon} {...Responsive.onlyComputer}>
            <Icon name="info" />
          </Responsive>

          <Step.Content>
            <Step.Title>Schedule</Step.Title>
          </Step.Content>
        </Step>
        <Step
          completed={showConfirm}
          active={showContract}
          disabled={!showContract}
        >
          <Responsive as={Icon} {...Responsive.onlyComputer}>
            <Icon name="check" />
          </Responsive>

          <Step.Content>
            <Step.Title>Contract</Step.Title>
          </Step.Content>
        </Step>
        <Step active={showConfirm} disabled={!showConfirm}>
          <Responsive as={Icon} {...Responsive.onlyComputer}>
            <Icon name="check" />
          </Responsive>

          <Step.Content>
            <Step.Title>Confirm</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
      </Responsive>


</div>}
</div>
  
    
    );
  }
}

export default JobProgress;
