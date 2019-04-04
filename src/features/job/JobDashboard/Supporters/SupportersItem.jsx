import React, { Component } from "react";
import { Grid, Button, Input,Dropdown, Checkbox,  } from "semantic-ui-react";
import { toastr } from "react-redux-toastr";
import TextInput from '../../../../app/common/form/TextInput'

class SupportersItem extends Component {
  state = { isAContractor: false, isAChampion:false, isASupplier:false, value: "", editContact:false };

  toggleContractor = async () => {
    await this.setState({ isAContractor: !this.state.isAContractor });
    await this.props.toggleContractor(
      this.props.supporter.key,
      this.state.isAContractor
    );
  };

  toggleSupplier = async () => {
    await this.setState({ isASupplier: !this.state.isASupplier });
    await this.props.toggleSupplier(
      this.props.supporter.key,
      this.state.isASupplier
    );
  };

  toggleChampion = async () => {
    await this.setState({ isAChampion: !this.state.isAChampion });
    await this.props.toggleChampion(
      this.props.supporter.key,
      this.state.isAChampion
    );
  };

  componentDidMount() {
    const { supporter } = this.props || {};
    const { value } = supporter || {};
    const { isAContractor, isASupplier, isAChampion, industry } = value || {};

    this.setState({ isASupplier:isASupplier, isAChampion:isAChampion, isAContractor: isAContractor, industry: industry });
  }

  componentWillReceiveProps = nextProps => {
    const { supporter } = nextProps || {};
    const { value } = supporter || {};
    const { isAContractor, isASupplier, isAChampion, industry } = value || {};
    this.setState({ isASupplier:isASupplier, isAChampion:isAChampion, isAContractor: isAContractor, industry: industry });
  };

  handleSelectIndustry = async (e, { value }) => {
    await this.setState({ industry: value });
    await this.props.selectIndustry(
      this.props.supporter.key,
      this.state.industry
    );
  };

  handleDelete = async (id, supporterValues) => {
    const message = `Are you sure you want to delete ${supporterValues.email}`;
    toastr.confirm(message, {
      onOk: async () => {
        //  if(this.props.labour_profile===null){

        await this.props.deleteSupporter(id);

        //  }
        // this.props.goBackToStep(this.state.quote, step)
      }
    });
  };

  render() {
    const { supporter, deleteSupporter, toggleContractor } = this.props;
    const { key: id, value: supporterValues } = supporter;
    return (
      <div
        style={{
          width: "100%",
          borderRadius: "5px",
          backgroundColor: "white",
          marginBottom: 5
        }}
      >
        <Grid>
          <Grid.Column
            width={4}
            style={{
              textAlign: "left",
              width: "100%",
              height: "auto",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden"
            }}
          >
            {" "}
            {supporterValues.email}
          </Grid.Column>

          <Grid.Column width={1}>
            {" "}
         
              <Button
                basic
                color="red"
                onClick={() => this.handleDelete(id, supporterValues)}
                size="mini"
              >
                X
              </Button>
          
          </Grid.Column>
          <Grid.Column width={4}>
            {" "}
            <Dropdown
            fluid
              placeholder="Industry"
              value={this.state.industry}
              selection
              search
              onChange={this.handleSelectIndustry}
              options={this.props.industries}
            />
          </Grid.Column>
          <Grid.Column width={1}>
            <Checkbox
              onChange={this.toggleContractor}
              checked={this.state.isAContractor}
            />
          </Grid.Column>
          <Grid.Column width={1}>
            <Checkbox
                 onChange={this.toggleSupplier}
                 checked={this.state.isASupplier}
            />
          </Grid.Column>
          <Grid.Column width={1}>
            <Checkbox
                 onChange={this.toggleChampion}
                 checked={this.state.isAChampion}
            />
          </Grid.Column>
          <Grid.Column width={1}>
            {supporterValues.interest === "followUp"
              ? "follow"
              : supporterValues.interest === "beta"
              ? "beta"
              : null}
          </Grid.Column>
          <Grid.Column width={3} />
        </Grid>
      </div>
    );
  }
}

export default SupportersItem;
