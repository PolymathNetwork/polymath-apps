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
import { addAddressToPartialExempt } from '../../../actions/compliance';

type Props = {
  isOpen: boolean,
  handleClose: () => any,
};

const formSchema = validator.object().shape({
  address: validator
    .string()
    .isAddress('Invalid Address')
    .isRequired('Required'),
});

export const AddPartialTransferComponent = ({ handleSubmit, handleClose }) => (
  <Form onSubmit={handleSubmit}>
    <FormItem name="address">
      <Heading className="form-item-header" variant="h3">
        Wallet Address
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
  displayName: 'PartialAddressForm',
  validateOnChange: false,
  handleSubmit: (values, { setFieldError, props }) => {
    const { dispatch, partialAddresses } = props;
    const addressExists = partialAddresses.find(
      i => i.address === values.address
    );
    if (addressExists) {
      setFieldError('address', 'Address is already added to Whitelist Manager');
      return;
    }
    props.handleClose();
    dispatch(addAddressToPartialExempt(values.address));
  },
});

const mapStateToProps = state => ({
  partialAddresses: state.whitelist.partialAddresses,
});

const FormikEnhancedForm = formikEnhancer(AddPartialTransferComponent);
const ConnectedForm = connect(mapStateToProps)(FormikEnhancedForm);

class PartialTransferModal extends Component<Props> {
  render() {
    const { isOpen, handleClose } = this.props;
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Header variant="alert">
          Add Partial Transfer Exemption Address
        </Modal.Header>
        <Modal.Body>
          <p>
            Specify the address of an exemption. Each address will have
            permission to receive an unlimited amount of tokens. Consult with
            your legal team before adding a new wallet to the list.
          </p>
          <ConnectedForm handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    );
  }
}

export default PartialTransferModal;
