import cn from 'classnames';
import React from 'react';
import Loadable from 'react-loadable';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { ResolvedModule } from '../../types';
import { PageLoading } from '..';
import { Exception500 } from '../Exception/Exception500';

export interface IProps extends RouteComponentProps {
  appId: string;
  appLoader: () => Promise<ResolvedModule>;

  className?: string;
  fallback?: JSX.Element;

  onAppendReducer?: (reducer: { [key: string]: any | undefined }) => void;
}

export interface ILoadableContainerCompState {
  appError?: {
    error: Record<string, unknown>;
    errorInfo: Record<string, unknown>;
  };
}

// 应用缓存
const appCache: Record<string, Promise<ResolvedModule>> = {};

/**
 * 应用懒加载与容错的容器
 */
class LoadableContainerComp extends React.PureComponent<IProps, ILoadableContainerCompState> {
  static defaultProps: Partial<IProps> = {
    fallback: <PageLoading />,
  };

  state: ILoadableContainerCompState = {
    appError: null,
  };

  shouldComponentUpdate(nextProps: IProps) {
    // 仅当路径发生变化时候才进行重渲染
    if (this.props.location.pathname !== nextProps.location.pathname) {
      return true;
    }

    return false;
  }

  loadApp = () => {
    const { appLoader, appId, onAppendReducer } = this.props;

    if (appCache[appId]) {
      return appCache[appId];
    }

    const app = appLoader().then((appModule) => {
      if ('reducer' in appModule && onAppendReducer) {
        onAppendReducer({
          [appId]: appModule.reducer,
        });
      }

      return appModule;
    });

    appCache[appId] = app;

    return app;
  };

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ appError: { error, errorInfo } });
  }

  renderErrorPage() {
    const { appError } = this.state;

    return (
      <Exception500
        subTitle={appError !== null ? JSON.stringify((appError as any).errorInfo) : null}
      />
    );
  }

  render() {
    const { className } = this.props;
    const { appError } = this.state;

    if (appError) {
      return this.renderErrorPage();
    }

    const LoadableComponent = Loadable({
      loader: this.loadApp,
      loading: PageLoading as any,
    });

    return (
      <div className={cn(className)}>
        <LoadableComponent />
      </div>
    );
  }
}

export const LoadableContainer = withRouter(LoadableContainerComp);
