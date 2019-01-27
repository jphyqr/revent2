import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { Segment, Form, Button, Grid, Header, Message } from "semantic-ui-react";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan
} from "revalidate";
import { updateTask, createTask, updateTaskPhoto } from "./taskActions";
import TextInput from "../../../app/common/form/TextInput";
import RadioInput from '../../../app/common/form/RadioInput'
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import _ from "lodash";
import Checkbox from "../../../app/common/form/Checkbox";
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
  name: isRequired({ message: "Name your task" }),
  description: isRequired({ message: "Describe your task" }),
  category: isRequired({ message: "Select a category" }),
   type: isRequired({ message: "Select a type" }),
    bookingType: isRequired({ message: "Select a booking type" })
});

class TaskForm extends Component {

state={
  displayURL: "",
  bookingType: "online"
}

  async componentDidMount() {
    const { firestore } = this.props;
    await firestore.setListener(`fields`);


    this.setState({
      displayURL: this.props.task.displayURL
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
    this.forceUpdate()
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
          <Form.Group inline>
             <Field
              name="bookingType"
              type="radio"
              label="Site Visit Required"
              component={RadioInput}
              value="site"
            /> 
             <Field
              name="bookingType"
              type="radio"
              label="Book Online"
              component={RadioInput}
              value="online"
            /> 
            </Form.Group>
           <Message>Select the contract types that may work with this task.  Owners will select methods they accept at booking, and contractors can bid for whatever methods remain.  Purchasing of supplies is suggested, as it is expected that for certain jobs both parties may purchase materials.</Message>
            <Form.Group inline>
<Field
                name="hourlyOwner"
                type="checkbox"

                label="$/H-Owner supplies"
                component={Checkbox}
              />
<Field
                name="hourlyContractor"
                type="checkbox"

                label="$/H-Contractor supplies"
                component={Checkbox}
              />
              <Field
                name="flatOwner"
                type="checkbox"

                label="Flat-Owner supplies"
                component={Checkbox}
              />
                            <Field
                name="flatContractor"
                type="checkbox"

                label="Flat-Contractor supplies"
                component={Checkbox}
              />
        </Form.Group>

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