import React, { Component } from 'react'
import {Button, Loader} from 'semantic-ui-react'
import {selectVideoToWatch} from '../modals/VideoModal/videoActions'
import {openModal} from '../modals/modalActions'
import {connect} from 'react-redux'



const mapState = state => {
  return {

    loading: state.async.loading
  };
};

const actions = {
  selectVideoToWatch, openModal
}

 class HomePage extends Component {


handleWatchVideo =  async () =>{
  await this.props.selectVideoToWatch('https://firebasestorage.googleapis.com/v0/b/revents-99d5b.appspot.com/o/IMG-0296.TRIM.MOV?alt=media&token=0950949d-9d48-4279-b622-85f91084c46d')
   this.props.openModal("VideoModal")
}

  render() {
    const {history,selectVideoToWatch, loading} = this.props
    return (
      <div style={{ width: "100%", height: "100%" }}>
      <div
        style={{
          width: window.innerWidth,
          height: (window.innerHeight - 40),
          textAlign: "center",
          backgroundColor: "orange",
          verticalAlign:"middle",
          display:"table-cell"
        }}
      >
        <div
          style={{ display:"inline-block", }}
        >
          <div className="ui text container">
            <h1 className="ui inverted stackable header">
              <img
                style={{ borderRadius: 10 }}
                className="ui image massive"
                src="/assets/white on orange logo.png"
                alt="logo"
              />
              <div className="content">Yaybour</div>
            </h1>
            <h2 style={{ paddingTop: 30, paddingBottom: 30 }}>
              Save Time and Money on your next project
            </h2>

{this.props.loading ?     <Loader /> :
            // <div
            // style={{height:200, width:200, backgroundColor:"black", marginLeft:"auto", marginRight:"auto", marginBottom:10, marginTop:10}}
            //   onClick={() => this.handleWatchVideo()}
              
            // >
            //   Play
            // </div>
            <video controls
            style={{width:"100%", padding:0, margin:0}}
            // autoPlay
             poster={'https://firebasestorage.googleapis.com/v0/b/revents-99d5b.appspot.com/o/IMG-0383.JPG?alt=media&token=ff9be06e-3766-4cea-bb15-f6a0de924827'}
             id="myVideo"
            
             
           >
             <source src={'https://firebasestorage.googleapis.com/v0/b/revents-99d5b.appspot.com/o/IMG-0296.TRIM.MOV?alt=media&token=0950949d-9d48-4279-b622-85f91084c46d'} type="video/mp4" />
           </video>
          }


    



            <div
              onClick={() => history.push("/build")}
              className="ui huge white inverted button"
            >
              Get Started
              <i className="right arrow icon" />
            </div>
          </div>
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        Proudly built in Regina, Saskatchewan.
      </div>
    </div>
    )
  }
}




export default connect(mapState, actions)(HomePage);
