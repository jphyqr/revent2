import React, { Component } from "react";
import {objectToArray} from '../../../app/common/util/helpers'
import {Icon,Search, Grid, Header} from 'semantic-ui-react'
import _ from 'lodash'
class IconSlider extends Component {
 
  state={
    results: [],
    currentField: {},
    searchValue: ""
  }


  componentWillReceiveProps =  nextProps =>{
  
    if(nextProps.currentField!==this.state.currentField){



      this.setState({currentField: nextProps.currentField,
      searchValue:(nextProps.currentField&&nextProps.currentField.icon)||"",
      results: objectToArray((nextProps.currentField&&nextProps.currentField.icon)||"")
    })
   
      this.forceUpdate();
    }
   }
   
    componentWillMount() {
        this.setState({currentField: this.props.currentField,
          searchValue:this.props.currentField.icon,
          results: objectToArray(this.props.currentField.icon)
        })
        this.resetComponent()
      }
    
      resetComponent = () => this.setState({ isLoading: false, results: []  })
    
      handleResultSelect = (e, { result }) => this.setState({ searchValue: result.title })
    
      handleSearchChange = (e, { searchValue }) => {
        this.setState({ isLoading: true, searchValue })
    
        setTimeout(() => {
          if (this.state.searchValue.length < 1) return this.resetComponent()
    
          const re = new RegExp(_.escapeRegExp(this.state.searchValue), 'i')
          const isMatch = result => re.test(result.className)
    
          this.setState({
            isLoading: false,
            results: _.filter(this.props.icons, isMatch),
          })
        }, 300)
      }

  render() {
const {icons} = this.props
const { isLoading, value, results } = this.state
    return (
        <div>
        <Grid>
        <Grid.Column width={4} style={{marginTop:10,bottom:0}}> <Header sub color="teal" content="Field Icon" />
</Grid.Column>
        <Grid.Column width={12}> <Search
    
        fluid
        size="mini"
           open={false}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.props.handleSearchChange, 500, { leading: true })}
            results={results}
           value={this.state.searchValue}
           // defaultValue='test'//{this.state.searchValue}
            {...this.props}
          /></Grid.Column>
        </Grid>
          
      <div
        class="list"
      //  onMouseEnter={this.props.onMouseEnterHandler}
      //  onMouseLeave={this.props.onMouseLeaveHandler}
        style={{
          height: 75,
          marginBottom: 1,
          marginTop:5,
          width: "auto",
         backgroundColor: "white",
          overflowX: "hidden",
          overflowY: "auto",
          position: "relative",
        }}
      >



      
        {icons &&
          icons.map((item, i) => (
        
         
                <Icon
     
           
            onClick={()=>this.props.handleSelectIcon(item.className)}
            
            onMouseEnter={()=>this.props.handleOnMouseEnter(item.className)}
            onMouseLeave={()=>this.props.handleOnMouseLeave(item.className)}
            style={{opacity: this.props.hoveredIcon===item.className? 1:0.6}}
              index={i}
              size="large"
              name={item.className}
              color={item.className===this.props.selectedIcon ? 'teal' : 'black'}
        
            />
          
          ))}
      </div>
      </div>
    );
  }
}

export default IconSlider;
