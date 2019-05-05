import React, { Component } from 'react'
import {Button, Image, Grid, Icon} from 'semantic-ui-react'
 class LabourItem extends Component {
    
  render() {
      const {labourer, newChatLabourer, compactDisplayMode, role} = this.props||{}
      const {authenticated} = role || {}
      const {displayName, jobsCompleted, jobsStarted,  volumeTotal, photoURL, rating, updatedSkills, labourPhotos} = labourer
      const{rate, coverletter, hasTransportation, hasBasicTools, hasValidLicense} = updatedSkills

      const {clean, communication, craftsmanship, professionalism, punctuality} = rating || {}
 

    const averageRating =
      (rating &&
        (clean + communication + craftsmanship + professionalism + punctuality) / 5) ||
      0;

    let volumeTotalString = "$0";

    if (volumeTotal < 1000) {
      volumeTotalString = `$${volumeTotal}`;
    } else if (volumeTotal < 10000) {
      volumeTotalString = `$${parseFloat(volumeTotal / 1000).toFixed(1)}K`;
    } else if (volumeTotal < 1000000) {
      volumeTotalString = `$${parseFloat(volumeTotal / 1000).toFixed(0)}K`;
    }


    return (
      <div
      
        style={{
           
          height: compactDisplayMode? 290: 440,
          width: 300,

          borderRadius: "5%",
          backgroundColor: "gainsboro",
          position: "relative",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        marginLeft: 10,
       //   marginTop: 10,
          display: "inline-block",
          whiteSpace: "nowrap",
            overflow: "hidden"
        }}
      >
    <Grid style={{margin: 3,}}>
      <Grid.Row>
        <Grid.Column width={compactDisplayMode?4:6}>
        <img
          style={{
            height: compactDisplayMode?50:100,
            width: compactDisplayMode? 50:100,
  //    borderRadius: "50%",
   //   border: "3px solid grey",
            transition: "0.15s all ease",
    //        position: "absolute",
     //       top: 5,
     //       left: 5
          }}
          src={photoURL||"/assets/user.png"}
        />
        </Grid.Column>
        <Grid.Column width={compactDisplayMode?6:10}>
        <label
          style={{
            width:"100%",
            fontSize: compactDisplayMode? 12: 18,
            color: "grey",
            display: "block",
            textOverflow:"ellipsis",
            padding:compactDisplayMode?0:5
          }}
        >
        {displayName}
   </label>
   <label
          style={{
           
            fontSize: compactDisplayMode? 12: 18,
            color: "green",
            padding:compactDisplayMode? 0: 5,
            display: "block",
            textOverflow:"ellipsis",
            
          }}
        >
        {`$${rate}/hr`}
   </label>
   <Icon size={compactDisplayMode?"small":"large"} name="car" style={{color: hasTransportation ? "green" : "grey", opacity: hasTransportation ? "1" : ".3"}}/>
   <Icon size={compactDisplayMode?"small":"large"} name="drivers license" style={{color: hasValidLicense ? "green" : "grey", opacity: hasValidLicense ? "1" : ".3"}}/>
   <Icon size={compactDisplayMode?"small":"large"} name="briefcase" style={{color: hasBasicTools ? "green" : "grey", opacity: hasBasicTools ? "1" : ".3"}}/>
       
       
       
       
        </Grid.Column>
       {compactDisplayMode&& <Grid.Column width={6}>
       <Button
           fluid
           inverted
            positive
       // onClick={()=>this.props.handleViewQuote(item)}
          style={{
      
            fontSize: 12,
           
          }}
        >
          Skills
        </Button>

       {authenticated&&<Button 
           fluid
        loading={this.props.loading}
        onClick={()=>newChatLabourer(labourer)}
                  style={{
                 
                    fontSize: 12,
               
                  }}
        
         inverted
        secondary>Message</Button>}
          </Grid.Column>}
</Grid.Row>
        <Grid.Row style={{padding: compactDisplayMode? 0:5}}>
            <Grid.Column width={4}>Rating</Grid.Column>
            <Grid.Column width={6}>$Volume</Grid.Column>
       
            <Grid.Column width={4}>#Completed</Grid.Column>
          </Grid.Row>
         
            <Grid.Row
              style={{ textAlign: "center", paddingTop: 0, marginTop: 0 }}
            >
              <Grid.Column width={4}>{averageRating}</Grid.Column>
              <Grid.Column width={6}>{volumeTotalString}</Grid.Column>
            
              <Grid.Column width={4}>{jobsCompleted}</Grid.Column>
            </Grid.Row>
         {(!compactDisplayMode)&&   <Grid.Row>
            {coverletter}


            </Grid.Row>}
            <div style={{height:135,  width:"100%", whiteSpace: "nowrap", padding:5, backgroundColor:"lightgrey", overflowY:"hidden", overflowX:"auto"}}>

          {labourPhotos && labourPhotos.map(photo=>(
             <Image
             
             style={{ marginLeft:10, maxHeight: 115, display:"inline-block", maxWidth: 115 }}
             src={photo}
           />
          ))}
          </div>
          <Grid.Row>
           <Grid.Column width={8}> 
           <Button
           fluid
           inverted
            positive
       // onClick={()=>this.props.handleViewQuote(item)}
          style={{
      
            fontSize: 14,
           
          }}
        >
          View Skills
        </Button>
           
           </Grid.Column>
           <Grid.Column width={8}>  <Button 
           fluid
        loading={this.props.loading}
        onClick={()=>newChatLabourer(labourer)}
                  style={{
                 
                    fontSize: 14,
               
                  }}
        
        icon='mail' inverted
        secondary>Message</Button> </Grid.Column>
      

            </Grid.Row>

    </Grid>
        {/* <img
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
        </label> */}
      </div>
    )
  }
}

export default LabourItem