import { EventEmitter } from '../func';
import { BaseLogger } from './BaseEntity';

/** 本地服务的状态 */
export type BaseServiceStatus =
  | 'NOT_INSTALL'
  | 'INSTALLING'
  | 'NOT_RUNNING'
  | 'RUNNING'
  /** 未响应 */
  | 'NO_RESPONSE';

export abstract class BaseService<
  T extends string = string
> extends EventEmitter<T> {
  logger: BaseLogger = console;

  abstract get displayName(): string;
  abstract init(): void | Promise<void>;
  abstract close(): void | Promise<void>;

  // 本地服务的类型
  type: T;
  // 本地服务的状态
  status: BaseServiceStatus;

  /** 清理器是否已经被初始化过 */
  hasVacuumInitialized = false;
  // 执行自动清理的间隔，每三天
  vaccumInterval = 3 * 24 * 60 * 60 * 1000;
  vaccumTimeout: NodeJS.Timeout;

  // 如果当前不适合进行自动清理，则设置重试的间隔
  retryInterval = 60 * 60 * 1000;
  retryTimeout: NodeJS.Timeout;

  /** 判断当前是否可以进行清理操作 */
  get canVacuumNow() {
    return true;
  }

  /** 是否使用定时清理器 */
  useVacuum() {
    // vacuum 首先会关闭自身，然后执行清理操作
    if (this.hasVacuumInitialized) {
      return;
    }

    this.logger.info(
      '>>>Service>>>useVacuum>>>start onVacuum>>>',
      this.displayName,
    );

    /** Todo，注意，这里定时器可能会泄露 */
    this.vaccumTimeout = setInterval(this.onVacuum, this.vaccumInterval);

    this.hasVacuumInitialized = true;
  }

  /** 执行具体的清理操作 */
  async onVacuum(force = false) {
    if (this.canVacuumNow || force) {
      this.logger.info(
        `>>>Service ${this.displayName}>>>onVacuum>>>start close`,
      );

      await this.close();

      setTimeout(async () => {
        this.logger.info(`>>>Service ${typeof this}>>>onVacuum>>>start init`);
        // 10s 之后再次重启
        await this.init();
      }, 10 * 1000);

      // 如果是经过重试触发，则执行删除操作
      if (this.retryTimeout) {
        clearInterval(this.retryTimeout);
        this.retryTimeout = undefined;
      }
    }

    if (this.onVacuum) {
      // 否则进行重试
      this.retryTimeout = setInterval(this.onVacuum, this.retryInterval);
    }
  }

  interval: number = 30 * 1000;
  intervalHandler: NodeJS.Timeout;

  onInterval() {}

  /** 执行定时操作 */
  startPolling() {
    this.stopPolling();

    // 立刻执行下定时函数
    this.onInterval();
    this.intervalHandler = setInterval(() => {
      this.onInterval();
    }, this.interval);
  }

  stopPolling() {
    if (this.intervalHandler) {
      clearInterval(this.intervalHandler);
    }
  }
}
