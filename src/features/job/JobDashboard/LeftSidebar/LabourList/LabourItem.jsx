import React, { Component } from 'react'
import {Button} from 'semantic-ui-react'
 class LabourItem extends Component {
    
  render() {
      const {labourer, newChatLabourer} = this.props
      const {displayName, jobsCompleted, jobsStarted, photoURL, rating, updatedSkills} = labourer


      const {clean, communication, craftsmanship, professionalism, punctuality} = rating || {}
      const averageRating =
        ((
          clean +
           craftsmanship +
            professionalism +
           punctuality+ communication) /
            5)
  


    return (
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
          src={photoURL||"/assets/user.png"}
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
        {displayName}
   </label>
<Button
primary
       // onClick={()=>this.props.handleViewQuote(item)}
          style={{
            position: "absolute",
            fontSize: 14,
            top: 40,
            left: 125
          }}
        >
          View Skills
        </Button>
        <Button 
        loading={this.props.loading}
        onClick={()=>newChatLabourer(labourer)}
                  style={{
                    position: "absolute",
                    fontSize: 14,
                    top: 40,
                    left: 85
                  }}
        
        icon='mail' 
        secondary/>

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
         {jobsStarted||"No Volume"}
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
          {jobsCompleted || "No Jobs"}
        </label>
      </div>
    )
  }
}

export default LabourItem