import { Button, Result } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { getI18nFormat } from '../../env';

export const Exception403 = () => (
  <Result
    status="403"
    title="403"
    style={{
      background: 'none',
    }}
    subTitle={getI18nFormat()('对不起，您无权访问')}
    extra={
      <Link to="/">
        <Button type="primary">{getI18nFormat()('返回')}</Button>
      </Link>
    }
  />
);
