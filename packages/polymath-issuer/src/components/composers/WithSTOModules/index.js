// @flow

import { Component } from 'react';
import { connect } from 'react-redux';
import { fetch } from '../../../actions/stoModules';

import type { Node } from 'react';
import type { Dispatch } from 'redux';
import type { RootState } from '../../../redux/reducer';

type StoModules = $PropertyType<RootState, 'stoModules'>[];

type OwnProps = {|
  render: ({ stoModules: StoModules | null }) => Node,
|};

type StateProps = {|
  stoModules?: StoModules,
  dispatch: Dispatch<any>,
|};

type Props = StateProps & OwnProps;

const mapStateToProps = ({ stoModules }: RootState) => ({
  stoModules,
});

export class WithSTOModules extends Component<Props> {
  componentDidMount() {
    const { stoModules, dispatch } = this.props;
    if (!stoModules) {
      dispatch(fetch()).catch(err => {
        throw err;
      });
    }
  }
  render() {
    let { stoModules } = this.props;

    stoModules = stoModules || null;

    return this.props.render({ stoModules });
  }
}

export default connect(mapStateToProps)(WithSTOModules);
