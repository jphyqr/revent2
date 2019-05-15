import React from 'react'
import { Form, Label, Select , Dropdown, Grid, Image, Header} from 'semantic-ui-react'


const dropdownItem = (name, price, notes, image) => {
    return (
      <div style={{width:"300px", height:130, position:'relative'}}>
        <div style={{position:'absolute',  left:0, top:0}}> <Image
              style={{ height: "100px", maxWidth: "100px" }}
              src={image}
            /></div>
        


        <div style={{position:'absolute', left:110, top:0}}> 
        
        <Header>{name}</Header>
        
        </div>
          
           
  
            <div style={{ position:'absolute', left:110, top: 30, whiteSpace:"normal",  width:"200", height: 75, overflowX:"hidden", overflowY:"auto"}}>{notes} </div>
        
       
      </div>
    );
  };
 const renderOptions = (options) => {
   let newOptions = []
    for(var i=0; i<options.length; i++){
      let option = options[i]
      let newOption = {key:option.key, text:option.text, value:option.value,
      content:dropdownItem(option.text, option.price, option.notes, option.image)}
     
    newOptions.push(newOption)
    }
    console.log('newOptions', newOptions)
    return newOptions


}

const DropdownInput = ({input, type, placeholder, multiple, options, meta: {touched, error}}) => {
  console.log('options', options)
  return (
    <Form.Field error={touched && !!error}>
      <Dropdown
      scrolling
        value={input.value || null}
        onChange={(e, data) => input.onChange(data.value)}
        placeholder={placeholder}
        options={renderOptions(options)}
        multiple={multiple}
        fluid
      />
      {touched && error && <Label basic color='red'>{error}</Label>}
    </Form.Field>
  )
}

export default DropdownInput



