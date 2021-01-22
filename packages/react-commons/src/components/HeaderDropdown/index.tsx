import './index.css';

import { Dropdown } from 'antd';
import { DropDownProps } from 'antd/es/dropdown';
import classNames from 'classnames';
import * as React from 'react';

export interface HeaderDropdownProps extends DropDownProps {
  overlayClassName?: string;
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
}

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
  overlayClassName: cls,
  ...restProps
}) => (
  <Dropdown overlayClassName={classNames('m-fe-header-dropdown-container', cls)} {...restProps} />
);
