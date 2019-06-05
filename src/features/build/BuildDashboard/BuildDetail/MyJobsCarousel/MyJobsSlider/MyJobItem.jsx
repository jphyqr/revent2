import React, { Component } from "react";
import { Icon } from "semantic-ui-react";




class MyJobItem extends Component {
  state = {
    jobQuotes: {}
  };

  componentDidMount() {
    
    this.setState({ jobQuotes: this.props.jobQuotes });
    //  {
    //   console.log('MyJobItem CWRP', nextProps)
    //    this.setState({jobQuotes: nextProps.jobQuotes})
    //  }
  }
  componentWillReceiveProps = nextProps => {

    if (this.state.jobQuotes !== nextProps.jobQuotes) {
     
              this.setState({jobQuotes: nextProps.jobQuotes})
    }
    //  {
    //   console.log('MyJobItem CWRP', nextProps)

    //  }
  };

  handleClick = async (e, myJob) => {
    this.setState({ clicked: true });
    //   this.setState({isSelected:true})
    this.props.toggleLockInHover();
    this.setState({ expanded: true });
    this.setState({ hovered: false });
    this.props.handleShowExpanded(myJob);
    if (!this.props.showExpanded) {
      this.props.scrollToMyRef(e, 0);
    }
  };

  render() {
    const { myJob, index, selectDraftToEdit ,        compactDisplayMode,
      COMPACT_ITEM_HEIGHT,
      COMPACT_ITEM_WIDTH,
      REGULAR_ITEM_HEIGHT,
      REGULAR_ITEM_WIDTH, notifications} = this.props||{};

      const {newQuotes} = notifications || []
      const {jobQuotes} = this.state || []
      const {jobId, quoteCount: totalQuotes} = myJob || {}
      let quoteCount=0
      for(var i=0; i<(newQuotes&&newQuotes.length); i++){
        if(newQuotes[i]===jobId)
        quoteCount +=1

      }
    return (
      <div
        ref={index}
        className="ui  image"
        //   onMouseEnter={this.onMouseEnterHandler}
        //   onMouseLeave={this.onMouseLeaveHandler}
        onClick={e => this.handleClick(e, myJob)}
        style={{
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          display: "inline-block",
          height: compactDisplayMode ? COMPACT_ITEM_HEIGHT:REGULAR_ITEM_HEIGHT , // this.state.hovered ? 200 : 150,
          width: compactDisplayMode ? COMPACT_ITEM_WIDTH:REGULAR_ITEM_WIDTH ,
          marginLeft: 5,
          //left: this.state.hovered ? -30: 0,
          //    opacity: (this.state.hovered||this.state.isSelected) ? 1 : 0.8,
          // transition: "opacity 1500ms, height 1500ms , width 1500ms ",
          //   transform: this.state.hovered ? "scaleY(1.5)" : this.props.scrollRightClicked ? "translateX(-500%)" : "scaleY(1)" ,
          //transform: this.state.clicked ? "translateX(-100%)" : "translateX(0%)",
          // transformOrigin: "50% 50%",
          boxSizing: "border-box",
          transition: "0.15s all ease"
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
              height: compactDisplayMode ? COMPACT_ITEM_HEIGHT:REGULAR_ITEM_HEIGHT , // this.state.hovered ? 200 : 150,
              width: compactDisplayMode ? COMPACT_ITEM_WIDTH:REGULAR_ITEM_WIDTH ,
                         //    left:this.state.hovered ? 50 : 0,
              //       opacity: (this.state.hovered||this.state.isSelected)  ? 1 : 0.8,
              //    transition: "opacity 1500ms , height 1500ms , width 1500ms ",
              //      transform: this.state.hovered?"scale(1.5)":"scale(1)",
              //    transformOrigin: "50% 50%",
              transition: "0.15s all ease"
            }}
            src={myJob.jobPhotoURL}
          />
        </div>
        <div
          style={{
            backgroundColor: "black",
            color: "white",
            fontSize: compactDisplayMode? 12: 16,
            position: "absolute",
            bottom: "0",

            //right: "100",
            textAlign: "center",
            width: "100%",
            height: "auto",


            textOverflow: "ellipsis",
            whiteSpace: compactDisplayMode? "normal" : "nowrap",
            overflow: "hidden"













          }}
        >
          {myJob.title}
        </div>

      {(quoteCount>0)&& <div
            style={{
              position: "absolute",
              top: "35%",
              width:"100%",
              textAlign: "center",
              opacity: 1,
              color: "white",
              background:"green"
            }}
          >
            {`NEW QUOTE(${quoteCount})`}
          </div>}


          {(totalQuotes>0)&& <div
            style={{
              position: "absolute",
              top: "55%",
              width:"100%",
              textAlign: "center",
              opacity: 1,
              color: "white",
              background:"grey"
            }}
          >
            {`Quotes - (${totalQuotes})`}
          </div>}



        <div
          style={{
            //     backgroundColor: "black",
            color: "white",
            fontSize: 18,
            position: "absolute",
            bottom: 50,
            textAlign: "center",
            width: "100%",

                 opacity: this.state.hovered ? 0.8 : 0,
            height: "auto"
          }}
        >
          <Icon color="white" size="huge" name="arrow down" />
        </div>
        {myJob.inDraft ? (
          <div
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              opacity: 0.6,
              color: "white",
              background:"grey"
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
              opacity: 0.6,
              color: "white",
              background:"green"
            }}
          >
            LIVE
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
    );
  }
}

export default (MyJobItem);
