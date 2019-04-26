import React, { Component } from "react";
import { Message, Step, Form, Grid, Button } from "semantic-ui-react";
import { connect } from "react-redux";
import TextInput from "../../../app/common/form/TextInput";
import Checkbox from "../../../app/common/form/Checkbox";
import { Field, reduxForm } from "redux-form";
import { joinAlpha } from "../../user/userActions";
import {setRole} from '../Menus/roleActions'
const actions = { joinAlpha, setRole };

const mapState = state => {
  return {
    loading: state.async.loading,
    role: state.role,
    initialValues: state.firebase.auth ||{}
  };
};

class AboutAlpha extends Component {
  state = {
    showSuccess: false
  };

  handleSubmit = async values => {
    await this.props.joinAlpha(values);
   // await this.props.setRole( this.props.role.isAdmin, this.props.role.isOnboarder, true)
    this.setState({ showSuccess: true });
  };

  render() {
    const { loading, joinAlpha, role } = this.props ||{};
    const {authenticated} = role || {}
    const { showSuccess } = this.state;
    return (
      <Grid>
        <Grid.Column width={6} only="computer" />
        <Grid.Column width={4} only="tablet" />
        <Grid.Column mobile={16} tablet={8} computer={4}>
          <div style={{ padding: "10px", margin:10 }}>
            {showSuccess ? (
              <div>
                <Message>
                  <Message.Header>Smart move!</Message.Header>
                  <Message.List>
                    <Message.Item>
                      You will be notified by e-mail as we unlock jobs] types.
                    </Message.Item>
                    <Message.Item>
                      During the Alpha , Yaybour will be working directly with home owners to post their jobs, which are dispatched through e-mail. This is to ensure adaquate information is provided for each job posting during the infancy stages of the app.  
                    </Message.Item>
                    <Message.Item>
                    Quoting and hiring will be done through the app.  Payments and Ratings are not included.
                    </Message.Item>
                   
                  </Message.List>
                </Message>

                <Button color='green' size='large' fluid onClick={()=>this.props.history.push('/build')}>Go To App</Button>
              </div>
            ) : (
              <div>
                <Message>
                  <Message.Header>Join Alpha Now!</Message.Header>
                  <Message.List>
                    <Message.Item>
                      Select which industries that you want to be notified when jobs are unlocked.
                    </Message.Item>
        
                    <Message.Item>
                      Receive properly photographed, measured, and documented jobs sent to your e-mail.
                    </Message.Item>
                    <Message.Item>
                      All services are free during Alpha.  
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
                    disabled={!this.props.role.authenticated}
                    size="large"
                    positive
                    content={(!this.props.role.authenticated)?"Login to Join" :"Join Alpha"}
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
  mapState,
  actions
)(reduxForm({ form: "joinAlphaForm", enableReinitialize: true })(AboutAlpha));
