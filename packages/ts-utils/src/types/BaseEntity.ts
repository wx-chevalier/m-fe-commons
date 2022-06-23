/* 基础模型，提供基础的数据赋值操作，以及将 createdAt, updatedAt 以及 deletedAt 进行格式转化 */
import dayjs from 'dayjs';
import upperFirst from 'lodash.upperfirst';

const DATE_TIME_FIELDS = ['createdAt', 'updatedAt', 'deletedAt'] as const;

export type EntityId = 'string';

export class BaseEntity<T = {}, I = EntityId> {
  // 唯一主键，Snowflake
  id: I;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;

  constructor(props?: Partial<T>) {
    if (!props) {
      return;
    }

    this._formatDatetime();

    Object.assign(this, props);
  }

  private _formatDatetime() {
    DATE_TIME_FIELDS.forEach(field => {
      const value = this[field];

      if (value && typeof value === 'string') {
        const dValue = dayjs(value);
        const uField = upperFirst(field);
        this[field] = dValue.format('YYYY-MM-DD HH:mm');
        this['__' + uField] = dValue;
        this['__raw' + uField] = value;
      }
    });
  }

  public toString() {
    return JSON.stringify(this);
  }
}

/** 常见的类定义 */

export class BaseKV extends BaseEntity<BaseKV> {
  key: string;
  value: string;
  type: string;
  desc: string;

  constructor(data: Partial<BaseKV> = {}) {
    super(data);

    Object.assign(this, data);
  }
}

export abstract class BaseLogger {
  abstract debug(...args: any[]): void;
  abstract log(...args: any[]): void;
  abstract info(...args: any[]): void;
  abstract warn(...args: any[]): void;
  abstract error(...args: any[]): void;
}
