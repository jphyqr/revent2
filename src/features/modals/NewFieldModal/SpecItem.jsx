import React, { Component } from 'react'
import {Grid, Icon, Button, Transition} from 'semantic-ui-react'
 class SpecItem extends Component {

    state = {
        selectKey: "",
        selectText: "",
        selectValue: ""
      };

      handleSelectSubmit = async () => {
        const { selectKey, selectText, selectValue } = this.state;
        const {spec, index} = this.props || {}

        let newItem = { key: selectKey, text: selectText, value: selectValue };
        let items = spec.items ||[];
        items.push(newItem);
        await this.props.handleUpdateSpecItems(index, items)
        this.setState({
          selectKey: "",
          selectText: "",
          selectValue: ""
        });
      };
    


    render() {
  
        const {spec, index, selectedSpecIndex} = this.props || {}
        const {items} = spec || []   
             return (
            <div>
            <div
              style={{
                width: "100%",
                backgroundColor: "green",
                color: "white",
                
              }}
              
            >
             <Grid style={{margin:0, padding:0}}>
                 <Grid.Column style={{margin:0, padding:0}} width={3}><Button size="mini" negative onClick={()=>this.props.handleDeleteSpec(index)}>X</Button></Grid.Column>
                 <Grid.Column 
                 style={{margin:0, padding:0}}
                 onClick={()=>this.props.handleSelectSpecToExpand(index)}
                 width={13}>{spec.specName}</Grid.Column>
             </Grid>
            </div>
            <Transition.Group animation="slide down" duration={300}>
                {(index===selectedSpecIndex) &&
            <Grid>
              <Grid.Column width={8}>
                <div>
                  key
                  <input
                    value={this.state.selectKey}
                    onChange={e =>
                      this.setState({ selectKey: e.target.value, selectText: e.target.value, selectValue: e.target.value })
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
                  {items &&
                    items.map((item,i) => (
                      <div>
                        <Button  size="mini" negative onClick={()=>this.props.handleDeleteItemFromSpec(index, i)}>X</Button>
                        <label>KEY </label> {item.key}
                        <label> TEXT </label> {item.text}
                        <label> VALUE </label>
                        {item.value}
                      </div>
                    ))}
                </div>
              </Grid.Column>
            </Grid>}
            </Transition.Group>
          </div>
        )
    }
}



export default SpecItem