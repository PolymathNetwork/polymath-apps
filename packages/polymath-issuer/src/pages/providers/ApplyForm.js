import React from 'react';
import { Form, Button } from 'carbon-components-react';
import { connect } from 'react-redux';
import { withFormik } from 'formik';
import {
  Grid,
  Tooltip,
  FormItem,
  TextInput,
  TextArea,
} from '@polymathnetwork/ui';
import validator from '@polymathnetwork/ui/validator';
import { MAINNET_NETWORK_ID } from '@polymathnetwork/shared/constants';
import { applyProviders } from '../../actions/providers';

const requiredMessage = 'Required.';
// eslint-disable-next-line no-template-curly-in-string
const maxMessage = 'Must be ${max} characters or fewer.';
const urlMessage = 'Invalid URL (example: http(s)://www.example.com).';

const formSchema = validator.object().shape({
  companyName: validator
    .string()
    .isRequired(requiredMessage)
    .max(100, maxMessage),
  companyDesc: validator
    .string()
    .isRequired(requiredMessage)
    .max(300, maxMessage),
  operatedIn: validator
    .string()
    .isRequired(requiredMessage)
    .max(100, maxMessage),
  incorporatedIn: validator
    .string()
    .isRequired(requiredMessage)
    .max(100, maxMessage),
  projectURL: validator
    .string()
    .isRequired(requiredMessage)
    .isUrl(urlMessage),
  profilesURL: validator
    .string()
    .isRequired(requiredMessage)
    .isUrl(urlMessage),
  structureURL: validator
    .string()
    .isRequired(requiredMessage)
    .isUrl(urlMessage),
  otherDetails: validator.string().max(300, maxMessage),
});

const linkTooltip = (title: string) => (
  <Tooltip triggerText={title}>
    <p>
      <strong>Links</strong>
    </p>
    <p>
      Paste links to the file/folder from your preferred file sharing service.
      <br />
      For example: Dropbox, Google Drive, etc. For added security, you may
      password protect the files located in the shared folder. Alternatively,
      you may enter a link to your Investor Relations page.
    </p>
  </Tooltip>
);

export const ApplyFormComponent = props => {
  const { handleSubmit, onClose, networkId } = props;
  return (
    <Form onSubmit={handleSubmit}>
      <Grid>
        <FormItem name="companyName">
          <FormItem.Label>Company Name</FormItem.Label>
          <FormItem.Input
            component={TextInput}
            placeholder="Enter company name"
          />
          <FormItem.Error />
        </FormItem>

        <FormItem name="companyDesc">
          <FormItem.Label>Company Description</FormItem.Label>
          <FormItem.Input
            component={TextArea}
            placeholder="Enter company description"
          />
          <FormItem.Error />
        </FormItem>

        <FormItem name="operatedIn">
          <FormItem.Label>Jurisdiction of Operation</FormItem.Label>
          <FormItem.Input
            component={TextInput}
            placeholder="Enter jurisdiction of operation"
          />
          <FormItem.Error />
        </FormItem>

        <FormItem name="incorporatedIn">
          <FormItem.Label>Jurisdiction of Incorporation</FormItem.Label>
          <FormItem.Input
            component={TextInput}
            placeholder="Enter jurisdiction of incorporation"
          />
          <FormItem.Error />
        </FormItem>

        <FormItem name="projectURL">
          <FormItem.Label>
            {linkTooltip('Corporate/Project Presentation')}
          </FormItem.Label>
          <FormItem.Input component={TextInput} placeholder="Paste link here" />
          <FormItem.Error />
        </FormItem>

        <FormItem name="profilesURL">
          <FormItem.Label>
            {linkTooltip('Management and Board Member Profiles')}
          </FormItem.Label>
          <FormItem.Input component={TextInput} placeholder="Paste link here" />
          <FormItem.Error />
        </FormItem>

        <FormItem name="structureURL">
          <FormItem.Label>
            {linkTooltip('Corporate or Project Structure/Organization')}
          </FormItem.Label>
          <FormItem.Input component={TextInput} placeholder="Paste link here" />
          <FormItem.Error />
        </FormItem>

        <FormItem name="otherDetails">
          <FormItem.Label>Other Details</FormItem.Label>
          <FormItem.Input component={TextArea} placeholder="Start text here" />
          <FormItem.Error />
        </FormItem>
      </Grid>

      <p align="right">
        <Button kind="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" style={{ width: '154px' }}>
          Submit
        </Button>
      </p>

      {networkId === MAINNET_NETWORK_ID ? (
        <p className="pui-input-hint">
          When you click submit, an email which contains the information entered
          on that screen will be sent to the Advisory firm(s) you have selected.
          None of this information is stored on Polymath servers, only your
          browser&apos;s cache. To clear this information, simply clear your
          browser&apos;s cache.
        </p>
      ) : (
        <p className="pui-input-hint">
          <strong>
            <em>
              You are using Token Studio in a testnet environment. When you
              click submit, an email WILL NOT be sent to the providers you have
              selected. To send an email to the selected providers, please log
              into Token Studio with mainnet.
              <br />
              None of this information is stored on Polymath servers, only your
              browser&apos;s cache. To clear this information, simply clear your
              browser&apos;s cache.
            </em>
          </strong>
        </p>
      )}
      <br />
    </Form>
  );
};

const mapStateToProps = ({
  providers: { application },
  network: { id: networkId },
}) => ({ application, networkId });

const formikEnhancer = withFormik({
  validationSchema: formSchema,
  displayName: 'ApplyForm',
  validatOnChange: false,
  mapPropsToValues: ({ application }) => {
    const {
      companyName,
      companyDesc,
      operatedIn,
      incorporatedIn,
      projectURL,
      profilesURL,
      structureURL,
      otherDetails,
    } = application;

    return {
      companyName: companyName || '',
      companyDesc: companyDesc || '',
      operatedIn: operatedIn || '',
      incorporatedIn: incorporatedIn || '',
      projectURL: projectURL || '',
      profilesURL: profilesURL || '',
      structureURL: structureURL || '',
      otherDetails: otherDetails || '',
    };
  },
  handleSubmit: (values, { props }) => {
    const { dispatch, selectedProviders, onClose } = props;

    dispatch(applyProviders(selectedProviders, values));
    onClose();
  },
});

const FormikEnhancedForm = formikEnhancer(ApplyFormComponent);
export default connect(mapStateToProps)(FormikEnhancedForm);
