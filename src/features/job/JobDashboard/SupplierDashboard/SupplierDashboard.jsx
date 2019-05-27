import React, { Component } from "react";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";
import IsleList from "./IsleList";
import MyItems from "./MyItems";
import NavBar from "./NavBar";
import SupplierProfile from "./SupplierProfile/SupplierProfile";
import { firestoreConnect, isLoaded } from "react-redux-firebase"; //even though we using firestore this gives our binding
import { openModal } from "../../../modals/modalActions";
import { toastr } from "react-redux-toastr";
import { createItem, deleteItem, editItem } from "./itemActions";
import {
  Segment,
  Form,
  Button,
  Grid,
  Header,
  Image,
  Icon,
  Label,
  Dropdown,
  Loader,
  Transition
} from "semantic-ui-react";

const query = ({ auth }) => {
  const authenticated = auth.isLoaded && !auth.isEmpty;

  return [
    {
      collection: "supplier_users",
      doc: auth.uid,
      storeAs: "supplier_profile"
    }
  ];
};

const mapState = state => {
  return {
    isles: state.firestore.ordered.isles,
    auth: state.firebase.auth,
    role: state.role,
    loading: state.async.loading,

    supplierProfile:
      (state.firestore.ordered.supplier_profile &&
        state.firestore.ordered.supplier_profile[0]) ||
      {}
  };
};

const actions = { createItem, openModal, deleteItem, editItem };
class SupplierDashboard extends Component {
  state = { selectedIsle: "", navShow: "profile" };

  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`isles`);
  }

  async componentDidMount() {
    const { firestore } = this.props || {};
    await firestore.setListener(`isles`);
  }

  handleCreateItem = async id => {
    await this.props.createItem(id);
    this.props.openModal("ManageItemModal");
  };

  handleEditItem = async item => {
    await this.props.editItem(item);
    this.props.openModal("ManageItemModal");
  };

  handleDeleteItem = async item => {
    toastr.confirm("This will remove item permenatly.", {
      onOk: async () => await this.props.deleteItem(item)
    });
  };

  handleSelectTab = tab => {
    const { role } = this.props;
    //CHECK ROLE FOR SUPPLIER PROFILE CREATED?
    // if((tab==="stats"||tab==="profile" ||tab==="supporters")&&!authenticated)
    //   {
    //    this.props.openModal("RegisterModal")
    //  }else{
    this.setState({ navShow: tab, showExpanded: false });
    //  }
  };

  handleRenderList = isles => {
    let item;
    let list = [];
    isles &&
      isles.map(isle =>
        list.push({
          key: isle.id,
          text: isle.name,
          value: isle.id
        })
      );

    return list;
  };

  handleChange = (e, { value }) => {
    this.setState({ selectedIsle: value });
  };
  render() {
    const {
      compactDisplayMode,
      isles,
      auth,
      role,
      supplierProfile,
      openModal
    } = this.props;
    const { navShow } = this.state;
    const list = this.handleRenderList(isles);
    return (
      <div
        style={{
          width: "100%",
          height: compactDisplayMode ? "300px" : "500px",
          backgroundColor: "lightgrey",
          overflowX: "hidden",
          overflowY: "auto"

          // position: "relative"
        }}
      >
        <NavBar
          compactDisplayMode={compactDisplayMode}
          role={role}
          handleSelectTab={this.handleSelectTab}
          navShow={this.state.navShow}
        />
        {this.state.loading ? (
          <Loader active inline="centered" />
        ) : navShow === "profile" ? (
          <SupplierProfile
            openModal={openModal}
            compactDisplayMode
            supplierProfile={supplierProfile}
          />
        ) : navShow === "markets" ? (
          <div>
            <Dropdown
              placeholder="Select Isle"
              fluid
              selection
              options={list}
              onChange={this.handleChange}
            />

            <IsleList
              handleCreateItem={this.handleCreateItem}
              selectedIsle={this.state.selectedIsle}
            />
          </div>
        ) : navShow === "listings" ? (
          <div>
            <MyItems
              selectedIsle={this.state.selectedIsle}
              auth={auth}
              handleDeleteItem={this.handleDeleteItem}
              handleEditItem={this.handleEditItem}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default withFirestore(
  connect(
    mapState,
    actions
  )(firestoreConnect(props => query(props))(SupplierDashboard))
);
