import './index.css';

import { ArrowLeftOutlined } from '@ant-design/icons';
import {
  PageHeader as AntdPageHeader,
  PageHeaderProps as AntdPageHeaderProps,
} from '@ant-design/pro-components';
import React from 'react';

export interface PageHeaderProps extends AntdPageHeaderProps {}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div className="m-fe-commons-page-header-container">
      <AntdPageHeader backIcon={<ArrowLeftOutlined />} {...props} />
    </div>
  );
}
