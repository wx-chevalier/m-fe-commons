import { ComponentType } from 'react';

export interface ResolvedModule {
  default: ComponentType<any>;
  reducer?: Record<string, unknown>;
}

export interface Module {
  id: string;
  getName: () => string;
  type: 'page' | 'module' | 'app' | 'widget' | 'extension';

  getMenu?: () => {};
  component?: React.ComponentType;
  loader?: () => Promise<ResolvedModule>;
}
