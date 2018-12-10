import React, { Component } from 'react'
import {Segment, Container, Label, Icon, TextArea, Grid, Image} from 'semantic-ui-react'
import distanceInWords from "date-fns/distance_in_words";
 class TestPopup1 extends Component {
    state = {
        text: ""
      };


      handleKeyPress = (e) => {
        if (e.key === 'Enter') {
         this.handleSubmit()
        }
      }
    
      handleSubmit = async () => {
        console.log(this.state.text);
        // const { message, messageUser, addDirectMessage } = this.props;
        // const values = { comment: this.state.text };
        // addDirectMessage(message.id, values);
        // messageUser(message);
         this.setState({ text: "" });
      };
    
      handleChange = event => {
        this.setState({ text: event.target.value });
      };
  render() {
      const {width,height,right,bottom, message, directMessages, auth} = this.props
    return (
        <Segment
        style={{
          padding: 0,
          width: width,
          height: height+25,
          right: right,
          position: "fixed",
          bottom: bottom,
          zIndex: 1000,
          maxWidth: width
        }}
      >
        <Segment style={{ padding: 0 }} attached="top">
        <Grid  container padding={false}>
        <Grid.Row  color="blue">
          <Grid.Column width={14}>{message.displayName}</Grid.Column>
         <Icon  size='medium' name='close'/>
        </Grid.Row>
      </Grid>
        </Segment>
        <Segment
          attached
          style={{
            overflow: "auto",
            maxHeight: 100,
            minHeight: 100,
            maxWidth: width,
            bottomMargin: 0
          }}
        >
                <Grid  container padding={false}>
        <Grid.Row  color="green">
          <Grid.Column width={14}>Contract</Grid.Column>
         <Icon  size='medium' name='close'/>
        </Grid.Row>
      </Grid>
        </Segment>
        <Segment
          attached
          style={{
            overflow: "auto",
            maxHeight: 250,
            minHeight: 250+25,
            maxWidth: width,
            bottomMargin: 0
          }}
        >
          {directMessages &&
            directMessages.map(comment => (
              <div key={comment.id}>
                {comment.uid == auth.uid ? (
                  <Grid verticalAlign="bottom">
                    <Grid.Row
                      verticalAlign="bottom"
                      style={{
                        padding: "3px",
                        marginBottom: "0px",
                        marginTop: "0px"
                      }}
                    >
                      <Grid.Column
                        style={{ marginBottom: "0px", marginTop: "0px" }}
                        textAlign="center"
                      >
                        <p style={{ color: "grey" }}>
                          {" "}
                          {distanceInWords(comment.date, Date.now())} ago{" "}
                        </p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row
                      style={{
                        padding: "0px",
                        marginTop: "0px",
                        marginBottom: "30px"
                      }}
                    >
                      <Grid.Column width={2} />
                      <Grid.Column width={14} textAlign="right">
                        <Label
                          style={{
                            fontSize: 14,
                            borderRadius: 15,
                            padding: "8px",
                            maxWidth: 200,
                            wordWrap: "break-word",
                            marginTop: "0px"
                          }}
                          color="blue"
                        >
                          {comment.text}
                        </Label>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                ) : (
                  <Grid>
                    <Grid.Row
                      style={{
                        padding: "3px",
                        marginBottom: "0px",
                        marginTop: "0px"
                      }}
                    >
                      <Grid.Column
                        style={{ marginBottom: "0px", marginTop: "0px" }}
                        textAlign="center"
                      >
                        <p style={{ color: "grey" }}>
                          {" "}
                          {distanceInWords(comment.date, Date.now())} ago
                        </p>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row
                      style={{
                        padding: "0px",
                        marginTop: "0px",
                        marginBottom: "30px"
                      }}
                    >
                      <Grid.Column width={3}>
                        <Image
                          inline
                          avatar
                          circular
                          size="small"
                          src={comment.photoURL || "/assets/user.png"}
                        />
                      </Grid.Column>
                      <Grid.Column width={10} textAlign="left">
                        <Label
                          style={{
                            fontSize: 14,
                            borderRadius: 15,
                            padding: "8px",
                            maxWidth: 200,
                            wordWrap: "break-word",
                            marginTop: "0px"
                          }}
                        >
                          {comment.text}
                        </Label>
                      </Grid.Column>
                      <Grid.Column width={3} />
                    </Grid.Row>
                  </Grid>
                )}

                {/* <Image inline avatar circular size="mini"
                    src={comment.photoURL || "/assets/user.png"}
                  />  */}
              </div>
            ))}

          <div ref={`thing`} />
        </Segment>
        <Container
        
          style={{
            padding: 0,
            width: width,
            right: right,
            position: "fixed",
            zIndex: 1000,
            borderStyle: "none",
            bottom: bottom + 25,
            
          }}
        >
          <TextArea
          style={{
            width:width,
            padding:'0px',
            topMargin:0,
            borderOpacity: 0
           
          }}
            onChange={this.handleChange}
            value={this.state.text}
            onKeyPress={this.handleKeyPress}
            autoHeight
           
            placeholder="Type a message..."
          />
        </Container>
        <Container
          style={{
            padding: 0,
            width: width,
            right: right,
            position: "fixed",
            zIndex: 1000,
            bottom: bottom
          }}
        >
          <Icon
            disabled={!this.state.text.length>0}
            style={{ bottom: bottom }}
            onClick={this.handleSubmit}
            size="large"
            name="send"
          />
        </Container>
      </Segment>
    )
  }
}

export default TestPopup1
