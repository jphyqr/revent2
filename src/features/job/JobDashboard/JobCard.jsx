import React from "react";
import { Card, Image, Button, Icon, Label, Header } from "semantic-ui-react";
import { Link } from "react-router-dom";

const JobCard = ({ job, follow }) => {
  return (
    <Card as={Link} to={`/jobs`}>
      {job && <Image src={`/assets/categoryImages/${job.value}.jpg`} />}
      <Card.Content textAlign="center">
        {job && <Card.Header content={job.text} />}
      </Card.Content>
      <Card.Meta textAlign="center">

        {follow ? (
          
            <Button basic fluid color="blue"  content = 'Unsubscribe' />
  
        ) : (
    
            <Button primary color="green" fluid content='Subscribe'/>

        )}

         <Button  color="grey" fluid content='Map'/>
      
      </Card.Meta>
    </Card>
  );
};

export default JobCard;
