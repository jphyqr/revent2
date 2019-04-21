import React, { Component } from "react";
import { Card, Icon, Image, Rating } from "semantic-ui-react";
class ContractorItem extends Component {
  render() {
    const { item, compactDisplayMode } = this.props;
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
          height: compactDisplayMode ? 90 : 135,
          width: compactDisplayMode?190:250,

          borderRadius: "5%",
          backgroundColor: "gainsboro",
          position: "relative",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          marginLeft: 10,
          marginTop: 10,
          display: "inline-block",
          whiteSpace: "nowrap",
          overflow: "hidden"
        }}
      >
        <img
          style={{
            height: compactDisplayMode ? 50 : 75,
            width: compactDisplayMode ? 50 : 75,
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
            fontSize: compactDisplayMode ? 12 : 18,
            color: "grey",
            top: compactDisplayMode ? 5 : 10,
            left: compactDisplayMode ? 70 : 90,
            textOverflow: "ellipsis"
          }}
        >
          {item.displayName}
        </label>

        <label
          style={{
            position: "absolute",
            fontSize: compactDisplayMode ? 12 : 14,
            color: "grey",
            top: compactDisplayMode ? 25 : 55,
            left: compactDisplayMode ? 70 : 90
          }}
        >
          Cool Company
        </label>
        <Rating
          style={{ position: "absolute", top: compactDisplayMode ? 62 : 92, left: 5, opacity: 0.6 }}
          icon="star"
          defaultRating={4}
          maxRating={5}
        />

        <label
          style={{
            position: "absolute",
            fontSize: 14,
            color: "green",
            top: compactDisplayMode ? 62 : 92,
            margin: 0,
            left:  compactDisplayMode ? 105 : 120,
            opacity: 0.6
          }}
        >
          >10K
        </label>

        <label
          style={{
            position: "absolute",
            fontSize: 14,
            color: "brown",
            top: compactDisplayMode ? 62 : 92,
            margin: 0,
            left:  compactDisplayMode ? 155 : 180,
            opacity: 0.6
          }}
        >
          V3
        </label>
      </div>
    );
  }
}

export default ContractorItem;
