import React, { Component } from "react";
import BuildCarousel from "./BuildCarousel/BuildCarousel";
import { categories } from "../../../../app/data/buildData";
import scrollToComponent from "react-scroll-to-component";
class BuildDetail extends Component {
  state = {
    contextRef: {},
    selectedJob: ""
  };

  handleContextRef = contextRef =>
    this.setState({
      contextRef
    });

  scrollToMyRef = (eChild, category) => {
  
      console.log({ eChild });
      console.log({ category });

      scrollToComponent(eChild.currentTarget, {
        offset: -110,
        align: "top",
        duration: 600
      });
    
  };
  render() {
    return (
      <div style={{marginTop:10}}>
        {categories &&
          categories.map(category => (
            <BuildCarousel
              key={category.id}
              category={category}
              scrollToMyRef={this.scrollToMyRef}
              handleContextRef={this.handleContextRef}
            />
          ))}
      </div>
    );
  }
}

export default BuildDetail;
