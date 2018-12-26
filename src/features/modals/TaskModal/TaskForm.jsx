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
import { updateTask, createTask } from "./taskActions";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import _ from "lodash";
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import { withFirestore } from "react-redux-firebase";

const mapState = state => {
  let task = {};

  if (!_.isEmpty(state.task)) {
  
    task = state.task;
  }

  return {
    initialValues: task,
    task: state.task,
    loading: state.async.loading,
    categories: state.firestore.ordered.categories
  };
};

const actions = {
  updateTask,
  createTask
};

const types = [
  {
    key: "service",
    text: "service",
    value: "service"
  },
  { key: "supply", text: "supply", value: "supply" },
  { key: "tool", text: "tool", value: "tool" },
  { key: "design", text: "design", value: "design" }
];

const validate = combineValidators({
  id: isRequired({ message: "The task id is required" }),
  string: isRequired({ message: "Please provide a string" }),
  short_string: isRequired({ message: "Please provide a short string" })
});

class TaskForm extends Component {
  async componentDidMount() {
    const { firestore } = this.props;
    await firestore.setListener(`categories`);
  }

  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`categories`);
  }

  onFormSubmit = async values => {
    if (this.props.initialValues.id) {
      await this.props.updateTask(values);
    } else {
      this.props.createTask(values);
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

    const list = this.handleRenderList(categories);

    return (
      <Grid>
        <Grid.Column width={10}>
          <Header sub color="teal" content="Task Details" />
          <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
            <Field
              name="value"
              type="text"
              component={TextInput}
              placeholder="Give your task a id"
            />
            <Field
              name="string"
              type="text"
              component={TextInput}
              placeholder="Give your task a string"
            />
            <Field
              name="short_string"
              type="text"
              component={TextInput}
              placeholder="Give your task a short version of string"
            />
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
              disabled={invalid || submitting || pristine}
              positive
              loading={loading}
              type="submit"
            >
              Submit
            </Button>
            <Button
              disabled={loading}
              //  onClick={this.props.history.goBack}
              type="button"
            >
              Cancel
            </Button>
          </Form>
        </Grid.Column>
      </Grid>
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
