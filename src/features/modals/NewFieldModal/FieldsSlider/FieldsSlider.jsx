import React, { Component } from "react";
import FieldItem from "../FieldsPalette/FieldItem";
class FieldsPalette extends Component {
  render() {
    const { fields } = this.props;
    return (
      <div
   
      style={{
        height: 100,
        marginBottom: 1,
        marginTop:5,
        padding:5,
        width: "1000px",
       backgroundColor: "WhiteSmoke",
        overflowX: "auto",
        overflowY: "hidden",

        whiteSpace: "nowrap",
        position: "relative",
      }}
      >
      <FieldItem onDragStart={this.props.onDragStart}  handleSelectField={this.props.handleSelectField} key={"add"} field={{icon:'add', label:'New Field'}} />
        {fields &&
          fields.map((field, i) => <FieldItem onDragStart={this.props.onDragStart} handleSelectField={this.props.handleSelectField} key={i} field={field} />)}
      </div>
    );
  }
}

export default FieldsPalette;
