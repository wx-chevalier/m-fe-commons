import { PickerTimeProps } from 'antd/es/date-picker/generatePicker';
import { Dayjs } from 'dayjs';
import * as React from 'react';

import { AntdDayjsDatePicker } from './AntdDayjsDatePicker';

export interface AntdDayjsTimePickerProps extends Omit<PickerTimeProps<Dayjs>, 'picker'> {}

export const AntdDayjsTimePicker = React.forwardRef<any, AntdDayjsTimePickerProps>((props, ref) => {
  return <AntdDayjsDatePicker {...props} picker="time" mode={undefined} ref={ref} />;
});

AntdDayjsTimePicker.displayName = 'AntdDayjsTimePicker';
