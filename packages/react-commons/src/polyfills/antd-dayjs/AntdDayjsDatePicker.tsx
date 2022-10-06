import 'antd/es/date-picker/style';

import generatePicker from 'antd/es/date-picker/generatePicker';
import { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';

export const AntdDayjsDatePicker = generatePicker<Dayjs>(dayjsGenerateConfig as any);
