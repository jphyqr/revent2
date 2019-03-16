import React, { Component } from 'react'
import {Icon} from 'semantic-ui-react'
import moment from 'moment'
import format from 'date-fns/format'
import distanceInWords from 'date-fns/distance_in_words'
export default class OpenJobItem extends Component {

  state = {
    quoteId: "", quoteSubmitted: false, quoteExists:false, hovered: false, isSelected: false
  }

    componentDidMount(){
      const {myQuotes, job}= this.props
      const {id, date, startDate} = job
      


    //  const { jobId } = this.state;
   //   const { selectedJobId, myQuotes } = nextProps;
      // if (jobId == "" || selectedJobId !== jobId) {
      //   this.setState({
      //     jobId: selectedJobId,
      //     quoteId: "",
      //     showEditButton: false,
      //     quoteButtonLoading: true
      //   });
  
        for (var i = 0; i < myQuotes.length; i++) {
          if (
            typeof myQuotes[i] == "object" &&
            myQuotes[i].jobId === id
          ) {
            this.setState({ quoteId: myQuotes[i].quoteId, quoteSubmitted:myQuotes[i].submitted, quoteExists: true });
          }
        }
      }


    
    
    onMouseEnterHandler = () => {
        this.props.handleHoverJob(true, this.props.job.id)
        this.setState({hovered:true})
    }
    onMouseLeaveHandler = () => {
      this.props.handleHoverJob(false, this.props.job.id)
      this.setState({hovered:false})
  }

    handleClick=(e,job)=>{
        this.props.handleSelectOpenJob(job)
    }

    render() {
        const {job, index} = this.props
        const { date, created, startDate, contract} = job ||{}

        const contractorHired = !(job.contract==undefined)
        let postedDistance = distanceInWords(created , Date.now())
        let startDistance = distanceInWords(startDate.seconds*1000 , Date.now())

        const postedString = `Posted ${postedDistance} ago`
        let startString; // `Starts in ${startDistance}`

        if(startDate.seconds*1000<Date.now()){
          //in the past
          startString = `Started ${startDistance} ago.`
        } else {
          //in the future
          startString = `Starts in ${startDistance}`
        }

      return (
        <div
        ref={index}
        className="ui  image"
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
        onClick={e => this.handleClick(e, job)}
        style={{
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          display: "inline-block",
          height: 100, // this.state.hovered ? 200 : 150,
          width: 300, //: 400,
          marginLeft: 15,
          //left: this.state.hovered ? -30: 0,
          opacity: (this.state.hovered||this.state.isSelected) ? 1 : 0.8,
          // transition: "opacity 1500ms, height 1500ms , width 1500ms ",
          //   transform: this.state.hovered ? "scaleY(1.5)" : this.props.scrollRightClicked ? "translateX(-500%)" : "scaleY(1)" ,
          //transform: this.state.clicked ? "translateX(-100%)" : "translateX(0%)",
          // transformOrigin: "50% 50%",
          boxSizing: "border-box",
          transition: "0.15s all ease",
          //  transitionDelay: "100ms"
        }}
      >
        <div
          style={{
            backgroundColor: "black",
            padding: 0
          }}
        >
          <img
            style={{
              height: 100, //this.state.hovered ? 200 : 150,
              width: 300, //this.state.hovered ? 600 : 400, //300,//this.state.hovered ? 450 : 300,
              //    left:this.state.hovered ? 50 : 0,
              opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              //    transition: "opacity 1500ms , height 1500ms , width 1500ms ",
              //      transform: this.state.hovered?"scale(1.5)":"scale(1)",
              //    transformOrigin: "50% 50%",
              transition: "0.15s all ease"
            }}
            src={job.jobPhotoURL||job.managerPhotoURL}
          />
        </div>
        <div
          style={{
            //    backgroundColor: "black",
            color: "white",
            fontSize: 12,
            position: "absolute",
            bottom: "0",
            marginBottom: 5,
            marginRight: 5,
            //right: "100",
            textAlign: "right",
            width: "100%",
            height: "auto",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden"
          }}
        >
          {job.title}
        </div>
        <div
          style={{
            //     backgroundColor: "black",
            color: "white",
            fontSize: 18,
            position: "absolute",
            bottom: 20,
            textAlign: "center",
            width: "100%",

           opacity: this.state.hovered ? 0.8 : 0,
            height: "auto"
          }}
        >
          <Icon color="white" size="huge" name="arrow down" />
        </div>

        {(!contractorHired)&&this.state.quoteSubmitted  ? (
          <div
            style={{
              position: "absolute",
              top: 5,
             left:5,
              opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              color: "blue",
              background:"white"
            }}
          >
            Quote Submitted!
          </div>
        ) : (!(contractorHired)&&this.state.quoteExists) ? (
          <div
            style={{
              position: "absolute",
              top: 5,
              left:5,
            
              background: "black",
              opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              color: "yellow"
            }}
          >
            Quote Started
          </div>
        ): null}

<div
            style={{
              position: "absolute",
              top: 5,
              width:"100%",
              textAlign:"center",
              opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              color: "white"
            }}
          >
   {postedString}

          </div>


          {(!contractorHired)&&      <div
            style={{
              position: "absolute",
              top: 20,
              width:"100%",
              textAlign:"center",
              opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              color: "white"
            }}
          >
   {startString}

          </div>}





        {contractorHired?  <div
            style={{
              position: "absolute",
              top: 30,
              right: 60,
              opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              color: "white"
            }}
          >
            CONTRACTOR HIRED
          </div> :
        job.inDraft  ? (
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              color: "white"
            }}
          >
            In Draft
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              color: "white"
            }}
          >
            OPEN
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: 30,
            right: 5,
            color: "white",
            zIndex: 5
          }}
        >
          {/* {item.managerUid === auth.uid ? (
            <Button
              loading={isLoading}
              onClick={() => this.editTask(item)}
            >
              edit task
            </Button>
          ) : isSubscribed ? (
            <Button icon
            circular
            style={{opacity: 0.6,
            
              boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
            }
          
          }
            size="large"
            color="white"
              loading={this.props.subscribeButtonLoading&&this.state.isSelected}
              onClick={() => this.props.handleUnsubscribe(item)}
            >
              <Icon size="large" name="deaf"/>
            </Button>
          ) : (
            <Button
            icon
            circular
            size="large"
              loading={this.props.subscribeButtonLoading&&this.state.isSelected}
              onClick={() => this.props.handleSubscribe(item)}
              inverted
            color="white"
              style={{opacity: 1,
                boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              
              }}
            >
            <Icon size="large" name="assistive listening systems"/>
            </Button>
          )} */}
        </div>
      </div>
      )
    }
}
