import React, { Component } from "react";
import {
  Button,
  Label,
  Rail,
  Reveal,
  Image,
  Sticky,
  Transition,
  Segment,
  Grid,
  Container
} from "semantic-ui-react";
import { connect } from "react-redux";

import { Elements, StripeProvider } from "react-stripe-elements";
// import GoogleMapReact from 'google-map-react';
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { incrementAsync, decrementAsync } from "./testActions";
import { openModal } from "../modals/modalActions";
import TestPopup1 from "./TestPopup1";
import TestPopup2 from "./TestPopup2";
import TestPopup3 from "./TestPopup3";
import TestPopup4 from "./TestPopup4";
import Slider from "react-slick";
import scrollToComponent from "react-scroll-to-component";
import TestPopup5 from "./TestPopup5";
import distanceInWords from "date-fns/distance_in_words";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { firebaseConnect, isEmpty, isLoaded } from "react-redux-firebase";
import { objectToArray } from "../../app/common/util/helpers";
//import PlumbingImage from '../../../public/assets/categoryImages/plumbing.jpg'

const plumbing = "plumbing";
const design = "design";
const tools = "tools";
const deals = "deals";
const supplies = "supplies";
const electrical = "electrical";
const services = "services";
const landscaping = "landscaping";
const carpentry = "carpentry";
const builds = "builds";
const message = {
  id: "pVBFKV5Sp2giwswxvj7mpsJa4Bj1",
  city: "uknown",
  displayName: "arron",
  newMessage: false,
  photoURL: "/assets/user.png"
};
const mapState = (state, ownProps) => {
  return {
    loading: state.async.loading,
    auth: state.firebase.auth,
    firstId:
      !isEmpty(message.id) &&
      isLoaded(message.id) &&
      state.firebase.auth.uid < message.id
        ? state.firebase.auth.uid
        : message.id,
    secondId:
      !isEmpty(message) &&
      isLoaded(message) &&
      state.firebase.auth.uid < message.id
        ? message.id
        : state.firebase.auth.uid,
    directMessages:
      !isEmpty(message) &&
      isLoaded(message) &&
      state.firebase.auth.uid < message.id
        ? !isEmpty(state.firebase.data.direct_messages) &&
          objectToArray(
            state.firebase.data.direct_messages[
              `${state.firebase.auth.uid}_${message.id}`
            ]
          )
        : !isEmpty(state.firebase.data.direct_messages) &&
          objectToArray(
            state.firebase.data.direct_messages[
              `${message.id}_${state.firebase.auth.uid}`
            ]
          )
  };
};

const actions = {
  incrementAsync,
  decrementAsync,
  openModal
};
const RIGHT = 0;
const BOTTOM = 0;
const BORDER = 10;
const WIDTH = 300;
const HEIGHT = 400;

class TestComponent extends Component {
  state = {
    show1: false,
    show2: false,
    show3: false,
    show4: false,
    show5: false,
    contextRef: {},
    showPlumbing: false,
    showElectrical: false,
    showDeals: false,
    showCarpentry: false,
    showBuilds: false,
    showLandscaping: false,
    showToolRental: false,
    showDesign: false,
    showServices: false,
    showSupplies: false,
    selectedJob:""
  };

  constructor(props) {
    // Optional, declare a ref property
    super(props);
    this.myRef = React.createRef();
  }

  scrollToMyRef = (ref, job) => {
    // run this method to execute scrolling.
    console.log("scrolling");
    console.log({ ref });
    console.log({job})
    // const tesNode = ReactDOM.findDOMNode(this.refs.test)
    // if (true){
    //  tesNode.scrollIntoView();
    //  }
    this.setState({selectedJob : job})
    switch (ref) {
      case plumbing:
        this.setState({ showPlumbing: true });
        break
        case electrical:
        this.setState({ showElectrical: true });
        break
        case deals:
        this.setState({ showDeals: true });
        break
        case carpentry:
        this.setState({ showCarpentry: true });
        break

        case builds:
        this.setState({ showBuilds: true });
        break

        case landscaping:
        this.setState({ showLandscaping: true });
        break
        case tools:
        this.setState({ showToolRental: true });
        break
        case supplies:
        this.setState({ showSupplies: true });
        break
        case design:
        this.setState({ showDesign: true });
        break
        case services:
        this.setState({ showServices: true });
        break
      default:
    }

    scrollToComponent(this.refs[ref], {
      offset: -80,
      align: "top",
      duration: 1000
    });

    // window.scrollTo({
    //     top:this.myRef.offsetTop,
    //     behavior: "smooth"  // Optional, adds animation
    // })
  };

