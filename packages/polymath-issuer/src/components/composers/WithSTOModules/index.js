// @flow

import { Component } from 'react';
import { connect } from 'react-redux';
import { fetch } from '../../../actions/stoModules';

import type { Node } from 'react';
import type { Dispatch } from 'redux';
import type { RootState } from '../../../redux/reducer';
import type { STOModulesState } from '../../../reducers/stoModules';

type STOModules = $PropertyType<STOModulesState, 'modules'>;

type OwnProps = {|
  render: ({ data: STOModules | null }) => Node,
|};

type StateProps = {|
  modules: STOModules,
  fetched: boolean,
  dispatch: Dispatch<any>,
|};

type Props = StateProps & OwnProps;

const mapStateToProps = ({ stoModules: { modules, fetched } }: RootState) => ({
  modules,
  fetched,
});

class WithSTOModules extends Component<Props> {
  componentDidMount() {
    const { fetched, dispatch } = this.props;

    if (!fetched) {
      dispatch(fetch()).catch(err => {
        throw err;
      });
    }
  }
  render() {
    const { modules, fetched } = this.props;
    const loading = !fetched;

    return this.props.render({ data: modules, loading });
  }
}

export default connect(mapStateToProps)(WithSTOModules);
