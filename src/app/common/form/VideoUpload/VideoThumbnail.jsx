import React, { Component } from "react";
import { TextArea, Button, Header, Icon } from "semantic-ui-react";
import Dropzone from "react-dropzone";
class VideoThumbnail extends Component {
  state = {
    title: "",
    files: [],
    fileName: "",
    playVideo: false,
    showVideo:false,
    image: {}
  };

  handleTitleChange = event => {
    console.log("handeTItleChange etv", event.target.value);
    //  this.props.handleUpdatePhotoTitle(this.props.index, event.target.value )
    this.setState({ title: event.target.value });
  };

  onDrop = async files => {
    console.log({ files });
    this.setState({
      files,
      fileName: files[0].name,
      showPlaceholder: true,
      placeholderURL: files[0].preview
    });
    await this.props.handleChangeThumbnail(this.props.video, files[0]);

    this.setState({
      files: {},
      fileName: {}
    });
  };


handleToggleVideo = async ()=>{
    console.log('toggle video')
   await this.setState({playVideo:!this.state.playVideo, showVideo:true})

    if(this.state.playVideo)
    {
        console.log('Video is now Played')
        document.getElementById("myVideo").play()
    }
  
    else{
        console.log('Video is now Paused')
        document.getElementById("myVideo").pause()
    }
  

}
  handleEnterKey = key => {
    console.log("handleenter ", key.keyCode);
    if (key.keyCode === 13) {
      //checks whether the pressed key is "Enter"
      key.preventDefault();
      //this.props.handleUpdateVideoTitle(this.props.video, this.state.title)

      // Trigger the button element with a click
      document.activeElement.blur();
    }
  };
  componentDidMount() {
    const { video } = this.props || {};
    const { title } = video || "";
    if (title) this.setState({ title: title });
    else this.setState({ title: "Edit Title..." });
  }

  render() {
    const { video, index } = this.props || {};
    const {thumb, originalURL} = video || {}

  

    return (
      <div
        class="frame"
        style={{
          //  display:"flex",
          height: 115,
          width: 115,

          marginLeft: 10,
          //    marginTop: "auto",
          //   marginBottom: "auto",
          backgroundColor: "black",
          //  border: "1px solid black",
          whiteSpace: "nowrap",
          display: "inline-block",

          textAlign: "center"
        }}
      >
       
          <div
            style={{
              backgroundColor: "black",
              height: "100%",
              width: "100%",
              position: "relative"
            }}
          >
            <div
              style={{
                width: "50%",
                position: "absolute",
                bottom: "0%",
                left: "0"
              }}
            />


<video
             onLoad={() => this.props.checkIfLoaded(index)}
              style={{ position: "absolute", right:"0", bottom:0, height:"100%", width:"100%" }}
              height="600"
              
              paused
    
              
              hidden={!this.state.showVideo}
              id="myVideo"
             
              
            >
              <source src={originalURL} type="video/mp4" />
            </video>


            <TextArea
              id="textArea"
              onChange={this.handleTitleChange}
              onKeyDown={this.handleEnterKey}
              value={this.state.title}
              onBlur={() =>
                this.props.handleUpdateVideoTitle(video, this.state.title)
              }
              onFocus={() => {
                this.setState({ title: "" });
              }}
              style={{
                width: "100%",
                height: "20px",
                color: "white",
                backgroundColor: "black",
                fontSize: "10px",
                textAlign: "center",
                position: "absolute",
                top: "0%",
                left: "0",
                zIndex: "2",
                rows: 1
              }}
            >
              Title
            </TextArea>
            <Button.Group
              style={{
                  opacity: this.state.playVideo?"0.3":"1",
                position: "absolute",
                width:"100%",
                bottom: "0%",
                right: "0",
                height: 30
              }}
            >
              <Dropzone
      
                onDropRejected={console.log("rejected")}
                onDrop={this.onDrop}
                multiple={false}
                accept="image/*"
                style={{width:"auto", height:"auto" }}
              >
                <Button
                  icon
                  size="mini"
                  style={{
                    fontSize: "10px",
                    padding: 2,
                    textAlign: "center",
                    height:30,
                    width:33,
                    zIndex: "2"
                  }}
                >
               
                    <Icon name="photo" />
                
                </Button>
              </Dropzone>

              <Button
                icon
                size="mini"
                onClick={() => this.handleToggleVideo()}
                style={{
                  fontSize: "10px",
                  textAlign: "center",
                  padding: 2,
                  zIndex: "2"
                }}
              >
                <Icon name={this.state.playVideo?"pause":"play"} />
              </Button>

              <Button
                icon
                size="mini"
                onClick={() => this.props.handleDeleteVideo(video)}
                style={{
                  fontSize: "10px",
                  textAlign: "center",
                  padding: 2,
                  zIndex: "2"
                }}
              >
                <Icon name="delete" />
              </Button>
            </Button.Group>

            <span
              style={{
                display: "inline-block",
                height: "100%",
                verticalAlign: "middle",
                backgroundColor: "red"
              }}
            >
              {" "}
            </span>
            <img
              onLoad={() => this.props.checkIfLoaded(index)}
              style={{
                verticalAlign: "middle",
                maxHeight: 115, // this.state.hovered ? 200 : 150,
                maxWidth: 115,
                //    left:this.state.hovered ? 50 : 0,
                opacity: 1,
                //    transition: "opacity 1500ms , height 1500ms , width 1500ms ",
                //      transform: this.state.hovered?"scale(1.5)":"scale(1)",
                //    transformOrigin: "50% 50%",
                transition: "0.15s all ease"
              }}
              src={thumb}
            />
          </div>
        
      </div>
    );
  }
}

export default VideoThumbnail;
