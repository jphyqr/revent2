import React, { Component } from "react";

import { Tab, Grid } from "semantic-ui-react";
import BuildExpandedNavBar from "./BuildExpandedNavBar";

class BuildExpanded extends Component {
  state = {
    currentJob: {},
    selectedTab: "overview"
  };

  handleSelectTab = tab => {
    console.log("select tab", tab);
    this.setState({ selectedTab: tab });
  };
  componentDidMount() {
    this.setState({ currentJob: this.props.selectedJob });
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.selectedJob !== this.state.currentJob) {
      console.log("props changed");
      this.setState({ currentJob: nextProps.selectedJob });
      this.forceUpdate();
    }
  };

  render() {
    const {selectedTab} = this.state
    return (
      <div
        container
        style={{
          height: 475,
          width: "auto",
          backgroundColor: "black",
          position:"relative"
        }}
      >

        <div
          style={{
            position: "absolute",
            right: 0,
            minWidth: "85%",
            maxWidth: "85%",
            minHeight: 475,
            maxHeight: 475,
            background: `url('/assets/categoryImages/${
              this.props.selectedJob.id
            }.jpg') center center no-repeat `,
            backgroundSize: "cover"
          }}
        />

        <div
          style={{
            height: 475,
            position: "absolute",
            minWidth: "85%",
            right: 0,
            maxWidth: "85%",
            backgroundImage:
              "linear-gradient(to left, rgba(255,255,255, 0) 0%, rgba(0,0,0, 1) 100%)"
            //  zIndex: "5"
          }}
        />
        <div style={{ zIndex: "1000" }}>
          <p
            style={{
              cursor: "pointer",
              color: "white",
              zIndex: "2000",
              position: "absolute",
              right: "0",

              fontSize: 40,
              marginRight: "25px",
              marginTop: "15px",
              textAlign: "right"
            }}
            onClick={() => {
              this.props.handleClose();
            }}
          >
            X
          </p>
          
         

        {selectedTab==="overview"&&<div className="description"
           style={{
            position: "absolute",
            fontSize: 30,
            top:"50%",
            color:"white",
            height:100,
            width:"auto",
            left:"50px",
            zIndex:"2000"
          }}
          > <p>Desription Content</p>
          
          
          
          </div>}

          <div className="actionButton"
           style={{
            position: "absolute",
            fontSize: 30,
            top:"75%",
            color:"white",
            height:100,
            width:"auto",
            left:"50px",
            zIndex:"2000"
          }}
          > <button style={{ width:200, cursor:"pointer" , color:"white", borderColor:"red", backgroundColor:"red"}}>Book</button>
          
          <button style={{width:200, marginLeft:"30px", cursor:"pointer" , color:"white", background:"transparent"}}>Subscribe</button>
          
          </div>


{selectedTab==="contractors"&&<div className="contractors"
           style={{
            position: "absolute",
            fontSize: 30,
            top:"50%",
            color:"white",
            height:100,
            width:"auto",
            left:"50px",
            zIndex:"2000"
          }}
          > <p>Contractors Content</p></div>}

{selectedTab==="supplies"&&<div className="contractors"
           style={{
            position: "absolute",
            fontSize: 30,
            top:"50%",
            color:"white",
            height:100,
            width:"auto",
            left:"50px",
            zIndex:"2000"
          }}
          > <p>Supplies Content</p></div>}


{selectedTab==="tips"&&<div className="contractors"
style={{
 position: "absolute",
 fontSize: 30,
 top:"50%",
 color:"white",
 height:100,
 width:"auto",
 left:"50px",
 zIndex:"2000"
}}
> <p>Tips Content</p></div>}

        

          <div className="title"
           style={{
            position: "absolute",
            fontSize: 50,
            top:"20px",
            color:"white",
            height:100,
            width:"auto",
            left:"10px",
            zIndex:"2000"
          }}
          > <p>{this.state.currentJob.string}</p></div>


          <div
            style={{
              position: "absolute",
              fontSize: 20,
              minWidth:100,
              bottom:0,
              left:"50%",
              marginLeft: "-170px",
              

              zIndex: "2000"
            }}
          >
            <BuildExpandedNavBar
              selectedTab={this.state.selectedTab}
              handleSelectTab={this.handleSelectTab}
            />
          </div>

  
        </div>

        {/* <div style={{ position: "absolute", right: "50%", marginTop:"400px"  }}>
          <Tab menu={{ secondary: true, pointing: true , attached:'bottom'}} panes={panes} />
        </div> */}
      </div>
    );
  }
}

export default BuildExpanded;
