import React, { Component } from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { Button, Checkbox, Table } from "semantic-ui-react";

const query = ({ auth, selectedIsle }) => {
  return [
    {
      collection: "items",
      where: [["supplierUid", "==", `${auth.uid}`]],
      orderBy: ["name", "asc"],
      storeAs: "items_for_user"
    }
  ];
};

const mapState = state => {
  return {
    itemsForUser: state.firestore.ordered.items_for_user
  };
};

class MyItems extends Component {
  render() {
    const { itemsForUser, compactDisplayMode } = this.props || [];
    return (
      <div
        style={{
         
          width: "100%",
          height: 400,
          overflowX: "hidden",
          overflowY: "auto"
        }}
      >
        <Table compact collapsing celled definition unstackable>
          <Table.Header>
            <Table.Row>
            {!compactDisplayMode&& <Table.HeaderCell />}
        <Table.HeaderCell />
              <Table.HeaderCell>Name</Table.HeaderCell>
              {!compactDisplayMode&&<Table.HeaderCell>Inventory</Table.HeaderCell>}
            <Table.HeaderCell>Price</Table.HeaderCell>
              {!compactDisplayMode&& <Table.HeaderCell>Units</Table.HeaderCell>}
              <Table.HeaderCell>Live</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {itemsForUser &&
              itemsForUser.map(item => (
                <Table.Row >
                 {!compactDisplayMode&&    <Table.Cell collapsing>
                    <Button
                      size="mini"
                      negative
                      onClick={() => this.props.handleDeleteItem(item)}
                    >
                      X
                    </Button>
                  </Table.Cell>}
                <Table.Cell collapsing>
                    <Button
                      size="mini"
                      onClick={() => this.props.handleEditItem(item)}
         
                    >
                      edit
                    </Button>
                  </Table.Cell>
                  <Table.Cell>{item.productName || "no name"}</Table.Cell>
                  {!compactDisplayMode&&  <Table.Cell>{item.productInventory || "N/A"}</Table.Cell>}
             <Table.Cell>{item.price || "N/A"}</Table.Cell>
                 {!compactDisplayMode&&  <Table.Cell>{item.pricingUnit || "N/A"}</Table.Cell>}
                  <Table.Cell>
                    {" "}
                    <Checkbox slider />
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

export default connect(
  mapState,
  null
)(firestoreConnect(props => query(props))(MyItems));
