import './index.css';

import { PageHeader as AntdPageHeader } from 'antd';
import { PageHeaderProps as AntdPageHeaderProps } from 'antd/es/page-header';
import React from 'react';

export interface PageHeaderProps extends AntdPageHeaderProps {}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div className="m-fe-commons-page-header-container">
      <AntdPageHeader {...props} />
    </div>
  );
}