  handleContextRef = contextRef => {
    this.setState({ contextRef });
  };
  handleClick1 = () => {
    this.setState({ show1: !this.state.show1 });
  };

  handleClick2 = () => {
    this.setState({ show2: !this.state.show2 });
  };
  handleClick3 = () => {
    this.setState({ show3: !this.state.show3 });
  };
  handleClick4 = () => {
    this.setState({ show4: !this.state.show4 });
  };
  handleClick5 = () => {
    this.setState({ show5: !this.state.show5 });
  };

  render() {
    const {
      show1,
      show2,
      show3,
      show4,
      show5,
      contextRef,
      showPlumbing,
      showBuilds,
      showCarpentry,
      showDeals,
      showDesign,
      showElectrical,
      showLandscaping,
      showServices,
      showSupplies,
      showToolRental
    } = this.state;
    const { directMessages, auth } = this.props;
    const bgURL = "gs://revents-99d5b.appspot.com/plumbing.jpg";

    const plumbing = [
      "plumbing_drain_clean",
      "plumbing_furnace_fix",
      "plumbing_water_heater",
      "plumbing_air_conditioner",
      "supplies_plumbing",
      "deals_fixtures"
    ];

    const electrical = [
      "electrical_new_service",
      "electrical_light_fixtures",
      "electrical_fix_plug",
      "electrical_ceiling_fan",
      "supplies_electrical"
    ];

    const carpentry = [
      "carpentry_framing",
      "carpentry_drywall",
      "carpentry_windows",
      "carpentry_doors",
      "carpentry_bracing"
    ];

    const landscaping = [
      "landscaping_snow_removal",
      "landscaping_yard_cleanup",
      "landscaping_supply",
      "design_landscape",
      "tools_dumptrailer",
      "tools_skidsteer"
    ];

    const builds = [
      "home",
      "kitchen",
      "bathroom",
      "basement",
      "garage",
      "addition"
    ];

    const services = [
      "services_dumpster",
      "services_cleanup",
      "services_fence",
      "services_security",
      "services_financing"
    ];

    const designs = [
      "design_structural",
      "design_architect",
      "design_paint",
      "design_landscape"
    ];
    const tools = [
      "tools_jackhammer",
      "tools_dumptrailer",
      "tools_auger",
      "tools_skidsteer"
    ];

    const supplies = [
      "supplies_paint",
      "supplies_mud",
      "supplies_wall",
      "supplies_insulation",
      "supplies_plumbing",
      "supplies_electrical",
      "supplies_general",
      "supplies_carpentry"
    ];

    const deals = [
      "deals_flooring",
      "deals_fixtures",
      "deals_paint",
      "deals_tile",
      "deals_lighting"
    ];

    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      swipeToSlide: true
    };

