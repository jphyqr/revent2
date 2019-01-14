import React, { Component } from "react";
import FieldItem from "./FieldItem";
class FieldsPalette extends Component {
  render() {
    const { fields } = this.props;
    return (
      <div
        style={{
          borderRadius: "5%",
          backgroundColor: "grey",
          width: "100%",
          height: "100%",
          padding: "15px",
          position: "relative"
        }}
      >
      <FieldItem handleSelectField={this.props.handleSelectField} key={"add"} field={{icon:'add', label:'New Field'}} />
        {fields &&
          fields.map((field, i) => <FieldItem handleSelectField={this.props.handleSelectField} key={i} field={field} />)}
      </div>
    );
  }
}

export default FieldsPalette;
