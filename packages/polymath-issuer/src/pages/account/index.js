import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PageCentered, Button, Toaster, notify } from '@polymathnetwork/ui';
import { connect } from 'react-redux';
import { fetchTickerList } from '../../actions/account';

class HomePage extends Component {
  componentDidMount() {
    this.props.fetchTickerList();
  }

  render() {
    const { tickers } = this.props;
    return (
      <PageCentered title="Polymath" justifyContent="start">
        {tickers.map(ticker => {
          return <Link to={`/dashboard/${ticker}`}>{ticker}</Link>;
        })}
        <Link to="/ticker">Create New Token</Link>
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
