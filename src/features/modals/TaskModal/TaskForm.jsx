import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Segment, Form, Button, Grid, Header } from "semantic-ui-react";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import { updateTask, createTask, updateTaskPhoto } from "./taskActions";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import _ from "lodash";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import { withFirestore } from "react-redux-firebase";
import PhotoUpload from '../../../app/common/form/PhotoUpload/PhotoUpload'
import { stat } from "fs";

const mapState = state => {
  let task = {};

  
  task = state.task&&  state.task.value;
  

  return {
    
    task: state.task,
    initialValues: task,
    loading: state.async.loading,
    categories: state.firestore.ordered.categories,
    fields: state.firestore.ordered.fields,
  };
};

const actions = {
  updateTask,
  createTask,
  updateTaskPhoto
};

const types = [
  {
    key: "service",
    text: "service",
    value: "service"
  },
  { key: "supply", text: "supply", value: "supply" },
  { key: "tool", text: "tool", value: "tool" },
  { key: "design", text: "design", value: "design" },
  
];

const validate = combineValidators({
  // value: isRequired({ message: "The task id is required" }),
  // string: isRequired({ message: "Please provide a string" }),
  // short_string: isRequired({ message: "Please provide a short string" })
});

class TaskForm extends Component {

state={
  displayURL: ""
}

  async componentDidMount() {
    const { firestore } = this.props;
    await firestore.setListener(`fields`);


    this.setState({
      displayURL: this.props.task.displayURL || "https://firebasestorage.googleapis.com/v0/b/revents-99d5b.appspot.com/o/pVBFKV5Sp2giwswxvj7mpsJa4Bj1%2Fuser_images%2Fcjqeg4nnu000d3g5u6giajkoa?alt=media&token=e5adabbe-fb7c-4bf2-ac3d-e43d18da14bf"
    })
  }






  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`fields`);
  }
  onFormSubmit = async values => {
    const {initialValues, updateTask, task} = this.props
    const {displayURL} = this.state
    if (initialValues&&task) {
      console.log("updateTask")
      await updateTask(values, task.key, displayURL);
    } else {
      this.props.createTask(values, displayURL);
    }
  };

  handleRenderList = categories => {
    let item;
    let list = [];
    categories &&
      categories.map(category =>
        list.push({
          key: category.id,
          text: category.string,
          value: category.id
        })
      );

      return list;
  };

  render() {
    const {
      invalid,
      submitting,
      pristine,
      task,
      cancelToggle,
      loading,
      categories
    } = this.props;

    const {displayURL} = this.state

    const list = this.handleRenderList(categories);

    return (
      <div >
      <Grid>
        <Grid.Column width={10}>
          <Header sub color="teal" content="Task Details" />
          


          <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
            <Field
              name="name"
              type="text"
              component={TextInput}
              placeholder="My Great Service..."
            />
            <Field
              name="description"
              type="text"
              component={TextArea}
              rows={3}
              placeholder="Describe your Service"
            />
            {/* <Field
              name="short_string"
              type="text"
              component={TextInput}
              placeholder="Give your task a short version of string"
            /> */}
            <Field
              name="category"
              type="text"
              component={SelectInput}
              options={list}
              placeholder="What is your category"
            />
                        <Field
              name="type"
              type="text"
              component={SelectInput}
              options={types}
              placeholder="What is your type"
            />


            <Button
              disabled={invalid || submitting}
              positive
              loading={loading}
              type="submit"
            >
              Save
            </Button>
           
          </Form>
        </Grid.Column>
      </Grid>
      </div>
    );
  }
}

export default withFirestore(
  connect(
    mapState,
    actions
  )(
    reduxForm({ form: "taskForm", enableReinitialize: true, validate })(
      TaskForm
    )
  )
);
