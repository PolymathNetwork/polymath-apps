// @flow

import { Button, Form } from 'carbon-components-react';
import { Page, bull } from '@polymathnetwork/ui';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import DocumentTitle from 'react-document-title';
import { FormItem, TextInput } from '@polymathnetwork/ui';
import validator from '@polymathnetwork/ui/validator';

import { confirmEmail } from '../actions/ticker';

const formSchema = validator.object().shape({
  email: validator
    .string()
    .isRequired('Required.')
    .email('Invalid email.'),
});

export const ConfirmEmailFormComponent = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <FormItem name="email">
      <FormItem.Input component={TextInput} placeholder="you@example.com" />
      <FormItem.Error />
    </FormItem>

    <Button type="submit">Send Confirmation Email</Button>
  </Form>
);

const mapStateToProps = ({
  pui: {
    account: { email },
  },
}) => ({ email });

const formikEnhancer = withFormik({
  validationSchema: formSchema,
  displayName: 'ConfirmEmailForm',
  validateOnChange: false,
  mapPropsToValues: ({ email }) => {
    return {
      email,
    };
  },
  handleSubmit: (values, { props }) => {
    const { dispatch } = props;

    dispatch(confirmEmail(values.email));
  },
});

const FormikEnhancedForm = formikEnhancer(ConfirmEmailFormComponent);
const ConnectedForm = connect(mapStateToProps)(FormikEnhancedForm);

class ConfirmEmailPage extends Component<Props> {
  render() {
    return (
      <Page title="Confirm Email – Polymath">
        <div className="pui-single-box">
          <div className="pui-single-box-header">
            <div className="pui-single-box-bull">
              <img src={bull} alt="Bull" />
            </div>
            <h1 className="pui-h1">Verify Your Email Address</h1>
            <h3 className="pui-h4">
              Please check that we can contact you at the email address below.
              Once you have confirmed your email address we&apos;ll
              <br />
              send you a copy of your transaction details.
            </h3>
            <div className="pui-clearfix" />
            <ConnectedForm />
          </div>
        </div>
      </Page>
    );
  }
}

export default ConfirmEmailPage;
