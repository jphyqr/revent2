import React, { Component } from "react";
import { Message, Step, Form, Grid, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import TextInput from "../../../app/common/form/TextInput";
import Checkbox from "../../../app/common/form/Checkbox";
import { Field, reduxForm } from "redux-form";
import { joinAlpha } from "../../user/userActions";

const actions = { joinAlpha };

const mapState = state => {
  return {
    loading: state.async.loading
  };
};

class AboutAlpha extends Component {
  state = {
    showSuccess: true
  };

  handleSubmit = async values => {
    await this.props.joinAlpha(values);

    this.setState({ showSuccess: true });
  };

  render() {
    const { loading, joinAlpha } = this.props;
    const { showSuccess } = this.state;
    return (
      <Grid>
        <Grid.Column width={6} only="computer" />
        <Grid.Column width={4} only="tablet" />
        <Grid.Column mobile={16} tablet={8} computer={4}>
          <div style={{ padding: "10px" }}>
            {showSuccess ? (
              <div>
                <Message>
                  <Message.Header>Smart move!</Message.Header>
                  <Message.List>
                    <Message.Item>
                      You will be notified by e-mail as we add new jobs
                    </Message.Item>
                    <Message.Item>
                      During the Alpha (April/May), Yaybour will be working directly with home owners to post their jobs, which are dispatched through e-mail. This is to ensure adaquate information is provided for each job posting during the infancy stages of the app.  
                    </Message.Item>
                    <Message.Item>
                    Quoting and hiring will be done through the app. Therefore you must have an account in order to quote jobs.
                    </Message.Item>
                   
                  </Message.List>
                </Message>
              </div>
            ) : (
              <div>
                <Message>
                  <Message.Header>Join Alpha Now!</Message.Header>
                  <Message.List>
                    <Message.Item>
                      Select which industries that you may want work in
                    </Message.Item>
                    <Message.Item>
                      Be notified BEFORE we open a new job type (Decks) in your
                      industry (Carpentry) for a chance to subscribe.
                    </Message.Item>
                    <Message.Item>
                      Quote documented jobs sent to your e-mail
                    </Message.Item>
                    <Message.Item>
                      Unsubscribe links with each e-mail!
                    </Message.Item>
                  </Message.List>
                </Message>

                <Form
                  style={{ margin: "5px" }}
                  onSubmit={this.props.handleSubmit(this.handleSubmit)}
                >
             
                  <Field
                    name="first_name"
                    type="text"
                    component={TextInput}
                    placeholder="First Name"
                  />
                                    <Field
                    name="last_name"
                    type="text"
                    component={TextInput}
                    placeholder="Last Name"
                  />
        
                  <Field
                    name="email"
                    type="text"
                    component={TextInput}
                    placeholder="Email"
                  />

                  <Field
                    name="phone"
                    type="text"
                    component={TextInput}
                    placeholder="Phone"
                  />

                  <Form.Group inline>
                    <Field
                      name="renovations"
                      type="text"
                      label="Renovations"
                      component={Checkbox}
                      style={{ paddingRight: "20px", width: "150px" }}
                    />
                    <Field
                      name="newBuilds"
                      type="text"
                      label="New Builds"
                      component={Checkbox}
                      style={{ paddingRight: "20px", width: "150px" }}
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <Field
                      name="kitchenAndBath"
                      type="text"
                      label="Kitchen/Bath"
                      component={Checkbox}
                      style={{ paddingRight: "20px", width: "150px" }}
                    />

                    <Field
                      name="paint"
                      type="text"
                      label="Paint"
                      component={Checkbox}
                      style={{ paddingRight: "20px", width: "150px" }}
                    />
                  </Form.Group>

                  <Form.Group inline>
                    <Field
                      name="electrical"
                      type="text"
                      label="Electrical"
                      component={Checkbox}
                      style={{ paddingRight: "20px", width: "150px" }}
                    />
                    <Field
                      name="plumbing"
                      type="text"
                      label="Plumbing"
                      component={Checkbox}
                      style={{ paddingRight: "20px", width: "150px" }}
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <Field
                      name="landscaping"
                      type="text"
                      label="Landscaping"
                      component={Checkbox}
                      style={{ paddingRight: "20px", width: "150px" }}
                    />

                    <Field
                      name="exterior"
                      type="text"
                      label="Exterior"
                      component={Checkbox}
                      style={{ paddingRight: "20px", width: "150px" }}
                    />
                  </Form.Group>

                  <Form.Group inline>
                    <Field
                      name="design"
                      type="text"
                      label="Design"
                      component={Checkbox}
                      style={{ paddingRight: "20px", width: "150px" }}
                    />

                    <Field
                      name="other"
                      type="text"
                      label="Custom/Other"
                      component={Checkbox}
                      style={{ paddingRight: "20px", width: "150px" }}
                    />
                  </Form.Group>

                  <Button
                    loading={loading}
                    fluid
                    size="large"
                    positive
                    content="Join Alpha"
                  />
                </Form>
              </div>
            )}
          </div>
        </Grid.Column>
        <Grid.Column width={4} only="tablet" />
        <Grid.Column width={6} only="computer" />
      </Grid>
    );
  }
}

export default connect(
  null,
  actions
)(reduxForm({ form: "joinAlphaForm", enableReinitialize: true })(AboutAlpha));
