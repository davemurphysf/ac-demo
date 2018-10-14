import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

import axios from 'axios';

axios.defaults.baseURL = 'https://ac.ac.lyscnd.com';

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
