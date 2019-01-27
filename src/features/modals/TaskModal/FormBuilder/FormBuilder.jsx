import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import {
  selectFieldToEdit,
  updateExamplePhoto,
  uploadExamplePhoto
} from "../../NewFieldModal/fieldActions";
import FieldsPalette from "../../NewFieldModal/FieldsPalette/FieldsPalette";
import FieldsSlider from "../../NewFieldModal/FieldsSlider/FieldsSlider";
import NewFieldForm from "../../NewFieldModal/NewFieldForm";
import { updateFormDraft } from "../taskActions";
import FormDraft from "./FormDraft";

const mapState = state => {
  return {
    loading: state.async.loading,
    field: state.field
  };
};

const actions = {
  selectFieldToEdit,
  updateFormDraft,
  updateExamplePhoto,
  uploadExamplePhoto
};

class FormBuilder extends Component {
  state = {
    selectedFields:
      (this.props.task &&
        this.props.task.value &&
        this.props.task.value.fields) ||
      [],
    selectedField:
      (this.props.field &&
        this.props.field.payload &&
        this.props.field.payload.value) ||
      {},

    editField: false,
    exampleURL: "",
    examplePhotoHasUpdated: false
  };

  onDelete = async id => {
    console.log("delete", "test");
    await this.setState({
      selectedFields: [...this.state.selectedFields.filter(f => f.id !== id)]
    });
    this.props.updateFormDraft(this.props.task, this.state.selectedFields);
  };

  handleSelectField = async field => {
    console.log({ field });
    if (field.label === "New Field") {
      this.setState({ fieldLoading: true, editField: true });
      let newField = await this.props.selectFieldToEdit({});
      console.log({ newField });
      this.setState({ selectedField: field });
      this.setState({ fieldLoading: false });
      this.props.toggleEdit(true);
      //    this.forceUpdate()
    } else {
      this.setState({ fieldLoading: true });
      let newField = await this.props.selectFieldToEdit(field);
      console.log({ newField });
      await this.setState({ selectedField: field, editField: true });
      console.log("set state", this.state.selectedField);
      this.setState({ fieldLoading: false });
      this.props.toggleEdit(true);
      //this.forceUpdate()
    }
  };

  onDrop = async (ev, index) => {
    let j = ev.dataTransfer.getData("j");
    console.log({ j });
    let field = JSON.parse(ev.dataTransfer.getData("j"));
    console.log("on drop", field);
    if (field.label === "New Field") {
    } else {
      if (index === -1) {
        await this.setState({
          selectedFields: [...this.state.selectedFields, field]
        });
        this.props.updateFormDraft(this.props.task, this.state.selectedFields);
      } else {
        console.log("above drop");
        console.log("first", ...this.state.selectedFields.slice(0, index));
        console.log("second", ...this.state.selectedFields.slice(index));
        const stateArray = this.state.selectedFields;
        await this.setState({
          selectedFields: [
            ...stateArray.slice(0, index),
            ...[field],
            ...stateArray.slice(index)
          ]
        });
        this.props.updateFormDraft(this.props.task, this.state.selectedFields);
      }
    }
  };
  onDragStart = (ev, field) => {
    let j = JSON.stringify(field);
    console.log("on drag", j);
    ev.dataTransfer.setData("j", j);
    // if(field.label==='New Field')
    // {

    // } else {

    //     this.setState({selectedFields:[...this.state.selectedFields, field]})
    //     console.log('handleSelectField force update', this.state.selectedFields)

    // }
  };

  handlePhotoUploaded = async url => {
    console.log("photo uploaded url", url);
    let exampleURL = await this.props.uploadExamplePhoto(
      this.props.field,
      url
    );
    this.setState({ exampleURL: exampleURL });
    this.setState({ examplePhotoHasUpdated: true });
  };

  handleUpdatedExamplePhoto = () => {
    this.setState({ examplePhotoHasUpdated: false });
  };

  render() {
    const { task } = this.props;
    const { selectedFields, editField } = this.state;
    return (
      <div>
        <FieldsSlider
          fields={this.props.fields}
          onDragStart={this.onDragStart}
          handleSelectField={this.handleSelectField}
        />

        {this.props.showEdit ? (
          <NewFieldForm
            toggleEdit={this.props.toggleEdit}
            selectedField={this.state.selectedField}
            exampleURL={this.state.exampleURL}
            examplePhotoHasUpdated={this.state.examplePhotoHasUpdated}
            handleUpdatedExamplePhoto={this.handleUpdatedExamplePhoto}
            handlePhotoUploaded={this.handlePhotoUploaded}
          />
        ) : (
          <FormDraft
            task={this.props.task}
            onDelete={this.onDelete}
            onDrop={this.onDrop}
            selectedFields={this.state.selectedFields}
          />
        )}
      </div>
    );
  }
}

export default connect(
  mapState,
  actions
)(FormBuilder);
