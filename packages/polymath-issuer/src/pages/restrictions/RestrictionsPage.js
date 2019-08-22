import React, { Component } from 'react';
import {
  addressShortifier,
  confirm,
  etherscanAddress,
  NotFoundPage,
  Page,
  Grid,
  Remark,
  RadioInput,
  FormItem,
} from '@polymathnetwork/ui';
import { connect } from 'react-redux';
import { Heading, CardFeatureState, icons } from '@polymathnetwork/new-ui';
import { ThemeProvider } from '@polymathnetwork/new-ui';
import { Toggle, Tabs, Tab, Form } from 'carbon-components-react';
import { toggleRestrictions } from '../../actions/restrictions';
import { withFormik } from 'formik';
import GlobalRestrictionsForm from './components/GlobalRestrictionsForm';
import './style.scss';

class RestrictionsPage extends Component {
  handleToggleRestrictions = async (isToggled: boolean) => {
    const { toggleRestrictions } = this.props;
    if (isToggled) {
      toggleRestrictions(true);
    } else {
      toggleRestrictions(false);
    }
  };

  render() {
    const { token, isRestrictionsToggled } = this.props;
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
                  status={'idle'}
                  IconAsset={icons.SvgDividendsOutline}
                >
                  <Heading color="primary" mt={2}>
                    Enable Enforcement of Trade Volume Restrictions
                  </Heading>
                  <Toggle
                    onToggle={this.handleToggleRestrictions}
                    toggled={isRestrictionsToggled}
                    id="percentageToggle"
                  />
                </CardFeatureState>
              </Grid.Col>
            </Grid.Row>
            <Grid.Row>
              <Grid.Col gridSpan={12}>
                <Tabs>
                  <Tab label="Global Restrictions">
                    <h1 className="pui-h1">Global Restrictions</h1>
                    <h3 className="pui-h3">
                      Specify a single rolling period restriction for all
                      investors. The Global Restriction will enforce a maximum
                      number of tokens each investor can sell during the rolling
                      period you define. Easily set to 24 hours or customize
                      your rolling period. Your trade volume cap is specified as
                      the number or tokens or the percentage of total token
                      supply.
                    </h3>
                    <div className="pui-page-box">
                      <h1 className="pui-h1">
                        Configure Custom Rolling Period
                      </h1>
                      <h3 className="pui-h3">
                        The volume restriction can be specified in number of
                        tokens or as a percentage of total supply and will be
                        enforced only between the Start Date Time and the End
                        Date Time.
                      </h3>
                      <Remark title="Note">
                        — Volume restrictions do not apply to primary issuance,
                        only to secondary trades.
                        <br />— The Global Restriction applies to each Investor
                        individually, not the aggregate of all sales across all
                        investors within the period.
                      </Remark>
                      {/* Form here */}
                      <GlobalRestrictionsForm />
                    </div>
                  </Tab>
                  <Tab label="Individual Restrictions" />
                </Tabs>
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
});

const mapDispatchToProps = {
  toggleRestrictions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RestrictionsPage);
