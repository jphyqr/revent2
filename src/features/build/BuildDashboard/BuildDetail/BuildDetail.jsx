import React, { Component } from "react";
import BuildCarousel from "./BuildCarousel/BuildCarousel";
//import { categories } from "../../../../app/data/buildData";
import scrollToComponent from "react-scroll-to-component";
import {withFirestore} from 'react-redux-firebase'
import {connect} from 'react-redux'


const actions = {

}


const mapState = state => {


  return {
    categories: state.firestore.ordered.categories
  };
};

class BuildDetail extends Component {



  async componentDidMount() {
    const { firestore } = this.props;
    await firestore.setListener(`categories`);
  }

  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`categories`);
  }


  state = {
    contextRef: {},
    selectedJob: ""
  };

  handleContextRef = contextRef =>
    this.setState({
      contextRef
    });

  scrollToMyRef = (eChild, category) => {
  
   

      scrollToComponent(eChild.currentTarget, {
        offset: -110,
        align: "top",
        duration: 600
      });
    
  };
  render() {
    const {categories} = this.props
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

export default withFirestore(connect(mapState, actions)(BuildDetail));
