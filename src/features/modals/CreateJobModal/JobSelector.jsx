import React, { Component } from "react";
import {
  Segment,
  Grid,
  Reveal,
  Placeholder,
  Icon,
  Image,
  Button,
  Label,
  Transition
} from "semantic-ui-react";
import Radium from "radium";

import Slider from "react-slick";

const SamplePrevArrow = props => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
};

const SampleNextArrow = props => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
};

class JobSelector extends Component {

  constructor(props){    // Optional, declare a ref property
    super(props)
    this.myRef=React.createRef()    
}
  state = { visible: false
  
  };


  scrollToMyRef = () => {   // run this method to execute scrolling. 
    console.log('scrolling')
    window.scrollTo({
        top:this.myRef.offsetTop, 
        behavior: "smooth"  // Optional, adds animation
    })
}



  render() {
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 4,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />
    };

    var box = document.querySelector('.box'),
    targetElm = document.querySelector('.boxChild'); // <-- Scroll to here within ".box"


    const builds = [
      "home",
      "kitchen",
      "bathroom",
      "basement",
      "garage",
      "addition"
    ];

    return (
      <div>
        <div>
        <p>Builds</p>

        <Slider {...settings}>
          {builds &&
            builds.map(build => (
              <Reveal animated="fade">
                <Reveal.Content visible>
                  <div style={{ height: 200, width: 200 }}>
                    <Image src={`/assets/categoryImages/${build}.jpg`} />
                  </div>
                </Reveal.Content>
                <Reveal.Content hidden>
                  <div style={{ height: 200, width: 200 }}>
                    <Label>{build}</Label>
                  
                  </div>
                </Reveal.Content>
              </Reveal>
            ))}
        </Slider>
      </div>

              <div>
        <p>Services</p>

        <Slider {...settings}>
          {builds &&
            builds.map(build => (
              <Reveal animated="fade">
                <Reveal.Content visible>
                  <div style={{ height: 200, width: 200 }}>
                    <Image src={`/assets/categoryImages/${build}.jpg`} />
                  </div>
                </Reveal.Content>
                <Reveal.Content hidden>
                  <div style={{ height: 200, width: 200 }}>
                    <Label>{build}</Label>
                  </div>
                </Reveal.Content>
              </Reveal>
            ))}
        </Slider>
      </div>

              <div>
        <p>Carpentry </p>

        <Slider {...settings}>
          {builds &&
            builds.map(build => (
              <Reveal animated="fade">
                <Reveal.Content visible>
                  <div style={{ height: 200, width: 200 }}>
                    <Image src={`/assets/categoryImages/${build}.jpg`} />
                  </div>
                </Reveal.Content>
                <Reveal.Content hidden>
                  <div style={{ height: 200, width: 200 }}>
                    <Label>{build}</Label>
                  </div>
                </Reveal.Content>
              </Reveal>
            ))}
        </Slider>
      </div>

              <div ref={this.myRef}>
        <p>Plumbing</p>

        <Slider {...settings}>
          {builds &&
            builds.map(build => (
              <Button onClick={this.scrollToMyRef}>Expand</Button>
              // <Reveal animated="fade">
              //   <Reveal.Content visible>
              //     <div style={{ height: 200, width: 200 }}>
              //       <Image src={`/assets/categoryImages/${build}.jpg`} />
              //     </div>
              //   </Reveal.Content>
              //   <Reveal.Content hidden>
              //     <div style={{ height: 200, width: 200 }}>
              //       <Label>{build}</Label>
                    
              //     </div>
              //   </Reveal.Content>
              // </Reveal>
            ))}
        </Slider>
      </div>


              <div>
        <p>Electrical</p>

        <Slider {...settings}>
          {builds &&
            builds.map(build => (
              <Reveal animated="fade">
                <Reveal.Content visible>
                  <div style={{ height: 200, width: 200 }}>
                    <Image src={`/assets/categoryImages/${build}.jpg`} />
                  </div>
                </Reveal.Content>
                <Reveal.Content hidden>
                  <div style={{ height: 200, width: 200 }}>
                    <Label>{build}</Label>
                  </div>
                </Reveal.Content>
              </Reveal>
            ))}
        </Slider>
      </div>

              <div>
        <p>Landscaping</p>

        <Slider {...settings}>
          {builds &&
            builds.map(build => (
              <Reveal animated="fade">
                <Reveal.Content visible>
                  <div style={{ height: 200, width: 200 }}>
                    <Image src={`/assets/categoryImages/${build}.jpg`} />
                  </div>
                </Reveal.Content>
                <Reveal.Content hidden>
                  <div style={{ height: 200, width: 200 }}>
                    <Label>{build}</Label>
                  </div>
                </Reveal.Content>
              </Reveal>
            ))}
        </Slider>
      </div>
      <div>
        <p>Landscaping</p>

        <Slider {...settings}>
          {builds &&
            builds.map(build => (
              <Reveal animated="fade">
                <Reveal.Content visible>
                  <div style={{ height: 200, width: 200 }}>
                    <Image src={`/assets/categoryImages/${build}.jpg`} />
                  </div>
                </Reveal.Content>
                <Reveal.Content hidden>
                  <div style={{ height: 200, width: 200 }}>
                    <Label>{build}</Label>
                  </div>
                </Reveal.Content>
              </Reveal>
            ))}
        </Slider>
      </div>
      <div>
        <p>Landscaping</p>

        <Slider {...settings}>
          {builds &&
            builds.map(build => (
              <Reveal animated="fade">
                <Reveal.Content visible>
                  <div style={{ height: 200, width: 200 }}>
                    <Image src={`/assets/categoryImages/${build}.jpg`} />
                  </div>
                </Reveal.Content>
                <Reveal.Content hidden>
                  <div style={{ height: 200, width: 200 }}>
                    <Label>{build}</Label>
                  </div>
                </Reveal.Content>
              </Reveal>
            ))}
        </Slider>
      </div>
      </div>
    );
  }
}

export default Radium(JobSelector);
