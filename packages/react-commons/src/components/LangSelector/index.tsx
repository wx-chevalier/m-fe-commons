import './index.css';

import { GlobalOutlined } from '@ant-design/icons';
import { getFormatMessage } from '@ant-design/pro-layout/lib/components/SettingDrawer';
import { Menu } from 'antd';
import classNames from 'classnames';
import * as React from 'react';

import { HeaderDropdown } from '../HeaderDropdown';

interface LangSelectorProps {
  className?: string;

  selectedLang: string;
  onLangSelect: ({ key }: { key: React.Key }) => void;
}

export const LangSelector: React.FC<LangSelectorProps> = (props) => {
  const { className, selectedLang, onLangSelect } = props;

  const locales = ['zh-CN', 'zh-TW', 'en-US', 'pt-BR'];
  const languageLabels = {
    'zh-CN': '简体中文',
    'zh-TW': '繁体中文',
    'en-US': 'English',
    'pt-BR': 'Português',
  };
  const languageIcons = {
    'zh-CN': '🇨🇳',
    'zh-TW': '🇭🇰',
    'en-US': '🇬🇧',
    'pt-BR': '🇧🇷',
  };

  const langMenu = (
    <Menu className="m-fe-lang-selector-menu" selectedKeys={[selectedLang]} onClick={onLangSelect}>
      {locales.map((locale) => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames('m-fe-lang-selector-dropDown', className)}>
        <GlobalOutlined title={getFormatMessage()({ id: 'navBar.lang' })} />
      </span>
    </HeaderDropdown>
  );
};
