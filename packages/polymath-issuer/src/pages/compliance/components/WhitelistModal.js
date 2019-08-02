// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from '@polymathnetwork/ui';
import { withFormik } from 'formik';
import { Form } from 'carbon-components-react';
import {
  bull,
  PageCentered,
  ContentBox,
  Heading,
  FormItem,
  TextInput,
} from '@polymathnetwork/ui';
import validator from '@polymathnetwork/ui/validator';
import { addAddressToTransferManager } from '../../../actions/compliance';
('');

type Props = {
  isOpen: boolean,
  handleClose: () => any,
};

const formSchema = validator.object().shape({
  address: validator
    .string()
    .isAddress('Invalid Address')
    .isRequired('Required'),
  details: validator.string().isRequired('Required'),
});

export const ConfirmEmailFormComponent = ({ handleSubmit, handleClose }) => (
  <Form onSubmit={handleSubmit}>
    <FormItem name="address">
      <Heading as="h5" variant="h5">
        Whitelist Manager Wallet Address
      </Heading>
      <FormItem.Input component={TextInput} />
      <FormItem.Error />
    </FormItem>

    <FormItem name="details">
      <Heading as="h5" variant="h5">
        Whitelist Manager Details
      </Heading>
      <FormItem.Input component={TextInput} />
      <FormItem.Error />
    </FormItem>

    <Modal.Footer>
      <Button onClick={handleClose} className="cancel-btn" kind="secondary">
        Cancel
      </Button>
      <Button type="submit">Confirm</Button>
    </Modal.Footer>
  </Form>
);

const formikEnhancer = withFormik({
  validationSchema: formSchema,
  displayName: 'ConfirmEmailForm',
  validateOnChange: false,
  handleSubmit: (values, { props }) => {
    const { dispatch } = props;
    props.handleClose();
    dispatch(addAddressToTransferManager(values.address, values.details));
  },
});

const FormikEnhancedForm = formikEnhancer(ConfirmEmailFormComponent);
const ConnectedForm = connect()(FormikEnhancedForm);

class WhitelistModal extends Component<Props> {
  render() {
    const { isOpen, handleClose } = this.props;
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Header variant="alert">Add Whitelist Manager</Modal.Header>
        <Modal.Body>
          <p>
            Specify the investor wallet address of the new whitelist manager.
            Each manager will have permission to update the whitelist. Consult
            with your legal team before adding a new wallet to the list.
          </p>
          <ConnectedForm handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    );
  }
}

export default WhitelistModal;
