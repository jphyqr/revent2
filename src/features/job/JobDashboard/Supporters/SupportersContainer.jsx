import React, { Component } from "react";
import SupportersDashboard from "./SupportersDashboard";




export default class SupportersContainer extends Component {
  state = { industry: "", showContractors:false, showSuppliers:false, showChampions:false, pageNumber: 0, startLetter:'a', endLetter:'b' };


  filterByIndustry = (industry) =>{
      this.setState({industry:industry, showContractors:false, showSuppliers:false, showChampions:false})
  }


  handleNextPage = () => {
    this.setState({ pageNumber: parseInt(this.state.pageNumber) + 1})//this.state.pageNumber + 1 });
    this.forceUpdate()
  };

  handlePreviousPage = () => {
    this.setState({ pageNumber: parseInt(this.state.pageNumber) - 1 });
  };

  handleShowContractors=()=>{
    this.setState({showContractors:true, showSuppliers:false, showChampions:false})
  }

  handleShowSuppliers=()=>{
    this.setState({showContractors:false, showSuppliers:true, showChampions:false})
  }

  handleShowChampions=()=>{
    this.setState({showContractors:false, showSuppliers:false, showChampions:true})
  }

  showLetter=(letter)=>{
  let endletter;
    this.setState({startLetter:letter, industry:"", showContractors:false})
    if(letter==='A')
    {
    endletter='Z'
    }
    else if(letter==='0')
    {
    endletter='9'
    }
    else{
     endletter = String.fromCharCode(letter.charCodeAt() + 1)
    }
    
    
    this.setState({endLetter:endletter})
// switch(letter){

// case 'a':
// this.setState({startLetter:'a', endLetter:'b'})
// break;
// case 'b':
// this.setState({startLetter:'b', endLetter:'c'})
// break;
// case 'c':
// this.setState({startLetter:'c', endLetter:'d'})
// break;
// default:

// }
  }


  render() {
    return (
      <div>
        <SupportersDashboard
          pageNumber={this.state.pageNumber}
          handleNextPage={this.handleNextPage}
          handlePreviousPage={this.handlePreviousPage}
          showLetter={this.showLetter}
          startLetter={this.state.startLetter}
          endLetter={this.state.endLetter}
          filterByIndustry={this.filterByIndustry}
          industry={this.state.industry}
          showContractors={this.state.showContractors}
          showSuppliers={this.state.showSuppliers}
          showChampions={this.state.showChampions}
          handleShowContractors={this.handleShowContractors}
          handleShowSuppliers={this.handleShowSuppliers}
          handleShowChampions={this.handleShowChampions}
          
        />
      </div>
    );
  }
}
