import { getI18nFormat } from '@m-fe/utils';
import { Button, Result } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';

export const Exception404 = () => (
  <Result
    status="404"
    title="404"
    style={{
      background: 'none',
    }}
    subTitle={getI18nFormat()('对不起，您访问的页面不存在或无权访问')}
    extra={
      <Link to="/">
        <div>
          <div style={{ marginBottom: 16 }} />
          <Button type="primary">{getI18nFormat()('返回')}</Button>
        </div>
      </Link>
    }
  />
);
