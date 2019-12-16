import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  PageCentered,
  Button,
  Toaster,
  notify,
  Grid,
} from '@polymathnetwork/ui';
import { connect } from 'react-redux';
import { fetchTickerList } from '../../actions/account';
import TickerCard from './components/TickerCard';
import ConfigCard from './components/ConfigCard';

class HomePage extends Component {
  async componentDidMount() {
    await this.props.fetchTickerList();
    if (this.props.tickers.length === 0) {
      this.props.history.push('/ticker');
    }
  }

  render() {
    const { tickers } = this.props;
    return (
      <PageCentered>
        <Grid>
          <Grid.Row>
            <Grid.Col gridSpan={12}>
              <h1>Manage your security tokens</h1>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col gridSpan={4}>
              <ConfigCard />
            </Grid.Col>
            {tickers.map(ticker => {
              return (
                <Grid.Col gridSpan={4}>
                  <TickerCard ticker={ticker} />
                </Grid.Col>
              );
            })}
          </Grid.Row>
        </Grid>
      </PageCentered>
    );
  }
}

const mapStateToProps = state => ({
  tickers: state.account.tickers,
});

const mapDispatchToProps = {
  fetchTickerList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
