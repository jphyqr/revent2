import React, { Component } from "react";
import Slider from "react-slick";
import { allItems } from "../../../../../app/data/buildData";
import { Button, Image, Transition, Dimmer, Loader } from "semantic-ui-react";

import ContractsSlider from './MyContractsSlider/ContractSlider'
import MyContractsExpanded from "./MyContractsExpanded/MyContractsExpanded";


import { connect } from "react-redux";
import {selectContract} from './contractActions'


const actions = {
  selectContract
    
}

const mapState = state => {

  return {
    contract: state.contract,
    loading: state.async.loading
  };
};

class MyContractCarousel extends Component {




async componentDidMount(){


    this.setState({selectedContract:this.props.contract})
  

}
  


  state = {
    showExpanded: false,
    sliding:false,
    job: "",
    lockInHover: false,
    childIsExpanding: false,
    carouselHovered: false,
    carouselRef: {},
    scrollRef:{},
    index:0,
    nextRef:{},
    selectedContract: {},
    tasks: [],
    subscribeButtonLoading: false,
    expandedLoading: false,
  };







  toggleLockInHover = () => {
    this.setState({ lockInHover: true });
  };

  handleShowExpanded  = async contract => {
    this.setState({expandedLoading:true})
   await this.props.selectContract(contract)
  
    this.setState({ selectedContract: this.props.contract, showExpanded: true });
    this.setState({expandedLoading:false})
  };

  handleClose = () => {
    this.setState({ showExpanded: false, lockInHover: false });
  };




  onMouseEnterHandler = () => {
 //  if(this.state.childIsExpanding)
    this.setState({
      carouselHovered: true
    });
  };
  onMouseLeaveHandler = () => {
    this.setState({
      carouselHovered: false,
    
    });
    if(!this.state.showExpanded)
    this.setState({
        childIsExpanding: false
    })
  };

  render() {
    const { contract, scrollToMyRef, myContracts } = this.props;
    const {selectedContract} = this.state


    return (
      <div style={{marginTop:30}}>
 


         <ContractsSlider 

           showExpanded={this.state.showExpanded}
 
           myContracts={myContracts}
           scrollToMyRef={scrollToMyRef}
           handleShowExpanded={this.handleShowExpanded}
           toggleLockInHover={this.toggleLockInHover}

           lockInHover={this.state.lockInHover}
     

           loading={this.props.loading}
        
           

         />

        <Transition.Group animation="scale" duration={400}>
         
          {(this.state.showExpanded || this.state.expandedLoading)&& 
          
         

            <MyContractsExpanded 
        
            selectedContract={selectedContract}

            handleClose={this.handleClose}
       
            />
          }
        </Transition.Group>
      </div>
    );
  }
}

export default connect(mapState,actions)(MyContractCarousel);
