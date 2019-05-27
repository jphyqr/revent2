import React, { Component } from "react";
import { Grid, Icon, Button } from "semantic-ui-react";
import TextInput from "../../../app/common/form/TextInput";
import NewSpecForm from "./NewSpecForm";
import SpecItem from "./SpecItem";
class SelectManager extends Component {
  handleSelectSubmit = () => {
    const { selectKey, selectText, selectValue, selectItems } = this.state;
    let newItem = { key: selectKey, text: selectText, value: selectValue };
    let items = selectItems;
    items.push(newItem);
    this.setState({
      selectItems: items,
      selectKey: "",
      selectText: "",
      selectValue: ""
    });
  };

  render() {
    const { specs } = this.props || [];
    return (
      <div>
        <NewSpecForm handleSpecSubmit={this.props.handleSpecSubmit} />
        {specs &&
          specs.map((spec, index) => (
            <SpecItem
              handleDeleteSpec={this.props.handleDeleteSpec}
              selectedSpecIndex={this.props.selectedSpecIndex}
              handleSelectSpecToExpand={this.props.handleSelectSpecToExpand}
              handleDeleteItemFromSpec={this.props.handleDeleteItemFromSpec}
              spec={spec}
              index={index}
              handleUpdateSpecItems={this.props.handleUpdateSpecItems}
            />
          ))}
      </div>
    );
  }
}

export default SelectManager;
