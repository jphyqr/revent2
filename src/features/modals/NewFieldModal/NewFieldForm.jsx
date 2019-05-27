import React, { Component } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
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
  Transition
} from "semantic-ui-react";
import {
  composeValidators,
  combineValidators,
  isRequired,
  hasLengthGreaterThan,
  hasLengthLessThan,
  isNumeric,
  isAlphabetic
} from "revalidate";
import {
  updateField,
  createField,
  addSpec,
  updateSpecItems,
  deleteItemFromSpec,
  deleteSpec
} from "./fieldActions";
import TextInput from "../../../app/common/form/TextInput";
import PhotoUpload from "../../../app/common/form/PhotoUpload/PhotoUpload";

import SelectInput from "../../../app/common/form/SelectInput";
import _ from "lodash";
import Checkbox from "../../../app/common/form/Checkbox";
import SelectManager from "./SelectManager";
import RadioInput from "../../../app/common/form/RadioInput";
import { withFirestore } from "react-redux-firebase";
import { icons } from "../../../app/data/icons";
import IconSlider from "./IconSlider";
import ExamplePhotoItem from "./ExamplePhotoItem";
import { keyframes } from "popmotion";
const mapState = state => {
  let field = {};

  if (!_.isEmpty(state.field)) {
    field = state.field;
  }

  return {
    initialValues:
      state.field && state.field.payload && state.field.payload.value, //&&state.field.values,
    field: state.field,
    loading: state.async.loading,
    isles: state.firestore.ordered.isles,
  };
};

const actions = {
  updateField,
  createField,
  addSpec,
  updateSpecItems,
  deleteItemFromSpec,
  deleteSpec
};

const types = [
  { key: "text", text: "text", value: "text" },
  { key: "submit", text: "submit", value: "submit" }
];

const renderLabel = label => ({
  color: "blue",
  content: `Customized label - ${label.text}`,
  icon: "check"
});

const dropdownItem = (name, price, notes, image) => {
  return (
    <div>
      <Grid>
        <Grid.Column width={4}>
          <Image style={{ height: "200px", maxWidth: "200px" }} src={image} />
        </Grid.Column>
        <Grid.Column width={12}>
          <Grid.Row>
            <Header>{name}</Header>
          </Grid.Row>
          <Grid.Row>
            <Header>{price}</Header>
          </Grid.Row>
          <Grid.Row> {notes} </Grid.Row>
        </Grid.Column>
      </Grid>
    </div>
  );
};

const isles = [
  { key: "lumber", text: "lumber", value: "lumber" },
  { key: "concrete", text: "concrete", value: "concrete" },
  { key: "fasteners", text: "fasteners", value: "fasteners" },
  { key: "drywall", text: "drywall", value: "drywall" },
  { key: "insulation", text: "insulation", value: "insulation" },
  { key: "exterior", text: "exterior", value: "exterior" },
  { key: "plumbing", text: "plumbing", value: "plumbing" },
  { key: "electrical", text: "electrical", value: "electrical" },
  { key: "tools", text: "tools", value: "tools" },
  { key: "doors", text: "doors", value: "doors" },
  { key: "windows", text: "windows", value: "windows" },
  { key: "tile", text: "tile", value: "tile" },
  { key: "flooring", text: "flooring", value: "flooring" }
];

const pricedBy = [
  { key: "unit", text: "unit", value: "unit" },
  { key: "square ft", text: "square ft", value: "square ft" },
  { key: "linear ft", text: "linear ft", value: "linear ft" },
  { key: "cubic ft", text: "cubic ft", value: "cubic ft" },
  { key: "lb", text: "lb", value: "lb" },
  { key: "board ft", text: "board ft", value: "board ft" },
]

const test = [
  {
    key: "tin",
    text: "Tin $19.50/lf",
    value: "tin",
    content: dropdownItem("Tin", "$19.50/lf")
  }
];

