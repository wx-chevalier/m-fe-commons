import { History } from 'history';

const defaultStringToValue = (str: string) => {
  if (str === 'null') {
    return null;
  }

  if (str === 'undefined') {
    return undefined;
  }

  if (str === 'true') {
    return true;
  }

  if (str === 'false') {
    return false;
  }

  if (!Number.isNaN(Number(str))) {
    return Number(str);
  }

  return str;
};

/** 从查询字符串中获取到查询参数 */
export function getQueryValues(
  history: History,
  params: {
    [key: string]: {
      defaultValue?: any;
      stringToValue?: any;
    };
  },
) {
  const searchStr: string = history.location.search;

  const locationParams = new URLSearchParams(searchStr);
  const queryValues = {};

  Object.keys(params).forEach(param => {
    const { defaultValue, stringToValue = defaultStringToValue } = params[
      param
    ];
    const valueString = locationParams.get(param);
    const value = !valueString ? defaultValue : stringToValue(valueString);
    queryValues[param] = value;
  });

  return queryValues;
}

const valueToString = (v: string | boolean | number) => `${v}`;

/** 更新查询参数值，注意，这里是针对 History 进行处理，其并不会引发 Url 的刷新变化 */
export function updateQueryValues(
  history: History,
  queryValues: Record<string, string | number | boolean | undefined>,
) {
  const searchStr: string = history.location.search;

  const locationParams = new URLSearchParams(searchStr);

  Object.keys(queryValues).forEach(param => {
    const rv = queryValues[param];
    if (rv == null || rv == undefined || rv == 'undefined') {
      locationParams.delete(param);
      return;
    }

    const value = valueToString(rv);
    locationParams.set(param, valueToString(value));
  });

  const newLocationSearchString = `?${locationParams}`;
  const oldLocationSearchString = location.search || '?';

  // Only update location if anything changed.
  if (newLocationSearchString !== oldLocationSearchString) {
    // Update location (but prevent triggering a state update).
    const newLocation = {
      pathname: history.location.pathname,
      search: newLocationSearchString,
      hash: history.location.hash,
      state: history.location.state,
    };

    history.push(newLocation);
  }
}
