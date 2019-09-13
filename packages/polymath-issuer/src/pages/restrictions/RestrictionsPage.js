import React, { Component } from 'react';
import {
  addressShortifier,
  confirm,
  ico24H,
  etherscanAddress,
  NotFoundPage,
  Page,
  Grid,
  Remark,
  RadioInput,
  FormItem,
} from '@polymathnetwork/ui';
import { connect } from 'react-redux';
import {
  Heading,
  CardFeatureState,
  icons,
  ThemeProvider,
  ButtonLarge,
} from '@polymathnetwork/new-ui';
import { Toggle, Tabs, Tab, Form } from 'carbon-components-react';
import { toggleRestrictions } from '../../actions/restrictions';
import { withFormik } from 'formik';
import GlobalRestrictionsForm from './components/GlobalRestrictionsForm';
import IndividualRestrictions from './components/IndividualRestrictions';
import FormModal from './components/FormModal';
import RestrictionDetails from './components/RestrictionDetails';
import './style.scss';
import {
  addVolumeRestrictionModule,
  getVolumeRestrictionModule,
  archiveVolumeRestrictionModule,
} from '../../actions/restrictions';

class RestrictionsPage extends Component {
  state = {
    isFormModalOpen: false,
    restrictionType: null,
  };

  componentWillMount() {
    this.props.getVolumeRestrictionModule();
  }

  handleOpen = restrictionType => {
    this.setState({ isFormModalOpen: true, restrictionType: restrictionType });
  };

  handleClose = () => {
    this.setState({ isFormModalOpen: false });
  };

  handleToggleRestrictions = async (isToggled: boolean) => {
    const {
      archiveVolumeRestrictionModule,
      addVolumeRestrictionModule,
    } = this.props;
    if (isToggled) {
      addVolumeRestrictionModule();
    } else {
      archiveVolumeRestrictionModule();
    }
  };

  render() {
    const {
      token,
      isRestrictionsToggled,
      dailyRestrictionModified,
      defaultRestrictionModified,
      dailyRestriction,
      defaultRestriction,
    } = this.props;
    const { isFormModalOpen, restrictionType } = this.state;
    if (!token || !token.address) {
      return <NotFoundPage />;
    }
    return (
      <ThemeProvider>
        <Page title="Compliance – Polymath">
          <h1 className="pui-h1">Trading Volume Restrictions</h1>
          <Grid>
            <Grid.Row>
              <Grid.Col gridSpan={6}>
                <h3 className="pui-h3">
                  Allows you to define the maximum number of tokens your
                  investors can sell during a customized rolling period. Limits
                  can be set globally for all investors or individually by
                  investor. For example, you may limit all your investors to
                  selling 100 tokens in a rolling 24-hour period and 1,000
                  tokens in a rolling 90-day period.
                </h3>
                <Remark title="Note">
                  Investors with individual investor limits are exempt from the
                  global limits.
                </Remark>
              </Grid.Col>
              <Grid.Col gridSpan={6}>
                <CardFeatureState
                  status={isRestrictionsToggled ? 'idle' : 'inactive'}
                  IconAsset={icons.SvgRestriction}
                >
                  <Heading color="primary" mt={2}>
                    Enable Enforcement of Trade Volume Restrictions
                  </Heading>
                  <div className="center">
                    <Toggle
                      onToggle={this.handleToggleRestrictions}
                      toggled={isRestrictionsToggled}
                      id="volumeRestrictionToggle"
                    />
                  </div>
                </CardFeatureState>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col gridSpan={12}>
                {isRestrictionsToggled && (
                  <Tabs>
                    <Tab label="Global Restrictions">
                      <h1 className="pui-h1">Global Restrictions</h1>
                      <h3 className="pui-h3">
                        Specify a single rolling period restriction for all
                        investors. The Global Restriction will enforce a maximum
                        number of tokens each investor can sell during the
                        rolling period you define. Easily set to 24 hours or
                        customize your rolling period. Your trade volume cap is
                        specified as the number or tokens or the percentage of
                        total token supply.
                      </h3>
                      <FormModal
                        isOpen={isFormModalOpen}
                        handleClose={this.handleClose}
                        restrictionType={restrictionType}
                      />
                      <Grid>
                        <Grid.Row>
                          <Grid.Col gridSpan={4}>
                            <CardFeatureState
                              style={{ height: '400px' }}
                              maxWidth="none"
                              status={
                                dailyRestrictionModified ? 'idle' : 'inactive'
                              }
                              IconAsset={icons.Svg24H}
                            >
                              <Heading color="primary" mt={2}>
                                24h Rolling Period Restriction
                              </Heading>
                              <p className="card-text">
                                Configure a maximum number of tokens any
                                investor may be able to sell within a rolling
                                24h period.
                              </p>
                              {dailyRestrictionModified && (
                                <RestrictionDetails
                                  restriction={dailyRestriction}
                                />
                              )}

                              {/* Empty div with height instead of CSS */}
                              <ButtonLarge
                                className="card-button"
                                onClick={() => this.handleOpen('24h')}
                              >
                                Configure 24h Restriction
                              </ButtonLarge>
                            </CardFeatureState>
                          </Grid.Col>
                          <Grid.Col gridSpan={4}>
                            <CardFeatureState
                              style={{ height: '400px' }}
                              maxWidth="none"
                              status={
                                defaultRestrictionModified ? 'idle' : 'inactive'
                              }
                              IconAsset={icons.SvgCalendarOutline}
                            >
                              <Heading color="primary" mt={2}>
                                Custom Rolling Period Restriction
                              </Heading>
                              <p className="card-text">
                                Configure a maximum number of tokens any
                                Investor may be able to sell within a custom
                                rolling period.
                              </p>
                              {defaultRestrictionModified && (
                                <RestrictionDetails
                                  restriction={defaultRestriction}
                                />
                              )}
                              <ButtonLarge
                                className="card-button"
                                onClick={() => this.handleOpen('custom')}
                              >
                                Configure Custom Restriction
                              </ButtonLarge>
                            </CardFeatureState>
                          </Grid.Col>
                        </Grid.Row>
                      </Grid>
                    </Tab>
                    <Tab label="Individual Restrictions">
                      <IndividualRestrictions />
                    </Tab>
                  </Tabs>
                )}
              </Grid.Col>
            </Grid.Row>
          </Grid>
        </Page>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  token: state.token.token,
  isRestrictionsToggled: state.restrictions.isToggled,
  dailyRestrictionModified: state.restrictions.dailyRestrictionModified,
  defaultRestrictionModified: state.restrictions.defaultRestrictionModified,
  dailyRestriction: state.restrictions.dailyRestriction,
  defaultRestriction: state.restrictions.defaultRestriction,
});

const mapDispatchToProps = {
  toggleRestrictions,
  addVolumeRestrictionModule,
  getVolumeRestrictionModule,
  archiveVolumeRestrictionModule,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestrictionsPage);
