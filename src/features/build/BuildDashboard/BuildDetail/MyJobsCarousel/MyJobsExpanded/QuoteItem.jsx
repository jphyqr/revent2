import React, { Component } from "react";
import { Card, Icon, Image, Rating } from "semantic-ui-react";
class QuoteItem extends Component {
  render() {
    const { item } = this.props;
    const {quoterRating, quoterVolume} = item || {};
    const averageRating =
      (quoterRating &&
        (quoterRating.clean +
          quoterRating.craftsmanship +
          quoterRating.professionalism +
          quoterRating.punctuality) /
          4) ||
      0;

    const totalVolume =
      (quoterVolume &&
        quoterVolume.totalVolume )||
      0;
    const numberOfJobs =
      (quoterVolume &&
        quoterVolume.numberOfJobs) ||
      0;
    let totalVolumeString = "";

    if (totalVolume < 1000) {
      totalVolumeString = `$${totalVolume}`;
    } else if (totalVolume < 10000) {
      totalVolumeString = `$${parseFloat(totalVolume / 1000).toFixed(1)}K`;
    } else if (totalVolume < 1000000) {
      totalVolumeString = `$${parseFloat(totalVolume / 1000).toFixed(0)}K`;
    }



    return (
      //     <Card>
      //     <Image src={item.photoURL} />
      //     <Card.Content>
      //       <Card.Header>{item.displayName}</Card.Header>
      //       <Card.Meta>
      //         <span className='date'>{item.joinDate}</span>
      //       </Card.Meta>
      //       <Card.Description>Description</Card.Description>
      //     </Card.Content>
      //     <Card.Content extra>
      //       <a>
      //         <Icon name='user' />
      //         22 Reviews
      //       </a>
      //     </Card.Content>
      //   </Card>
      <div
      
        style={{
           
          height: 135,
          width: 250,

          borderRadius: "5%",
          backgroundColor: "gainsboro",
          position: "relative",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          marginRight: 10,
          marginTop: 10,
          display: "inline-block",
          whiteSpace: "nowrap",
            overflow: "hidden"
        }}
      >
        <img
          style={{
            height: 75,
            width: 75,
      borderRadius: "50%",
      border: "3px solid grey",
            transition: "0.15s all ease",
            position: "absolute",
            top: 5,
            left: 5
          }}
          src={item.quotedByPhotoURL}
        />

        <label
          style={{
            position: "absolute",
            fontSize: 18,
            color: "grey",
            top: 10,
            left: 90,
            textOverflow:"ellipsis",
            
          }}
        >
        {item.quotedBy}
   </label>
<label
          style={{
            position: "absolute",
            fontSize: 14,
            color: "grey",
            top: 35,
            left: 90
          }}
        >
          Quote
        </label>

        <label
          style={{
            position: "absolute",
            fontSize: 14,
            color: "grey",
            top: 55,
            left: 90
          }}
        >
          Cool Company
        </label>
        <label
          style={{ position: "absolute", fontSize: 20,
          color: "orange",  top: 92, left: 20 , opacity:0.6}}
          
          
        >{averageRating||"No Rating"}</label>

<label
          style={{
            position: "absolute",
            fontSize: 14,
            color: "green",
            top: 90,
            margin: 0,
            left: 120, opacity:0.6
          }}
        >
         {totalVolumeString||"No Volume"}
        </label>

        <label
          style={{
            position: "absolute",
            fontSize: 14,
            color: "brown",
            top: 90,
            margin: 0,
            left: 180, opacity:0.6
          }}
        >
          {numberOfJobs || "No Jobs"}
        </label>
      </div>
    );
  }
}

export default QuoteItem;
