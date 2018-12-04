// @flow

import { Button, Form } from 'carbon-components-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import {
  bull,
  PageCentered,
  ContentBox,
  Heading,
  FormItem,
  TextInput,
} from '@polymathnetwork/ui';
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

class ConfirmEmailPage extends Component {
  render() {
    return (
      <PageCentered title="Sign In – Polymath" id="verify-email-address">
        <ContentBox maxWidth={735}>
          <div className="pui-single-box-header">
            <div className="pui-single-box-bull">
              <img src={bull} alt="Bull" />
            </div>
            <Heading as="h1" variant="h1">
              Verify Your Email Address
            </Heading>
            <Heading variant="h4" mr={200}>
              Please check that we can contact you at the email address below.
              Once you have confirmed your email address we&apos;ll
              <br />
              send you a copy of your transaction details.
            </Heading>
            <ConnectedForm />
          </div>
        </ContentBox>
      </PageCentered>
    );
  }
}

export default ConfirmEmailPage;
