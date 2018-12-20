import React, { Component } from "react";
import { Label, Icon } from "semantic-ui-react";

class MapMarker extends Component {
  state = { hover: false };

  showInfo = () => {
    this.setState({ hover: true });
    this.props.handleMapItemClick(this.props.job.id)
  };

  hideInfo = () => {
    this.setState({ hover: false });
  };

  render() {
    const {
      lat,
      lng,
      key, job
    } = this.props;

   

    let categoryIcon = "marker" 
  if(job){

    
    
    switch(job.category){
    case 'snowremoval' :
    categoryIcon='snowflake';
    break;
    case 'carpentry' :
    categoryIcon='pencil alternate';
    break;
    case 'plumbing' :
    categoryIcon='wrench';
    break;
    default:
    categoryIcon="marker"
    }

}

    return (
      <div>
        <Icon
          name={categoryIcon}
          inverted
          size="big"
          color="red"
          lat={lat}
          lng={lng}
          key={key}
          onMouseEnter={this.showInfo}
          onMouseLeave={this.hideInfo}

        />

        {this.state.hover&&<Label content={job.title} />}
      </div>
    );
  }
}

export default MapMarker;
