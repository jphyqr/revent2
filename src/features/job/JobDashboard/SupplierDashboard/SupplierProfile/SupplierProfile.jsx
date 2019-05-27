import React, { Component } from "react";
import {

  Button,

} from "semantic-ui-react";

class SupplierProfile extends Component {
  render() {
    const { supplierProfile, compactDisplayMode } = this.props || {};
    const {
      storeUrl,
      storeName,
      storePhotoUrl,
      facebookUrl,storePhoneNumber,
      instagramUrl, venue
    } = supplierProfile || {};
    return (
      <div>
        <img
          onClick={() => this.props.openModal("SupplierProfileModal")}
          style={{
            height: compactDisplayMode ? 100 : 200,
            width: compactDisplayMode ? 100 : 200,
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
          src={storePhotoUrl || "/assets/user.png"}
        />

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
          <a href={storeUrl}> {venue || "No Location"}</a>
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
          <a href={storeUrl}> {storeName || "No Store Name"}</a>
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
          <a href={storeUrl}> {storePhoneNumber || "No Phone Number"}</a>
        </label>
        <div
          style={{
            maxWidth: 200,
            marginLeft: "auto",
            marginRight: "auto",
            display: "block"
          }}
        >
          <Button.Group fluid>
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
              onClick={() => window.location.assign(storeUrl)}
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
          <Button
            fluid
            onClick={() => this.props.openModal("SupplierProfileModal")}
            primary
            style={{ marginTop: 5 }}
          >
            Edit Profile
          </Button>
        </div>
      </div>
    );
  }
}

export default SupplierProfile;


