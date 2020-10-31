export const CANCEL_KEY = 'redux-middleware-throttle/CANCEL';
export const FLUSH_KEY = 'redux-middleware-throttle/FLUSH';
export interface FsaAction {
  type: string;
  payload: any;
  meta: any;
}
