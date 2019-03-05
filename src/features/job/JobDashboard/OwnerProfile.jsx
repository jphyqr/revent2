import React, { Component } from 'react'
import {connect} from 'react-redux'
import { firestoreConnect } from "react-redux-firebase"; //even though we using firestore this gives our binding
import {Card, Image, Icon, Button, Grid} from 'semantic-ui-react'





const query = ({ownerUid}) => {
    return [
        {
            collection: "users",
            doc: ownerUid,
            storeAs: "owner_profile"
        }
    ]
}
const mapState=state=>({
  
    ownerProfile: state.firestore.ordered.owner_profile&&state.firestore.ordered.owner_profile[0]
})
 class OwnerProfile extends Component {
   
  render() {
      console.log(this.props.ownerUid)
      console.log(this.props.ownerProfile)
   const {ownerProfile} = this.props
   const rating = ownerProfile&&ownerProfile.rating
   const averageRating = rating&&(rating.clean+rating.craftsmanship+rating.professionalism+rating.punctuality)/4

   const totalVolume= ownerProfile&&ownerProfile.volume.totalVolume
  const numberOfJobs = ownerProfile&&ownerProfile.volume.numberOfJobs
   let totalVolumeString = ''

   if(totalVolume<1000){
       totalVolumeString=`$${totalVolume}`
   } else if (totalVolume<10000){
    totalVolumeString=`$${parseFloat(totalVolume/1000).toFixed(1)}K`
   }
   else if (totalVolume<1000000){
    totalVolumeString=`$${parseFloat(totalVolume/1000).toFixed(0)}K`
   }

   

   //    const {displayName, isContractor, photoURL, rating, verificationLevel, volume, createdAt} = ownerProfile
    return (
        <Card>
        <Image display={{height:'100px'}}src={ownerProfile&&ownerProfile.photoURL} />
        <Card.Content>
          <Card.Header>{ownerProfile&&ownerProfile.displayName}</Card.Header>
          <Card.Meta>
            <span className='date'>Joined in 2015</span>
          </Card.Meta>
        
        </Card.Content>
        <Card.Content extra>
        {ownerProfile&&ownerProfile.isContractor&&
         <Grid>
             <Grid.Column style={{fontSize:'18px', color:'gold'}}width={4}>
            
         {averageRating}
             
             </Grid.Column>
             <Grid.Column style={{fontSize:'18px', color:'grey'}} width={4}>
             
             {`${numberOfJobs} `}
             </Grid.Column>
             <Grid.Column style={{fontSize:'18px', color:'green'}} width={4}>
             {`${totalVolumeString}`}
             
             </Grid.Column>
             <Grid.Column width={4}>
             
             <Icon  size="large" name='mail' />
             </Grid.Column>
         
       




       </Grid>}
          
        </Card.Content>
      </Card>
    )
  }
}


export default connect(mapState,null)(firestoreConnect(props=>query(props))(OwnerProfile))