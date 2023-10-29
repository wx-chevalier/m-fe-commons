import { Button as AntdButton } from 'antd';
import { Button as AMButton } from 'antd-mobile';
import React from 'react';
import * as ReactDOM from 'react-dom';

import './index.less';

ReactDOM.render(
  <div>
    <AntdButton type="primary">Ant</AntdButton>
    <AMButton type="primary">AMButton</AMButton>
  </div>,
  document.getElementById('root'),
);
