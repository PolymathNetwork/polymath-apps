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

class HomePage extends Component {
  componentDidMount() {
    this.props.fetchTickerList();
  }

  render() {
    const { tickers } = this.props;
    return (
      <PageCentered>
        <Grid>
          <Grid.Row>
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
