import React, { Component } from "react";
import moment from "moment";
import { connect } from "react-redux";
import JournalDayItem from "./JournalDayItem";
import format from 'date-fns/format'
import { withFirestore } from "react-redux-firebase";
//import { getJobsForDashboard } from "./journalActions";


const mapState = state => {
  return {
    journals: state.firestore.ordered.journals
  };
};

const actions = {};

class JournalDashboard extends Component {
  state = {
    startDate: 1549298565,
    selectedIndex: -1
  };

  handleSelectDay = index => {
    this.setState({ selectedIndex: index });
  };


 

  async componentDidMount() {
    const { firestore } = this.props;
   await firestore.setListener(`journals`);
    
    this.setState({
      selectedSectionIndex: 0
    });
  }

  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`journals`);
  }


  render() {
    const { startDate } = this.state;
    let days = [];
    for (var i = 0; i < 90; i++) {
      let nextDayStamp = startDate * 1000 + i * (24 * 60 * 60 * 1000);
      days.push(nextDayStamp);
      console.log({ nextDayStamp });
      console.log("String", moment(nextDayStamp).toDate());
    }

    console.log({ days });

    return (
      <div
        style={{
          padding: "5px",
          height: "455px",
          width: "auto",
          backgroundColor: "grey",
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          position: "relative"
        }}
      >
        {days &&
          days.map((day, dayIndex) => (
            <JournalDayItem
            handleSelectDay={this.handleSelectDay}
              selectedIndex={this.state.selectedIndex}
              addJournalEntry={this.props.addJournalEntry}
              day={day}
              dayIndex={dayIndex}
            />
          ))}
      </div>
    );
  }
}



export default withFirestore(
  connect(
    mapState,
    actions
  )(JournalDashboard)
);
