import React from 'react'
import { Form, Label } from 'semantic-ui-react'


const elementStyles = {
    base: {
      color: '#32325D',
      fontWeight: 500,
      fontFamily: 'Source Code Pro, Consolas, Menlo, monospace',
      fontSize: '16px',
      fontSmoothing: 'antialiased',

      '::placeholder': {
        color: '#CFD7DF',
      },
      ':-webkit-autofill': {
        color: '#e39f48',
      },
    },
    invalid: {
      color: '#E25950',

      '::placeholder': {
        color: '#FFCCA5',
      },
    },
  };

const PaymentTextInput = ({input, width, type, placeholder, meta: {touched, error}}) => {
  return (
    <Form.Field error={touched && !!error} width={width} style={elementStyles.base}>
      <input {...input} placeholder={placeholder} type={type} />
      {touched && error && <Label basic color='red'>{error}</Label>}
    </Form.Field>
  )
}

export default PaymentTextInput
