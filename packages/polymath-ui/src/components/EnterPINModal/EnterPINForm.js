/* eslint-disable react/jsx-no-bind */
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Form } from 'carbon-components-react';

import TextInput from '../../deprecated/components/inputs/TextInput';

export const formName = 'enterPIN';

type Props = {
  onChange: (value: string) => void,
};

class EnterPINForm extends Component<Props> {
  render() {
    return (
      <Form onSubmit={e => e.preventDefault()}>
        <Field
          name="pin"
          component={TextInput}
          placeholder="Enter PIN Code"
          onChangeCode={(value: string) => this.props.onChange(value)}
        />
      </Form>
    );
  }
}

export default reduxForm({
  form: formName,
})(EnterPINForm);
