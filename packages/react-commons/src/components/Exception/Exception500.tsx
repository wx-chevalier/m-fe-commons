import { Button, Result } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { getI18nFormat } from '../../env';

export const Exception500 = ({ subTitle }: { subTitle: string }) => (
  <Result
    status="500"
    title="500"
    style={{
      background: 'none',
    }}
    subTitle={subTitle || getI18nFormat()('服务器或网络错误！')}
    extra={
      <Link to="/">
        <Button type="primary">{getI18nFormat()('返回')}</Button>
      </Link>
    }
  />
);
