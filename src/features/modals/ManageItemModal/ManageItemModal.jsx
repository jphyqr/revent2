import React, { Component } from "react";
import { Modal, Image, Form, Button,Label, Divider } from "semantic-ui-react";
import { closeModal } from "../modalActions";
import { connect } from "react-redux";
import PhotoUpload from "../../../app/common/form/PhotoUpload/PhotoUpload";
import { Field, reduxForm } from "redux-form";
import TextInput from "../../../app/common/form/TextInput";
import TextArea from "../../../app/common/form/TextArea";
import SelectInput from "../../../app/common/form/SelectInput";

import {updateItemPhoto, updateItemValues} from '../../job/JobDashboard/SupplierDashboard/itemActions'
const actions = {
  closeModal,updateItemPhoto,updateItemValues
 
};

const mapState = state => {
  return {
    loading: state.async.loading,
    item: state.item
    ,
    initialValues:
      state.item
  };
};



class ManageItemModal extends Component {

    handlePhotoUploaded = async file => {
        await this.props.updateItemPhoto(this.props.item, file);
        //this.setState({ exampleURL: exampleURL });
        //this.setState({ examplePhotoHasUpdated: true });
      };

    handleSubmit = async (values) =>{
        await this.props.updateItemValues(this.props.item, values);
    

    
    }
  render() {
    const { closeModal, loading, item } = this.props || {};
    const {name, pricingUnit, itemPhotoUrl }= item || {}
    const {specs} = item || []
    
    return (
      <Modal closeIcon="close" open={true} onClose={closeModal}>
        <Modal.Header>{name}</Modal.Header>
        <Modal.Content style={{width:"auto"}}>
          <Modal.Description>
            <Form onSubmit={this.props.handleSubmit(this.handleSubmit)}>
            <Form.Group inline> 
            <Field
                    name="price"
                    type="text"
                    
                    component={TextInput}
                    
                    placeholder="Price"
                  />
                  <Label>{pricingUnit}</Label>
                  </Form.Group>


            {specs&&specs.map(spec=>(
                              <Field
                            
                              key={`${spec.specName}`}
                              name={`${spec.specName}`}
                              type="text"
                              options={spec.items}
                              component={SelectInput}
                              placeholder={`${spec.specName}`}
                            />

            ))}

<Field
                    name="productName"
                    type="text"
                    
                    component={TextInput}
                    placeholder="Product Name"
                  />            
           
            <Field
                    name="productDescription"
                    type="text"
                    
                    component={TextArea}
                    rows={3}
                    placeholder="Product Description"
                  /> 
                  
                  <Field
                    name="productPage"
                    type="text"
                    
                    component={TextInput}
                    
                    placeholder="Product Website"
                  />

                  <Field
                    name="productInventory"
                    type="text"
                    
                    component={TextInput}
                    placeholder="Inventory"
                  />              
              <PhotoUpload handlePhotoUploaded={this.handlePhotoUploaded} />
              {itemPhotoUrl && (
                <Image size="small" src={itemPhotoUrl || "/assets/user.png"} />
              )}
            
              <Button
                loading={loading}
                size="large"
                positive
                content="Update Item"
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default connect(
  mapState,
  actions
)(reduxForm({ form: "itemForm", enableReinitialize: true })(ManageItemModal));
