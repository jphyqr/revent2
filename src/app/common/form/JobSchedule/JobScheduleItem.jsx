import React, { Component } from "react";
import format from "date-fns/format";
import { Button } from "semantic-ui-react";
import moment from 'moment'
class JobScheduleItem extends Component {
  render() {
    const {
      day,
      dayIndex,
      handleTimeSelected,
      handleTimeUnselected,
      currentTimesSelected
    } = this.props;
    console.log({ currentTimesSelected });
    return (
      <div
        container
        style={{
          display: "inline-block",
          width: "100px",
          position: "relative",
          height: 160,
          backgroundColor: "yellow",
          marginRight: "10px"
        }}
      >
        <div
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            whiteSpace: "nowrap",
            backgroundColor: "red",
            height: "auto"
          }}
        >
          <p>
            {format(day && day.timeStamp && moment(day.timeStamp*1000).toDate(), "ddd Do")}
          </p>{" "}
        </div>

        {day &&
          day.timeSlots.map((timeSlot, index) => (
            <div
              style={{
                backgroundColor:
                  currentTimesSelected &&currentTimesSelected[dayIndex]&&
                  currentTimesSelected[dayIndex].timeSlots[index].selected === true
                    ? "green"
                    : "blue"
              }}
              onClick={() =>
                this.props.handleTimeSelected(day.timeStamp, index)
              }
            >
              {timeSlot.label}
            </div>
          ))}
      </div>
    );
  }
}

export default JobScheduleItem;