const components = [
  {
    key: "Checkbox",
    text: "Checkbox",
    value: { component: "Checkbox", type: "checkbox" }
  },
  {
    key: "DateInput",
    text: "DateInput",
    value: { component: "DateInput", type: "text" }
  },
  {
    key: "PlaceInput",
    text: "PlaceInput",
    value: { component: "PlaceInput", type: "text" }
  },
  {
    key: "RadioInput",
    text: "RadioInput",
    value: { component: "RadioInput", type: "radio" }
  },
  {
    key: "SelectInput",
    text: "SelectInput",
    value: { component: "SelectInput", type: "text" }
  },
  {
    key: "TextInput",
    text: "TextInput",
    value: { component: "TextInput", type: "text" }
  },
  {
    key: "TextBox",
    text: "TextBox",
    value: { component: "TextBox", type: "text" }
  },
  {
    key: "PhotoInput",
    text: "PhotoInput",
    value: { component: "PhotoInput", type: "text" }
  },
  {
    key: "DropownInput",
    text: "DropdownInput",
    value: { component: "DropdownInput", type: "text" }
  }
];

const validate = combineValidators({
  component: isRequired({ message: "Please provide a component type" }),
  format: isRequired({ message: "Please select a format" }),
  minLength: composeValidators(
    isRequired({ message: "Min Length is Required" }),
    isNumeric({ message: "Should be Numeric" })
  )(),
  maxLength: composeValidators(
    isRequired({ message: "Max Length is Required" }),
    isNumeric({ message: "Should be Numeric" })
  )(),
  name: composeValidators(isRequired({ message: "A name is required" }))(),
  rows: composeValidators(
    isRequired({ message: "Rows Required" }),
    isNumeric({ message: "Should be Numeric" })
  )()
});

class NewFieldForm extends Component {
  state = {
    selectedSpecIndex: 0,
    results: icons,
    value: "",
    currentField: {},
    customSpecs: 0,
    example: false,
    examplePhotos: [],
    isMaterial: false,
    selectKey: "",
    selectText: "",
    selectValue: "",
    selectItems: [],
    dropdownKey: "",
    dropdownText: "",
    dropdownValue: "",
    dropdownPrice: "",
    dropdownImage: "",
    dropdownNotes: "",

    radioValue: "",
    radioItems: [],
    fieldChanged: false,
    isleId: ""
    // selectedIcon: field&&field.icon
  };

  componentWillReceiveProps = nextProps => {
    if (nextProps.examplePhotoHasUpdated) {
      console.log("example photo Updated", nextProps);
      this.setState({ examplePhotos: nextProps.examplePhotos, });
      this.props.handleUpdatedExamplePhoto();
      this.setState({ showExampleUploaded: false });
    }

    if (nextProps.selectedField !== this.state.currentField) {
      console.log({ nextProps });
      this.setState({
        currentField: nextProps.selectedField,

        value: (nextProps.selectedField && nextProps.selectedField.icon) || "",
        example:
          (nextProps.selectedField && nextProps.selectedField.example) || false,
        examplePhotos: nextProps.selectedField.examplePhotos || [],
        selectedIcon:
          (nextProps.selectedField && nextProps.selectedField.icon) || "add",
        selectItems:
          (nextProps.selectedField && nextProps.selectedField.selectItems) ||
          [],

        radioItems:
          (nextProps.radioedField && nextProps.radioedField.radioItems) || [],
        selectedComponent:
          (nextProps.selectedField &&
            nextProps.selectedField.component &&
            nextProps.selectedField.component.component) ||
          "TextInput",

        isMaterial:
          (nextProps.selectedField && nextProps.selectedField.isMaterial) ||
          false,
          isleId: nextProps.selectedField.isleId||"",
        customSpecs:
          (nextProps.selectedField && nextProps.selectedField.customSpecs) || 0
      });

      this.forceUpdate();
    }
  }; 
  
  async componentWillUnmount() {
    const { firestore } = this.props;
    await firestore.unsetListener(`isles`);
  }

