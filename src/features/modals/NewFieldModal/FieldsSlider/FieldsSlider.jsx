import React, { Component } from "react";
import FieldItem from "../FieldsPalette/FieldItem";
import {Search, Button} from 'semantic-ui-react'
import _ from 'lodash'
class FieldsPalette extends Component {

  state={
    results: [],
    searchValue: ""
  }

  componentWillMount() {
    this.setState({
      results: this.props.fields || []
    })
  
  }


   
  resetComponent = () => this.setState({ isLoading: false, results: this.props.fields  })

  handleResultSelect = (e, { result }) => this.setState({ searchValue: result.title })
handleDeleteField = () => {
  //do nothing this is for the add button
}

  handleSearchChange = (e, { searchValue }) => {
    console.log('search change e', e.target.value)
    console.log('search change searchValue', searchValue)
    this.setState({ isLoading: true, searchValue:e.target.value })
   
    setTimeout(() => {
      if (this.state.searchValue.length < 1) return this.resetComponent()

      const re = new RegExp(_.escapeRegExp(this.state.searchValue), 'i')
      const isMatch = result => re.test(result.name)

      this.setState({
        isLoading: false,
        results: _.filter(this.props.fields, isMatch),
      })
    }, 300)
  }
  
  render() {
    const { fields } = this.props;
    const { results, isLoading } = this.state
    return (
      <div>

<Button onClick={()=>this.props.handleNewField()}>
            New Field</Button>
      <Search
    
        fluid
        size="mini"
           open={false}
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce((e, data)=>this.handleSearchChange(e,data), 500, { leading: true })}
            results={results}
           value={this.state.searchValue}
           // defaultValue='test'//{this.state.searchValue}
            {...this.props}
          />
       
      <div
   
      style={{
        height: "500px",
        marginBottom: 1,
        marginTop:5,
        padding:5,
        width: "100%",
       backgroundColor: "WhiteSmoke",
        overflowX: "hidden",
        overflowY: "auto",
     //   whiteSpace: "nowrap",
        position: "relative",
      }}
      >
        {results &&
          results.map((field, i) => <FieldItem 
          handleDeleteField={this.props.handleDeleteField}
          
          onDragStart={this.props.onDragStart} handleSelectField={this.props.handleSelectField} key={i} field={field} />)}
      </div>
      </div>
    );
  }
}

export default FieldsPalette;
