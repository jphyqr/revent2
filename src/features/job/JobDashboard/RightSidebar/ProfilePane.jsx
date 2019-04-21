import React, { Component } from 'react'
import {Button} from 'semantic-ui-react'
 class ProfilePane extends Component {
  render() {
      const {profile, openModal, compactDisplayMode} = this.props
      const {
        city,
        displayName,
        photoURL,
        companyName,
        companyUrl,
        facebookUrl,
        instagramUrl,
        builderProfile,
        contractorProfile,
        labourProfile,
  
        profileHasBeenClosed,
        hasValidConnectedAccount,
        hasValidCreditCard
      } = profile;
    return (
        <div >
         <img
              onClick={() => this.props.openModal("ProfileModal")}
              style={{
                height: compactDisplayMode?100:200,
                width: compactDisplayMode?100:200,
                marginLeft: "auto",
                marginRight: "auto",
                display: "block"
                // borderRadius: "50%",
                //    border: "3px solid grey",
                //     transition: "0.15s all ease"
                //  position: "absolute",
                //   top: 0,
                //   left: 0
              }}
              src={photoURL || "/assets/user.png"}
            />
            <label
              style={{
                //     position: "absolute",
                fontSize: 18,
                color: "grey",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                textAlign: "center",
                //    top: 5,
                //     left: 100,
                textOverflow: "ellipsis"
              }}
            >
              {displayName}
            </label>
            <label
              style={{
                fontSize: 14,
                color: "grey",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                textAlign: "center"
              }}
            >
              <a href={companyUrl}> {companyName || "Add Company"}</a>
            </label>
            <div style={{maxWidth:200,                marginLeft: "auto",
                marginRight: "auto",
                display: "block",}}>
            <Button.Group
              fluid
            >
              {" "}
              <Button
                size="mini"
                color="facebook"
                icon="facebook"
                onClick={() => window.location.assign(facebookUrl)}
                disabled={!facebookUrl}
                style={
                  {
                    //   position: "absolute",
                    //      top: 53,
                    //     left: 102
                  }
                }
                size="big"
              />
              <Button
                size="mini"
                color="instagram"
                icon="instagram"
                onClick={() => window.location.assign(instagramUrl)}
                disabled={!instagramUrl}
                style={
                  {
                    //   position: "absolute",
                    //     top: 53,
                    //     left: 160
                  }
                }
                size="big"
              />
              <Button
                size="mini"
                color="orange"
                icon="chrome"
                onClick={() => window.location.assign(companyUrl)}
                disabled={!instagramUrl}
                style={
                  {
                    //   position: "absolute",
                    //     top: 53,
                    //     left: 160
                  }
                }
                size="big"
              />
            </Button.Group>
            <Button fluid  onClick={() => this.props.openModal("ProfileModal")} primary style={{marginTop:5}}>Edit Profile</Button>
            </div>
      </div>
    )
  }
}

export default ProfilePane
