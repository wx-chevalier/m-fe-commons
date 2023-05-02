import './index.css';

import {
  PageHeader as AntdPageHeader,
  PageHeaderProps as AntdPageHeaderProps,
} from '@ant-design/pro-components';
import React from 'react';

export interface PageHeaderProps extends AntdPageHeaderProps {}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div className="m-fe-commons-page-header-container">
      <AntdPageHeader {...props} />
    </div>
  );
}
