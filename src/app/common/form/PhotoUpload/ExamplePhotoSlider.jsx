import React from "react";
import { Header, Image } from "semantic-ui-react";
const ExamplePhotoSlider = ({ photos , name, label, aboveMessage}) => {
  return (
    photos &&
    photos.length > 0 && (
      <div
        style={{
          height: 125,
          marginBottom: 1,
          marginTop: 5,
          padding: 5,
          width: "auto",
          backgroundColor: "WhiteSmoke",
          overflowX: "auto",
          overflowY: "hidden",

          whiteSpace: "nowrap",
          position: "relative"
        }}
      >
        <Header>Upload photos of {label} </Header>
        {photos &&
          photos.map(photo => (
            <div style={{ display: "inline-block", marginRight: "15px" }}>
              <Image style={{ height: 100, width: 100 }} src={photo.url} />
            </div>
          ))}
      </div>
    )
  );
};

export default ExamplePhotoSlider;
