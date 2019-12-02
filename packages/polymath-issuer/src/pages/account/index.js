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
            <p>
              <Link to="/ticker">
                <Button id="create-token-btn" icon="arrow--right">
                  Continue to create your security token
                </Button>
              </Link>
            </p>
          </Grid.Row>
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
