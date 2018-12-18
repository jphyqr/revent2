import React, { Component } from "react";
import {calc, css, physics, pointer, transform, tween, value} from 'popmotion'

 const getTotalItemsWidth=(items) =>{
    const { left } = items[0].getBoundingClientRect();
    const { right } = items[items.length - 1].getBoundingClientRect();
    return right - left;
  }
  

  const angleIsVertical= (angle)=> {
    const isUp = (
      angle <= -90 + 45 &&
      angle >= -90 - 45
    );
    const isDown = (
      angle <= 90 + 45 &&
      angle >= 90 - 45
    );
  
    return (isUp || isDown);
  }


class TestAnimations extends Component {

    state={
        slider : {},
        items : {},
        nextButton: {},
        prevButton: {},
        progressBar: {},
        progressBarRenderer: {},
        sliderRenderer:{}
    }
    
    componentDidMount () {

const { applyOffset, clamp, pipe } = transform;

        const container = this.refs.container
        const next = this.refs.next
        const prev = this.refs.prev
        container.addEventListener('touchstart', this.startTouchScroll);
        container.addEventListener('wheel', this.onWheel);
        next.addEventListener('click', this.gotoNext);
        prev.addEventListener('click', this.gotoPrev);

        const slider = container.querySelector('.slider');
        const items = slider.querySelectorAll('.item');
        const nextButton = container.querySelector('.next');
        const prevButton = container.querySelector('.prev');
        const progressBar = container.querySelector('.progress-bar');
        this.setState({
            slider:slider,
            items:items,
            nextButton: nextButton,
            prevButton:prevButton,
            progressBar: progressBar
        })

          // Calculate slider measurements
  const sliderVisibleWidth = slider.offsetWidth;
  const totalItemsWidth = getTotalItemsWidth(items);

  console.log("total item width", totalItemsWidth)


  const maxXOffset = 0;
  const minXOffset = - (totalItemsWidth - sliderVisibleWidth);
  const clampXOffset = clamp(minXOffset, maxXOffset);
  console.log("clamp offset", clampXOffset)

  const sliderRenderer = css(slider);
  const progressBarRenderer = css(progressBar);

  this.setState({
    slider:slider,
    items:items,
    nextButton: nextButton,
    prevButton:prevButton,
    progressBar: progressBar,
    sliderVisibleWidth:sliderVisibleWidth,
    totalItemsWidth:totalItemsWidth,
    clampXOffset:clampXOffset,
    sliderRenderer:sliderRenderer,
    progressBarRenderer:progressBarRenderer
})
  

    }

     updateProgressBar=(x)=> {
         const {maxXOffset, minXOffset} = this.state
        const progress = calc.getProgressFromValue(maxXOffset, minXOffset, x);
      let progressBarUpdate = this.state.progressBarRenderer
      console.log({progressBarUpdate})
      progressBarUpdate.set('scaleX', progress)
       this.setState({progressBarRenderer: progressBarUpdate})
      }
    
   
     
 

  render() {
    const sliderX = value(0, (x) => {
        this.updateProgressBar(x);
      //  let newSliderRendere = this.state.sliderRenderer
     //   newSliderRendere.set('x',x)
     //   this.setState({sliderRenderer:newSliderRendere})
      });
    //  sliderX.set(-100);
    const container = this.refs.container
    console.log({container})
    const slider = container&&container.querySelector('.slider')
    console.log({slider})

    const itemStyle = {
      flex: "0 0 150px",
      height: "215px",
      marginLeft: "10px",
      borderRadius: "5px",
      display: "flex",
      flexDirection: "column",
      background: "green"
    };

    return (
      <div
        class="container"
        ref="container"
        style={{
          overflow: "hidden",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "blue",

          flexWrap: "wrap"
        }}
        for
      >
        <ul
          class="slider"
          style={{
            display: "flex",
            flex: "1 1 500px",
            listStyle: "none",
            padding: 0,
            margin: "0 10px"
          }}
        >
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
          <li class="item" style={itemStyle}>
            <a href="#" />
          </li>
        </ul>
        <div
          class="controls"
          style={{
            marginTop: "20px",
            flex: "1 1 100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <button
            style={{
              border: "none",
              borderRadius: "25px",
              background: "hsla(0, 90%, 65%, 1)",
              padding: "12px 15px",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              lineHeight: "18px",
              WebkitAppearance: "none",
              cursor: "pointer"
            }}
            class="prev"
            ref="prev"
          >
            Prev
          </button>
          <div style ={{
  flex: "0 0 200px",
  height: "4px",
  borderRadius: "4px",
  margin: "0 20px",
  background: "hsla(0, 90%, 65%, 1)",
  transform: "scaleX(0)",
  transformOrigin: "0% 50%"

          }}class="progress-bar" 
          ref="progress-bar"/>
          <button
            style={{
              border: "none",
              borderRadius: "25px",
              background: "hsla(0, 90%, 65%, 1)",
              padding: "12px 15px",
              color: "white",
              fontSize: "18px",
              fontWeight: "bold",
              lineHeight: "18px",
              WebkitAppearance: "none",
              cursor: "pointer"
            }}
            class="next"
            ref="next"
          >
            Next
          </button>
        </div>
      </div>
    );
  }


   

}

export default TestAnimations