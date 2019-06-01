import React, { Component } from "react";
import {
  Form,
  Label,
  Select,
  Dropdown,
  Grid,
  Image,
  Header,
  Button
} from "semantic-ui-react";

import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

const query = ({ fieldId }) => {
  return [
    {
      collection: "items",

      storeAs: "all_items"
    }
  ];
};

const mapState = (state, ownProps) => {
  return {
    itemsInField:
      state.firestore.ordered.all_items &&
      state.firestore.ordered.all_items.filter(
        item => item.fieldId === ownProps.fieldId
      )
  };
};
const dropdownItem = (
  state,
  productName,
  price,
  productDescription,
  itemPhotoUrl,
  pricingUnit,
  productInventory,
  productPage,
  companyUrl,
  storeName,
  storePhoneNumber,
  storePhotoUrl,
  storeUrl,
  venue,
  venueLatLng
) => {
  return (
    <div style={{ width: "300px", height: 130, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        {" "}
        <Image
          style={{ height: "100px", maxWidth: "100px" }}
          src={ state.showStoreInfo?storePhotoUrl : itemPhotoUrl}
        />
      </div>

      {state.showOverview&&<div style={{ position: "absolute", left: 110, top: 0 }}>
        <Header>{productName}</Header>
      </div>}

      {state.showOverview&& <div style={{ position: "absolute", left: 110, top: 30 }}>
        <Header color='green'>{price}</Header>
      </div>}

      {state.showProductInfo&& <div
        style={{
          position: "absolute",
          left: 110,
          top: 0,
          whiteSpace: "normal",
          width: "200",
          height: 120,
          overflowX: "hidden",
          overflowY: "auto"
        }}
      >
        {productDescription}{" "}
      </div>}

      
    </div>
  );
};
const renderOptions = (options,state) => {
  let newOptions = [];
  for (var i = 0; i < (options&&options.length); i++) {
    let option = options[i];
    const {
      itemPhotoUrl,
      name,
      price,
      pricingUnit,
      productDescription,
      productInventory,
      productName,
      productPage,
      supplierData
    } = option || {};

    const {
      city,
      companyUrl,
      storeName,
      storePhoneNumber,
      storePhotoUrl,
      storeUrl,
      venue,
      venueLatLng
    } = options || {};

    let newOption = {
      key: option.itemId,
      text: option.productName,
      value: `material_${option.itemId}`,
      content: dropdownItem(
        state,
        productName,
        price,
        productDescription,
        itemPhotoUrl,
        pricingUnit,
        productInventory,
        productPage,
        companyUrl,
        storeName,
        storePhoneNumber,
        storePhotoUrl,
        storeUrl,
        venue,
        venueLatLng
      )
    };

    newOptions.push(newOption);
  }
  console.log("newOptions", newOptions);
  return newOptions;
};

class DropdownInput extends Component {
  state = {
    itemsInField: [],
    showOverview: true,
    showProductInfo: false,
    showStoreInfo:false
  };

  render() {
    const {
      input,
      type,
      placeholder,
      multiple,
      options,
      fieldId,
      meta: { touched, error }
    } = this.props || {};
    return (
      <Form.Field error={touched && !!error}>
        <Dropdown
          scrolling
          value={input.value || null}
          onChange={(e, data) => input.onChange(data.value)}
          placeholder={placeholder}
          options={renderOptions(this.props.itemsInField, this.state)}
          multiple={multiple}
          fluid
        />
        {touched && error && (
          <Label basic color="red">
            {error}
          </Label>
        )}
      </Form.Field>
    );
  }
}

export default connect(
  mapState,
  null
)(firestoreConnect(props => query(props))(DropdownInput));
