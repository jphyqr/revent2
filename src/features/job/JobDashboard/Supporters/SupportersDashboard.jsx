import React, { Component } from "react";
import SupportersItem from "./SupportersItem";
import { connect } from "react-redux";
import { firebaseConnect, isLoaded } from "react-redux-firebase"; //even though we using firestore this gives our binding
import {
  Grid,
  Header,
  Divider,
  Button,
  Search,
  Label
} from "semantic-ui-react";
import { objectToArray } from "../../../../app/common/util/helpers";
import {
  deleteSupporter,
  toggleContractor,
  selectIndustry,
  toggleSupplier,
  toggleChampion
} from "./supportersActions";
import LoadingComponent from "../../../../app/layout/LoadingComponent";

const industries = [
  { key: "n_a", text: "N/A", value: "n_a" },
  { key: "carpentry", text: "Carpentry", value: "carpentry" },
  { key: "audio_visual", text: "Audio Visual", value: "audio_visual" },
  { key: "painting", text: "Painting", value: "painting" },
  { key: "mechanical", text: "Mechanical", value: "mechanical" },
  { key: "blinds", text: "Blinds", value: "blinds" },
  { key: "home_builder", text: "Home Builder", value: "home_builder" },
  { key: "exterior", text: "Exterior", value: "exterior" },
  { key: "decks", text: "Decks", value: "decks" },
  { key: "fencing", text: "Fencing", value: "fencing" },
  {
    key: "furnace_cleaning",
    text: "Furnace Cleaning",
    value: "furnace_cleaning"
  },
  { key: "realtor", text: "Realtor", value: "realtor" },
  { key: "renovations", text: "Renovations", value: "renovations" },
  {
    key: "building_materials",
    text: "Building Materials",
    value: "building_materials"
  },
  { key: "concrete", text: "Concrete", value: "concrete" },
  {
    key: "kitchen_and_bath",
    text: "Kitchen and Bath",
    value: "kitchen_and_bath"
  },
  { key: "security", text: "Security", value: "security" },
  { key: "windows", text: "Windows", value: "windows" },
  { key: "lighting", text: "Lighting", value: "lighting" },
  { key: "hottubs", text: "Hottubs", value: "hottubs" },
  { key: "foundations", text: "Foundations", value: "foundations" },
  { key: "sewer", text: "Sewer and Drain", value: "sewer" },
  { key: "landscaping", text: "Landscaping", value: "landscaping" },
  { key: "docks", text: "Docks", value: "docks" },
  { key: "garage", text: "Garage", value: "garage" },
  { key: "design", text: "Design", value: "design" },
  { key: "unsure", text: "Unsure", value: "unsure" },
  { key: "engineering", text: "Engineering", value: "engineering" },
  { key: "railings", text: "Railings", value: "railings" },
  { key: "water", text: "Water", value: "water" },
  { key: "flooring", text: "Flooring", value: "flooring" },
  { key: "solar", text: "Solar", value: "solar" },
  { key: "custom_features", text: "Custom Features", value: "custom_features" },
  { key: "insulation", text: "Insulation", value: "insulation" },
  { key: "finance", text: "Finance", value: "finance" },
  { key: "insurance", text: "Insurance", value: "insurance" },
  {
    key: "property_manager",
    text: "Property Manager",
    value: "property_manager"
  },
  { key: "mortgage_broker", text: "Mortage Broker", value: "mortgage_broker" }
];

const mapState = (state, ownProps) => {
  //console.log('mapstate', ownProps.pageNumber)
  //const startAt=(1+ownProps.pageNumber*10)
  //console.log({startAt})

  return {
    auth: state.firebase.auth,
    supporters: state.firebase.ordered.join_beta || [],
    startAt: ownProps.startAt,
    endAt: ownProps.endAt,
    requesting: state.firebase.requesting.join_beta
  };
};

const actions = {
  deleteSupporter,
  toggleContractor,
  selectIndustry,
  toggleChampion,
  toggleSupplier
};

class SupportersDashboard extends Component {
  state = { pageNumber: 0 };

  nextPage = () => {
    this.props.handleNextPage();
    this.forceUpdate;
  };