  async componentDidMount() {
    const { firestore } = this.props ||{};
    await firestore.setListener(`isles`);
    this.setState({
      currentField: this.props.selectedField,

      value: this.props.selectedField.icon,
      example: this.props.selectedField.example || false,
      examplePhotos: this.props.selectedField.examplePhotos || [],
      selectedIcon: this.props.selectedField.icon,
      selectItems:
        (this.props.selectedField && this.props.selectedField.selectItems) ||
        [],

      radioItems:
        (this.props.radioedField && this.props.radioedField.radioItems) || [],
      selectedComponent:
        (this.props.selectedField && this.props.selectedField.component) ||
        "TextInput",

      isMaterial:
        (this.props.selectedField && this.props.selectedField.isMaterial) ||
        false,
        isleId: this.props.field.payload.value.isleId||"",
      customSpecs:
        (this.props.selectedField && this.props.selectedField.isMaterial) || 0
    });
  }




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
  resetComponent = () =>
    this.setState({ isLoading: false, results: icons, value: "" });

  handleUpdatePhotoDescription = (index, description) => {
    let photos = this.state.examplePhotos;
    photos[index].description = description;
    this.setState({ examplePhotos: photos, fieldChanged: true });
  };

  handleUpdatePhotoTitle = (index, title) => {
    console.log("handleUpdatePhotoTitle index", index);
    console.log("handleUpdatePhotoTitle title", title);
    let photos = this.state.examplePhotos;
    photos[index].title = title;
    this.setState({ examplePhotos: photos, fieldChanged: true });
  };

  handleSelectSpecToExpand = index => {
    this.setState({ selectedSpecIndex: index });
  };

  handleComponentSelect = (e, { value }) => {
    this.setState({ selectedComponent: e.component });
  };
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = result => re.test(result.className);

      this.setState({
        isLoading: false,
        results: _.filter(icons, isMatch)
      });
    }, 300);
  };
  handleSelectSubmit = () => {
    const { selectKey, selectText, selectValue, selectItems } = this.state;
    let newItem = { key: selectKey, text: selectText, value: selectValue };
    let items = selectItems;
    items.push(newItem);
    this.setState({
      selectItems: items,
      selectKey: "",
      selectText: "",
      selectValue: ""
    });
  };

  handleSpecSubmit = async values => {
    await this.props.addSpec(
      this.state.currentField,
      this.props.field.payload.key,
      values
    );
  };

  handleDeleteSpec = async (index) =>{
    await this.props.deleteSpec(
      this.state.currentField,
      this.props.field.payload.key,
      index
    ); 
  }

  handleDeleteItemFromSpec = async (specIndex, itemIndex) => {
    await this.props.deleteItemFromSpec(
      this.state.currentField,
      this.props.field.payload.key,
      specIndex,
      itemIndex
    );
  };

  handleUpdateSpecItems = async (index, items) => {
    await this.props.updateSpecItems(
      this.state.currentField,
      this.props.field.payload.key,
      index,
      items
    );
  };

  handleDropdownSubmit = () => {
    const {
      dropdownKey,
      dropdownText,
      selectItems,
      dropdownValue,

      dropdownImage,
      dropdownNotes,
      dropdownPrice
    } = this.state;
    let newItem = {
      key: dropdownKey,
      text: dropdownText,
      value: dropdownValue,
      price: dropdownPrice,
      notes: dropdownNotes,
      image: dropdownImage
    };
    let items = selectItems;
    items.push(newItem);
    this.setState({
      selectItems: items,
      dropdownKey: "",
      dropdownText: "",
      dropdownValue: "",
      dropdownNotes: "",
      dropdownImage: "",
      dropdownPrice: ""
    });
  };

  toggleMaterial = () => {
    this.setState({ isMaterial: !this.state.isMaterial });

    
  };

  handleRadioSubmit = () => {
    const { radioValue, radioItems } = this.state;
    let items = radioItems;
    items.push(radioValue);
    this.setState({ radioItems: items, radioValue: "" });
  };

  handleUnitsChanged = e => {
    this.setState({ units: !this.state.units });
  };

  handleExampleChange = e => {
    this.setState({ example: !this.state.example });
  };
  onFormSubmit = async values => {


    const { selectedIcon, example, selectItems } = this.state;
    if (this.props.initialValues) {
      
      console.log("updated");
      await this.props.updateField(
        values,
        this.props.field.payload.key,
        example,
        selectItems
      );
    } else {
      console.log("created");
      this.props.createField(values, selectedIcon, example, selectItems);
    }

    this.setState({
      results: icons,
      value: "",
      currentField: {},
      example: false,
      units: false,
      selectKey: "",
      selectText: "",
      selectValue: "",
      selectItems: [],
      radioValue: "",
      radioItems: [],
      fieldChanged: false
    });
  };

  handleSelectIcon = icon => {
    console.log("selected", icon);
    this.setState({ selectedIcon: icon });
  };

  handleOnMouseLeave = icon => {
    this.setState({ hoveredIcon: "" });
  };
  handleOnMouseEnter = icon => {
    this.setState({ hoveredIcon: icon });
  };

