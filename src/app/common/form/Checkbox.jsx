import React from 'react';
import { object } from 'prop-types';
import { Field } from 'redux-form';
import { Checkbox as CheckboxUI } from 'semantic-ui-react';

const Checkbox = ({
  input: { value, onChange, ...input },
  meta: { touched, error },
  ...rest
}) => (
  <div>
    <CheckboxUI
      {...input}
      {...rest}
      defaultChecked={!!value}
      onChange={(e, data) => onChange(data.checked)}
      type="checkbox"
    />
    {touched && error && <span>{error}</span>}
  </div>
);

Checkbox.propTypes = {
  input: object.isRequired,
  meta: object.isRequired
};

Checkbox.defaultProps = {
  input: null,
  meta: null
};

export default props => <Field {...props} component={Checkbox} />;