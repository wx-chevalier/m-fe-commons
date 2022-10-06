import { PickerTimeProps } from 'antd/es/date-picker/generatePicker';
import { Dayjs } from 'dayjs';
import * as React from 'react';

import { AntdDayjsDatePicker } from './AntdDayjsDatePicker';

export interface TimePickerProps extends Omit<PickerTimeProps<Dayjs>, 'picker'> {}

export const TimePicker = React.forwardRef<any, TimePickerProps>((props, ref) => {
  return <AntdDayjsDatePicker {...props} picker="time" mode={undefined} ref={ref} />;
});

TimePicker.displayName = 'TimePicker';
