
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
import { updateCategory, createCategory } from "./categoryActions";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";
import _ from 'lodash'
import DateInput from "../../../app/common/form/DateInput";
import PlaceInput from "../../../app/common/form/PlaceInput";
import { withFirestore } from "react-redux-firebase";

const mapState = state => {

    let category = {};

    if (!_.isEmpty(state.category)) {
  
        category = state.category
    }


  return {
    
    initialValues: category,
    category: state.category,
    loading: state.async.loading
  };
};

const actions = {
  updateCategory,
  createCategory,

};

const types = [
  { key: "standard_service", text: "standard_service", value: "standard_service" },
  { key: "promotion", text: "promotion", value: "promotion" },
];

const validate = combineValidators({
  value: isRequired({ message: "The category id is required" }),
  string: isRequired({ message: "Please provide a string" }),
  short_string: isRequired({ message: "Please provide a short string" }),

});

class CategoryForm extends Component {







  onFormSubmit = async values => {
 
    if (this.props.initialValues.id) {
      await this.props.updateCategory(values);
    } else {
      this.props.createCategory(values);
    }
  };

  render() {
    const {
      invalid,
      submitting,
      pristine,
      category,
      cancelToggle,
      loading
    } = this.props;
    return (
      <Grid>

        <Grid.Column width={10}>
     
            <Header sub color="teal" content="Category Details" />
            <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
              <Field
                name="value"
                type="text"
                component={TextInput}
                placeholder="Give your category a value"
              />
                <Field
                name="string"
                type="text"
                component={TextInput}
                placeholder="Give your category a string"
              />
                <Field
                name="short_string"
                type="text"
                component={TextInput}
                placeholder="Give your category a short version of string"
              />
              <Field
                name="type"
                type="text"
                component={SelectInput}
                options={types}
                placeholder="What is your category type"
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
    reduxForm({ form: "categoryForm", enableReinitialize: true, validate })(
      CategoryForm
    )
  )
);