    return (
      <div>
        <Grid>
          <Grid.Column width={2} />
          <Grid.Column width={12}>
            <div ref={this.handleContextRef}>
              <div>
                <div ref="builds">
                  <p style={{fontSize:30}}>Builds</p>

                  <Slider {...settings}>
                    {builds &&
                      builds.map(build => (
                        
                          <Image  
                          style={{minHeight:200, maxHeight:200, minWidth:200, maxWidth:200}}
                            onClick={() => this.scrollToMyRef("builds")}
                            src={`/assets/categoryImages/${build}.jpg`}
                          />
                       
                      ))}
                  </Slider>
                </div>
                <Transition.Group animation="scale" duration={300}>
                  {showBuilds && (
                    <div
                      style={{
                        height:400,
                        width: 1000,
                        backgroundColor: "black"
                      }}
                    >
                      <Button
                        onClick={() => {
                          this.setState({ showBuilds: false });
                        }}
                      >
                        close
                      </Button>
                    </div>
                  )}
                </Transition.Group>
                <div ref="services">
                  <p style={{fontSize:30}}>Services</p>

                  <Slider {...settings}>
                    {services &&
                      services.map(service => (
                        <div>
                          <Image
                            onClick={() => this.scrollToMyRef("services")}
                            src={`/assets/categoryImages/${service}.jpg`}
                          />
                        </div>
                      ))}
                  </Slider>
                </div>

                <Transition.Group animation="scale" duration={300}>
                  {showServices && (
                    <div
                      style={{
                        height:400,
                        width: 1000,
                        backgroundColor: "black"
                      }}
                    >
                      <Button
                        onClick={() => {
                          this.setState({ showServices: false });
                        }}
                      >
                        close
                      </Button>
                    </div>
                  )}
                </Transition.Group>

                <div ref="carpentry">
                  <p style={{fontSize:30}}>Carpentry </p>

                  <Slider {...settings}>
                    {carpentry &&
                      carpentry.map(job => (
                        <div>
                          <Image
                            onClick={() => this.scrollToMyRef("carpentry")}
                            src={`/assets/categoryImages/${job}.jpg`}
                          />
                        </div>
                      ))}
                  </Slider>
                </div>

                <Transition.Group animation="scale" duration={300}>
                  {showCarpentry && (
                    <div
                      style={{
                        height:400,
                        width: 1000,
                        backgroundColor: "black"
                      }}
                    >
                      <Button
                        onClick={() => {
                          this.setState({ showCarpentry: false });
                        }}
                      >
                        close
                      </Button>
                    </div>
                  )}
                </Transition.Group>

                <div ref="plumbing">
                  <p style={{fontSize:30}}>Plumbing</p>

                  <Slider {...settings}>
                    {plumbing &&
                      plumbing.map(plumbingJob => (
                        <div>
                          <Image
                            onClick={() => this.scrollToMyRef("plumbing", plumbingJob)}
                            src={`/assets/categoryImages/${plumbingJob}.jpg`}
                          />
                        </div>
                      ))}
                  </Slider>
                </div>

                <Transition.Group animation="scale" duration={300}>
                  {showPlumbing && (
                    <div
                      style={{
                        height:400,
                        width: 1000,
                        backgroundColor: "black"
                      }}
                    >
                      
                      <Button
                        onClick={() => {
                          this.setState({ showPlumbing: false });
                        }}
                      >
                        close
                      </Button>
                      <Image 
                       src={`/assets/categoryImages/${this.state.selectedJob}.jpg`}
                      
                      />
                    </div>
                  )}
                </Transition.Group>

                <div ref="electrical">
                  <p style={{fontSize:30}}>Electrical</p>

                  <Slider {...settings}>
                    {electrical &&
                      electrical.map(electricalJob => (
                        <div>
                          <Image
                            onClick={() => this.scrollToMyRef("electrical")}
                            src={`/assets/categoryImages/${electricalJob}.jpg`}
                          />
                        </div>
                      ))}
                  </Slider>
                </div>

                <Transition.Group animation="scale" duration={300}>
                  {showElectrical && (
                    <div
                      style={{
                        height:400,
                        width: 1000,
                        backgroundColor: "black"
                      }}
                    >
                      <Button
                        onClick={() => {
                          this.setState({ showElectrical: false });
                        }}
                      >
                        close
                      </Button>
                    </div>
                  )}
                </Transition.Group>

                <div ref="landscaping">
                  <p style={{fontSize:30}}>Landscaping</p>

                  <Slider {...settings}>
                    {landscaping &&
                      landscaping.map(landscapingJob => (
                        <div>
                          <Image
                            onClick={() => this.scrollToMyRef("landscaping")}
                            src={`/assets/categoryImages/${landscapingJob}.jpg`}
                          />
                        </div>
                      ))}
                  </Slider>
                </div>
                <Transition.Group animation="scale" duration={300}>
                  {showLandscaping && (
                    <div
                      style={{
                        height:400,
                        width: 1000,
                        backgroundColor: "black"
                      }}
                    >
                      <Button
                        onClick={() => {
                          this.setState({ showLandscaping: false });
                        }}
                      >
                        close
                      </Button>
                    </div>
                  )}
                </Transition.Group>

                <div ref="designs">
                  <p style={{fontSize:30}}>Designs</p>

                  <Slider {...settings}>
                    {designs &&
                      designs.map(design => (
                        <div>
                          <Image
                            onClick={() => this.scrollToMyRef("designs")}
                            src={`/assets/categoryImages/${design}.jpg`}
                          />
                        </div>
                      ))}
                  </Slider>
                </div>

                <Transition.Group animation="scale" duration={300}>
                  {showDesign && (
                    <div
                      style={{
                        height:400,
                        width: 1000,
                        backgroundColor: "black"
                      }}
                    >
                      <Button
                        onClick={() => {
                          this.setState({ showDesign: false });
                        }}
                      >
                        close
                      </Button>
                    </div>
                  )}
                </Transition.Group>

                <div ref="tools">
                  <p style={{fontSize:30}}>Tool Rentals</p>

                  <Slider {...settings}>
                    {tools &&
                      tools.map(tool => (
                        <div>
                          <Image
                            onClick={() => this.scrollToMyRef("tools")}
                            src={`/assets/categoryImages/${tool}.jpg`}
                          />
                        </div>
                      ))}
                  </Slider>
                </div>

                <Transition.Group animation="scale" duration={300}>
                  {showToolRental && (
                    <div
                      style={{
                        height:400,
                        width: 1000,
                        backgroundColor: "black"
                      }}
                    >
                      <Button
                        onClick={() => {
                          this.setState({ showToolRental: false });
                        }}
                      >
                        close
                      </Button>
                    </div>
                  )}
                </Transition.Group>

                <div ref="supplies">
                  <p style={{fontSize:30}}>Supply Packages</p>

                  <Slider {...settings}>
                    {supplies &&
                      supplies.map(supply => (
                        <div>
                          <Image
                            onClick={() => this.scrollToMyRef("supplies")}
                            src={`/assets/categoryImages/${supply}.jpg`}
                          />
                        </div>
                      ))}
                  </Slider>
                </div>

                <Transition.Group animation="scale" duration={300}>
                  {showSupplies && (
                    <div
                      style={{
                        height:400,
                        width: 1000,
                        backgroundColor: "black"
                      }}
                    >
                      <Button
                        onClick={() => {
                          this.setState({ showSupplies: false });
                        }}
                      >
                        close
                      </Button>
                    </div>
                  )}
                </Transition.Group>

                <div ref="deals">
                  <p style={{fontSize:30}}>Hot Deals</p>

                  <Slider {...settings}>
                    {deals &&
                      deals.map(deal => (
                        <div>
                          <Image
                            onClick={() => this.scrollToMyRef("deals")}
                            src={`/assets/categoryImages/${deal}.jpg`}
                          />
                        </div>
                      ))}
                  </Slider>
                </div>

                <Transition.Group animation="scale" duration={300}>
                  {showDeals && (
                    <div
                      style={{
                        height:400,
                        width: 1000,
                        backgroundColor: "black"
                      }}
                    >
                      <Button
                        onClick={() => {
                          this.setState({ showDeals: false });
                        }}
                      >
                        close
                      </Button>
                    </div>
                  )}
                </Transition.Group>
              </div>

              <Rail position="left">
                <Sticky context={contextRef}>
                  {show1 ? <p>show1 true</p> : <p>show1 false</p>}
                  <Button onClick={this.handleClick1}>Launch</Button>
                  {show1 && (
                    <TestPopup1
                      width={WIDTH}
                      height={HEIGHT}
                      bottom={BOTTOM}
                      right={RIGHT}
                      message={message}
                      directMessages={directMessages}
                      auth={auth}
                    />
                  )}

                  {show2 ? <p>show2 true</p> : <p>show2 false</p>}
                  <Button onClick={this.handleClick2}>Launch 2</Button>
                  {show2 && (
                    <TestPopup2
                      width={WIDTH}
                      height={HEIGHT}
                      bottom={BOTTOM}
                      right={RIGHT + WIDTH + BORDER}
                      message={message}
                      directMessages={directMessages}
                      auth={auth}
                    />
                  )}

                  {show3 ? <p>show3 true</p> : <p>show3 false</p>}
                  <Button onClick={this.handleClick3}>Launch 3</Button>
                  {show3 && (
                    <TestPopup3
                      width={WIDTH}
                      height={HEIGHT}
                      bottom={BOTTOM + 100}
                      right={RIGHT + WIDTH + BORDER + WIDTH + BORDER}
                      message={message}
                      directMessages={directMessages}
                      auth={auth}
                    />
                  )}

                  {show4 ? <p>show4 true</p> : <p>show4 false</p>}
                  <Button onClick={this.handleClick4}>Launch 4</Button>
                  {show4 && (
                    <TestPopup4
                      width={WIDTH}
                      height={HEIGHT}
                      bottom={BOTTOM}
                      right={
                        RIGHT + WIDTH + BORDER + WIDTH + BORDER + WIDTH + BORDER
                      }
                      message={message}
                      directMessages={directMessages}
                      auth={auth}
                    />
                  )}

                  {show5 ? <p>show5 true</p> : <p>show5 false</p>}
                  <Button onClick={this.handleClick5}>Launch 5</Button>
                  {show5 && (
                    <TestPopup5
                      width={WIDTH}
                      height={HEIGHT}
                      bottom={BOTTOM}
                      right={
                        RIGHT +
                        WIDTH +
                        BORDER +
                        WIDTH +
                        BORDER +
                        WIDTH +
                        BORDER +
                        WIDTH +
                        BORDER
                      }
                      message={message}
                      directMessages={directMessages}
                      auth={auth}
                    />
                  )}
                </Sticky>
              </Rail>

              <Rail position="right">
                <Sticky context={contextRef}>
                  <h3>right content</h3>
                </Sticky>
              </Rail>
            </div>
          </Grid.Column>
          <Grid.Column width={2} />
        </Grid>
      </div>
    );
  }
}

export default compose(
  connect(
    mapState,
    actions
  ),
  firebaseConnect(props => [
    `direct_messages/${props.firstId}_${props.secondId}`
  ])
)(TestComponent);