  render() {
    const {
      supporters,
      deleteSupporter,
      toggleContractor,
      toggleChampion,
      toggleSupplier,
      selectIndustry,
      requesting
    } = this.props;

    const supportersArray = supporters; //objectToArray(supporters);
    //   let teamTotal=0
    //   for(var i=0; i<(salesTeamArray&&salesTeamArray.length); i++){
    //    teamTotal=teamTotal+salesTeamArray[i].count
    //   }

    let letterArray = [];

    for (var i = 0; i < 26; i++) {
      letterArray.push(String.fromCharCode("a".charCodeAt() + i));
    }
    console.log({ letterArray });

    console.log({ supportersArray });

    if (!isLoaded(supporters) || requesting)
      return (
        <div
          container
          style={{
            width: "100%",
            height: "500px",
            backgroundColor: "lightgrey",
            margin: 10

            // position: "relative"
          }}
        >
          <LoadingComponent inverted={true} />
        </div>
      );

    return (
      <div
        style={{
          width: "100%",
          height: "500px",
          backgroundColor: "lightgrey",
          margin: 10
          // position: "relative"
        }}
      >
        <Grid>
          <Grid.Column width={4}>
            <Header as="h3">Email</Header>
          </Grid.Column>

          <Grid.Column width={1}> </Grid.Column>
          <Grid.Column width={4}> Industry</Grid.Column>
          <Grid.Column width={1}>
            {" "}
            <Header onClick={() => this.props.handleShowContractors()} as="h5">
              Cont
            </Header>
          </Grid.Column>
          <Grid.Column width={1}>             <Header onClick={() => this.props.handleShowSuppliers()} as="h5">
              Supl
            </Header></Grid.Column>
          <Grid.Column width={1}>            <Header onClick={() => this.props.handleShowChampions()} as="h5">
              Champs
            </Header></Grid.Column>
          <Grid.Column width={1}> Intr</Grid.Column>
          <Grid.Column width={3}> notes</Grid.Column>
        </Grid>

        <div
          className="list"
          style={{
            minHeight: "300px",
            maxHeight: "300px",
            overflowX: "hidden",
            overflowY: "auto"
          }}
        >
          {supportersArray &&
            supportersArray.map(supporter => (
              <SupportersItem
                selectIndustry={selectIndustry}
                toggleContractor={toggleContractor}
                deleteSupporter={deleteSupporter}
                supporter={supporter}
                industries={industries}
                toggleChampion={toggleChampion}
                toggleSupplier={toggleSupplier}
              />
            ))}
        </div>
        {/* <Button.Group>
          {" "}
          <Button
                      onClick={() =>
                       this.props.handlePreviousPage()
                      }
          
          >Prev</Button>
          <Button
            onClick={() =>
             this.nextPage()
            }
          >
            Next
          </Button>
        </Button.Group> */}
        <div style={{ overflowX: "auto", paddingTop: 10, overflowY: "hidden" }}>
          {industries &&
            industries.map(industry => (
              <Label
                style={{ width: "auto" , backgroundColor: industry===this.props.industry ? "green" : "lightgrey" }}
                onClick={() => this.props.filterByIndustry(industry)}
              >
                {industry.text}
              </Label>
            ))}
        </div>

        <Button.Group style={{ paddingTop: 10 }}>
          {letterArray &&
            letterArray.map(letter => (
              <Label style={{backgroundColor: letter===this.props.startLetter ? "green" : "lightgrey"}}  onClick={() => this.props.showLetter(letter)}>
                {letter}
              </Label>
            ))}
          <Label onClick={() => this.props.showLetter("A")}>A-Z</Label>
          <Label onClick={() => this.props.showLetter("0")}>0-9</Label>
        </Button.Group>
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(
  firebaseConnect(props => [
    {
      path: "/join_beta",
      queryParams: 
      props.showChampions ?
      [`orderByChild=isAChampion`, `equalTo=true`]
      :
      props.showSuppliers ?
      [`orderByChild=isASupplier`, `equalTo=true`]
      :
      
      props.showContractors
        ? [`orderByChild=isAContractor`, `equalTo=true`]
        : props.industry
        ? [`orderByChild=industry`, `equalTo=${props.industry.value}`]
        : [
            `orderByChild=email`,
            `startAt=${props.startLetter}`,
            `endAt=${props.endLetter}`
          ]
    }
  ])(SupportersDashboard)
);