handleIsleSelect = e => {
  this.setState({isleId: e.target.value})
}

  render() {
    const { invalid, submitting, pristine, loading, field , isles} = this.props || {};

    const { fieldChanged, currentField } = this.state;
    const { specs } = currentField || [];

    const list = this.handleRenderList(isles);
    return (
      <div>
        <Button positive onClick={() => this.props.toggleEdit(false)}>
          BACK TO TASK
        </Button>
        {/* 
        <IconSlider
          icons={this.state.results}
          currentField={this.state.currentField}
          hoveredIcon={this.state.hoveredIcon}
          handleOnMouseLeave={this.handleOnMouseLeave}
          handleOnMouseEnter={this.handleOnMouseEnter}
          handleSelectIcon={this.handleSelectIcon}
          selectedIcon={this.state.selectedIcon}
          value={this.state.value}
          handleSearchChange={this.handleSearchChange}
        /> */}

        <Header sub color="teal" content="Field Details" />

        <Form onSubmit={this.props.handleSubmit(this.onFormSubmit)}>
          <Form.Group inline>
            <Field
              name="name"
              type="text"
              component={TextInput}
              placeholder="Name"
            />

            <Field
              name="errorMessage"
              type="text"
              component={TextInput}
              placeholder="Error Message"
            />

            <Field
              name="isMaterial"
              type="checkbox"
              //   checked={this.state.example}
              //    value={this.state.example}
              onClick={this.toggleMaterial}
              label="Is material"
              component={Checkbox}
            />
          </Form.Group>

          <Transition.Group animation="slide down" duration={300}>
            {this.state.isMaterial ? (
              <div>
                <Form.Group inline>
                  <Field
                    name="isleId"
                    type="text"
                    component={SelectInput}
                    options={list}
                    placeholder="Isle"
                  />


<Field
                    name="pricingUnit"
                    type="text"
                    component={SelectInput}
                    onChange={this.handleComponentSelect}
                    options={pricedBy}
                    placeholder="Priced By"
                  />
            
          <Button
            disabled={invalid || submitting || (pristine && !fieldChanged)}
            positive
            loading={loading}
            type="submit"
          >
            Update
          </Button>
                </Form.Group>

                <SelectManager
                handleDeleteSpec={this.handleDeleteSpec}
                  specs={specs}
                  selectedSpecIndex={this.state.selectedSpecIndex}
                  handleSelectSpecToExpand={this.handleSelectSpecToExpand}
                  handleDeleteItemFromSpec={this.handleDeleteItemFromSpec}
                  handleUpdateSpecItems={this.handleUpdateSpecItems}
                  handleSpecSubmit={this.handleSpecSubmit}
                />
              </div>
            ) : (
              <div>
                <Form.Group inline>
                  <Field
                    name="component"
                    type="text"
                    component={SelectInput}
                    onChange={this.handleComponentSelect}
                    options={components}
                    placeholder="Select Component Type"
                  />

                  {this.state.selectedComponent === "TextBox" && (
                    <label>
                      <Field
                        name="rows"
                        type="text"
                        component={TextInput}
                        placeholder="Enter Number of Rows"
                      />
                    </label>
                  )}

                  {this.state.selectedComponent === "TextInput" && (
                    <Form.Group inline>
                      min:{" "}
                      <Field
                        name="minLength"
                        type="text"
                        component={TextInput}
                        placeholder="Min Length"
                      />
                      max:{" "}
                      <Field
                        name="maxLength"
                        type="text"
                        component={TextInput}
                        placeholder="Max Length"
                      />
                    </Form.Group>
                  )}

                  {this.state.selectedComponent === "RadioInput" && (
                    <Grid>
                      <Grid.Column width={8}>
                        <div>
                          value
                          <input
                            value={this.state.radioValue}
                            onChange={e =>
                              this.setState({ radioValue: e.target.value })
                            }
                          />
                          <Icon
                            name="add"
                            onClick={() => this.handleRadioSubmit()}
                          />
                        </div>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <div
                          style={{
                            height: 100,
                            backgroundColor: "grey",
                            overflowX: "hidden",
                            overflowY: "auto",
                            position: "relative"
                          }}
                        >
                          {this.state.radioItems &&
                            this.state.radioItems.map(item => (
                              <div>
                                <label> VALUE </label>
                                {item}
                              </div>
                            ))}
                        </div>
                      </Grid.Column>
                    </Grid>
                  )}

                  {this.state.selectedComponent === "DropdownInput" && (
                    <Grid>
                      <Grid.Column width={8}>
                        <div>
                          key
                          <input
                            value={this.state.dropdownKey}
                            onChange={e =>
                              this.setState({ dropdownKey: e.target.value })
                            }
                          />
                          text
                          <input
                            value={this.state.dropdownText}
                            onChange={e =>
                              this.setState({ dropdownText: e.target.value })
                            }
                          />
                          value
                          <input
                            value={this.state.dropdownValue}
                            onChange={e =>
                              this.setState({ dropdownValue: e.target.value })
                            }
                          />
                          image
                          <input
                            value={this.state.dropdownImage}
                            onChange={e =>
                              this.setState({ dropdownImage: e.target.value })
                            }
                          />
                          price
                          <input
                            value={this.state.dropdownPrice}
                            onChange={e =>
                              this.setState({ dropdownPrice: e.target.value })
                            }
                          />
                          notes
                          <input
                            value={this.state.dropdownNotes}
                            onChange={e =>
                              this.setState({ dropdownNotes: e.target.value })
                            }
                          />
                          <Icon
                            name="add"
                            onClick={() => this.handleDropdownSubmit()}
                          />
                        </div>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <div
                          style={{
                            height: 200,
                            backgroundColor: "grey",
                            overflowX: "hidden",
                            overflowY: "auto",
                            position: "relative"
                          }}
                        >
                          {this.state.selectItems &&
                            this.state.selectItems.map(item => (
                              <div>
                                <label>KEY </label> {item.key}
                                <label> TEXT </label> {item.text}
                                <label> VALUE </label>
                                {item.value}
                                <label> IMAGE </label>
                                <image
                                  style={{ height: 50, width: 50 }}
                                  src={item.image}
                                />
                                <label> NOTES </label>
                                {item.notes}
                                <label> PRICE </label>
                                {item.price}
                              </div>
                            ))}
                        </div>
                      </Grid.Column>
                    </Grid>
                  )}

                  {this.state.selectedComponent === "SelectInput" && (
                    <Grid>
                      <Grid.Column width={8}>
                        <div>
                          key
                          <input
                            value={this.state.selectKey}
                            onChange={e =>
                              this.setState({ selectKey: e.target.value })
                            }
                          />
                          text
                          <input
                            value={this.state.selectText}
                            onChange={e =>
                              this.setState({ selectText: e.target.value })
                            }
                          />
                          value
                          <input
                            value={this.state.selectValue}
                            onChange={e =>
                              this.setState({ selectValue: e.target.value })
                            }
                          />
                          <Icon
                            name="add"
                            onClick={() => this.handleSelectSubmit()}
                          />
                        </div>
                      </Grid.Column>
                      <Grid.Column width={8}>
                        <div
                          style={{
                            height: 200,
                            backgroundColor: "grey",
                            overflowX: "hidden",
                            overflowY: "auto",
                            position: "relative"
                          }}
                        >
                          {this.state.selectItems &&
                            this.state.selectItems.map(item => (
                              <div>
                                <label>KEY </label> {item.key}
                                <label> TEXT </label> {item.text}
                                <label> VALUE </label>
                                {item.value}
                              </div>
                            ))}
                        </div>
                      </Grid.Column>
                    </Grid>
                  )}
                </Form.Group>

                {(this.state.selectedComponent === "TextInput" ||
                  this.state.selectedComponent === "TextBox") && (
                  <Form.Group inline>
                    <Field
                      name="format"
                      type="radio"
                      value="none"
                      label="No Format"
                      component={RadioInput}
                    />
                    <Field
                      name="format"
                      type="radio"
                      value="numeric"
                      label="Numeric"
                      component={RadioInput}
                    />
                    <Field
                      name="format"
                      type="radio"
                      value="alphabetic"
                      label="Alphabetic"
                      component={RadioInput}
                    />
                    <Field
                      name="format"
                      type="radio"
                      value="alphanumeric"
                      label="Alphanumeric"
                      component={RadioInput}
                    />
                  </Form.Group>
                )}

<Form.Group inline>
            <Field
              name="required"
              type="checkbox"
              //      value={this.state.required}
              //   onClick={this.handleChange}
              label="Is Required"
              component={Checkbox}
            />

            <Field
              name="example"
              type="checkbox"
              //   checked={this.state.example}
              //    value={this.state.example}
              onClick={this.handleExampleChange}
              label="Include Example"
              component={Checkbox}
            />

            <Field
              name="includeUnits"
              type="checkbox"
              //   checked={this.state.example}
              //    value={this.state.example}
              onClick={this.handleUnitsChanged}
              label="Include Units"
              component={Checkbox}
            />
          </Form.Group>

              </div>
            )}
          </Transition.Group>

      
          {this.state.units && (
            <Field
              name="units"
              type="text"
              component={TextInput}
              placeholder="Units"
            />
          )}

          {this.state.example && (
            <PhotoUpload
              type="fieldExample"
              handlePhotoUploaded={this.props.handlePhotoUploaded}
            />
          )}

          {this.state.examplePhotos && this.state.examplePhotos.length > 0 && (
            <div
              style={{
                height: 300,
                marginBottom: 1,
                marginTop: 5,
                padding: 5,
                width: "auto",
                backgroundColor: "WhiteSmoke",
                overflowX: "auto",
                overflowY: "hidden",

                whiteSpace: "nowrap",
                position: "relative"
              }}
            >
              <Header>Example Photos</Header>
              {this.state.examplePhotos &&
                this.state.examplePhotos.map((photo, index) => (
                  <div style={{ display: "inline-block", marginRight: "15px" }}>
                    <ExamplePhotoItem
                      index={index}
                      handleUpdatePhotoDescription={
                        this.handleUpdatePhotoDescription
                      }
                      handleUpdatePhotoTitle={this.handleUpdatePhotoTitle}
                      photo={photo}
                    />
                  </div>
                ))}
            </div>
          )}
          {!this.state.isMaterial&&
          <Button
            disabled={invalid || submitting || (pristine && !fieldChanged)}
            positive
            loading={loading}
            type="submit"
          >
            Submit
          </Button>}
        </Form>
      </div>
    );
  }
}

export default withFirestore(
  connect(
    mapState,
    actions
  )(
    reduxForm({ form: "fieldForm", enableReinitialize: true, validate })(
      NewFieldForm
    )
  )
);
