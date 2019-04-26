import React, { Component } from "react";
import { Label, Icon, Button } from "semantic-ui-react";

class MapMarker extends Component {


//  componentWillReceiveProps = (nextProps)=>{
//      if(this.props.itemClicked===false&&nextProps.itemClicked===true){
//          console.log("code reached")
//       this.setState({hover:false})
//        this.props.itemClickedProcessed()
//      }
//  }

  state = { hover: false };

  showInfo =  () => {
   
    
     this.props.handleMapItemClick(this.props.onboarder.id)
    // if(this.props.selectedId===this.props.onboarder.id)
    // this.setState({ hover: true });
    // else{
    //     this.setState({ hover: false });  
    // }
  };

  hideInfo = () => {
    this.setState({ hover: false });
    this.props.handleMapItemClick("")
  };

  render() {
    const {
      lat,
      lng,
      key, onboarder
    } = this.props ||{};
    const {values,isLive} = onboarder ||{}
    const {first_name, last_name, onboardingPhotoURL}  = values ||{}
  
    let categoryIcon = "marker" 
 

    return (
      <div>
        {lat&&lng&&
        <Icon
          name={categoryIcon}
          inverted
          size="big"
          color="red"//{this.props.hoveredJobId===this.props.job.id? "red" : "blue"}
          lat={lat}
          lng={lng}
          key={key}
          onMouseEnter={this.showInfo}
        //  onMouseLeave={this.hideInfo}
          onClick={this.showInfo}

        />}

        {(this.props.onboarder.id===this.props.selectedId)? 
        
        <div style={{ backgroundColor: "grey" , position:"relative", height:100, width:100}}>
            <img  style={{ position: "absolute", top:0, left:0, height:50, width:50}}src={onboardingPhotoURL}/>
            <Label  style={{position:"absolute", bottom:"0"}}content={`${first_name} ${last_name}`} />
            <Button style={{position:"absolute", top:0, right:0}} size="small" onClick={()=>this.hideInfo()}>X</Button>
            </div> : null
            }
      </div>
    );
  }
}

export default MapMarker;