import React, { Component } from "react";
import { Card, Icon, Image, Rating } from "semantic-ui-react";
class ContractorItem extends Component {
  render() {
    const { item } = this.props;
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
          display: "inline-block"
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
          src={item.photoURL}
        />

        <label
          style={{
            position: "absolute",
            fontSize: 18,
            color: "grey",
            top: 10,
            left: 90
          }}
        >
        {item.displayName}
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
          Contractor
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
        <Rating
          style={{ position: "absolute", top: 92, left: 5 , opacity:0.6}}
          icon="star"
          defaultRating={4}
          maxRating={5}
        />

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
          >10K
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
          V3
        </label>
      </div>
    );
  }
}

export default ContractorItem;
