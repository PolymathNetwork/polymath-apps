// @flow

import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Form, FormGroup, Button, Toggle } from 'carbon-components-react';
import { thousandsDelimiter, Tooltip } from '@polymathnetwork/ui';
import { TextInput, RadioInput } from '@polymathnetwork/ui/deprecated';
import {
  url,
  required,
  numeric,
  minValue,
  maxLength,
} from '@polymathnetwork/ui/validate';

export const formName = 'complete_token';

const minValue1 = minValue(1);
const maxLength100 = maxLength(100);

type Props = {
  onSubmit: (isLimitNI: boolean) => void,
  onToggle: (isToggled: boolean) => void,
};

type State = {
  isToggled: boolean,
};

class CompleteTokenForm extends Component<Props, State> {
  state = {
    isToggled: false,
  };

  handleToggle = (isToggled: boolean) => {
    this.setState({ isToggled });
  };

  handleSubmit = () => {
    this.props.onSubmit(this.state.isToggled);
  };

  render() {
    const { isToggled } = this.state;

    return (
      <Form onSubmit={this.props.handleSubmit} className="token-form">
        <div className="token-form-left">
          <FormGroup
            legendText={
              <Tooltip triggerText="My Security Token Must Be">
                <p>
                  <strong>Divisible or Indivisible token</strong>
                </p>
                <p>
                  Indivisible tokens are typically used to represent an equity,
                  while divisible tokens may be used to represent divisible
                  assets such as bonds. Please connect with your advisor to
                  select the best option.
                </p>
              </Tooltip>
            }
          >
            <Field
              name="isDivisible"
              options={[
                { label: 'Divisible', value: '0' },
                { label: 'Indivisible', value: '1' },
              ]}
              component={RadioInput}
            />
          </FormGroup>
          <FormGroup
            style={{ marginTop: '8px' }}
            legendText={
              <Tooltip triggerText="Limit the Number of Investors Who Can Hold This Token">
                <p>
                  <strong>Limit the Number of Investors</strong>
                </p>
                <p>
                  This option allows you to limit the number of concurrent token
                  holders irrespective of the number of entries in the
                  whitelist.
                  <br />
                  For example, enabling this option can allow you to allow a
                  maximum of 99 concurrent token holders while your whitelist
                  may have thousands of entries.
                </p>
              </Tooltip>
            }
          >
            <Toggle onToggle={this.handleToggle} id="investors-number-toggle" />
          </FormGroup>
        </div>
        <div className="token-form-right">
          <FormGroup
            legendText={
              <Tooltip triggerText="Additional Token Information">
                <p>
                  <strong>Additional Token Information</strong>
                </p>
                <p>
                  Paste link to a shared file or folder that includes additional
                  information on your token, such as legend.
                </p>
              </Tooltip>
            }
          >
            <Field
              name="details"
              component={TextInput}
              placeholder="Paste link here"
              validate={[url, maxLength100]}
            />
          </FormGroup>
          {isToggled ? (
            <FormGroup
              legendText="Max. Number of Investors"
              style={{ marginTop: '24px' }}
            >
              <Field
                name="investorsNumber"
                component={TextInput}
                normalize={thousandsDelimiter}
                placeholder="Enter the number"
                validate={[required, numeric, minValue1]}
              />
            </FormGroup>
          ) : (
            ''
          )}
        </div>
        <div className="pui-clearfix" />
        <Button type="submit">Create my security token</Button>
      </Form>
    );
  }
}

export default reduxForm({
  form: formName,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(CompleteTokenForm);
