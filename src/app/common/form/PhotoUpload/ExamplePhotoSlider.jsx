import React from "react";
import { Header, Image, Popup } from "semantic-ui-react";
const ExamplePhotoSlider = ({ photos , name, label, aboveMessage}) => {
  return (
    photos &&
    photos.length > 0 && (
      <div>
      <div
        style={{
          height: "150",
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
       
        {photos &&
          photos.map(photo => (
           <div style={{ display: "inline-block", marginRight: "15px" }}>
            <div>
              {photo.title}
            </div>
            <div >
              <Popup trigger={<Image style={{ height: 150, width: 150 }} src={photo.url} />} content={photo.description} />
              
            </div>
            </div>
          ))}
      </div>
      </div>
    )
  );
};

export default ExamplePhotoSlider;
