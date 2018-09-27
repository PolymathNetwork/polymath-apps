import React from 'react';
import { Provider } from 'react-redux';

import '../style.scss';

const Wrapper = ({ children }) => <Provider store={{}}>{children}</Provider>;

export default Wrapper;
