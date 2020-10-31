type Dictionary<K extends keyof any, T> = { [P in K]?: T };

const DEFAULT_VALUES = {
  emitDelay: 10,
  strictMode: false,
};

export class EventEmitter<T extends string = string> {
  _emitDelay: number;
  _strictMode: boolean;
  events: T[];
  _listeners: Dictionary<
    T,
    {
      once: boolean;
      fn: Function;
    }[]
  >;
  /**
   * @constructor
   * @param {{}}      [opts]
   * @param {number}  [opts.emitDelay = 10] - Number in ms. Specifies whether emit will be sync or async. By default - 10ms. If 0 - fires sync
   * @param {boolean} [opts.strictMode = false] - is true, Emitter throws error on emit error with no listeners
   */
  constructor(opts = DEFAULT_VALUES) {
    let emitDelay, strictMode;

    if (opts.hasOwnProperty('emitDelay')) {
      emitDelay = opts.emitDelay;
    } else {
      emitDelay = DEFAULT_VALUES.emitDelay;
    }
    this._emitDelay = emitDelay;

    if (opts.hasOwnProperty('strictMode')) {
      strictMode = opts.strictMode;
    } else {
      strictMode = DEFAULT_VALUES.strictMode;
    }
    this._strictMode = strictMode;

    this._listeners = {};
    this.events = [];
  }

  /**
   * @protected
   * @param {string} type
   * @param {function} listener
   * @param {boolean} [once = false]
   */
  _addListenner(type: T, listener: Function, once: boolean) {
    if (typeof listener !== 'function') {
      throw TypeError('listener must be a function');
    }

    if (this.events.indexOf(type) === -1) {
      this._listeners[type] = [
        {
          once: once,
          fn: listener,
        },
      ];
      this.events.push(type);
    } else {
      this._listeners[type].push({
        once: once,
        fn: listener,
      });
    }
  }

  /**
   * Subscribes on event type specified function
   * @param {string} type
   * @param {function} listener
   */
  on(type: T, listener: Function) {
    this._addListenner(type, listener, false);
  }

  /**
   * Subscribes on event type specified function to fire only once
   * @param {string} type
   * @param {function} listener
   */
  once(type: T, listener: Function) {
    this._addListenner(type, listener, true);
  }

  /**
   * Removes event with specified type. If specified listenerFunc - deletes only one listener of specified type
   * @param {string} eventType
   * @param {function} [listenerFunc]
   */
  off(eventType: T, listenerFunc: Function) {
    const typeIndex = this.events.indexOf(eventType);
    const hasType = eventType && typeIndex !== -1;

    if (hasType) {
      if (!listenerFunc) {
        delete this._listeners[eventType];
        this.events.splice(typeIndex, 1);
      } else {
        const removedEvents: number[] = [];
        const typeListeners = this._listeners[eventType];

        typeListeners.forEach(
          /**
           * @param {EventEmitterListenerFunc} fn
           * @param {number} idx
           */
          (fn, idx) => {
            if (fn.fn === listenerFunc) {
              removedEvents.unshift(idx);
            }
          },
        );

        removedEvents.forEach(idx => {
          typeListeners.splice(idx, 1);
        });

        if (!typeListeners.length) {
          this.events.splice(typeIndex, 1);
          delete this._listeners[eventType];
        }
      }
    }
  }

  /**
   * Applies arguments to specified event type
   * @param {string} eventType
   * @param {*[]} eventArguments
   * @protected
   */
  _applyEvents(eventType: T, eventArguments: any) {
    const typeListeners = this._listeners[eventType];

    if (!typeListeners || !typeListeners.length) {
      if (this._strictMode) {
        throw 'No listeners specified for event: ' + eventType;
      } else {
        return;
      }
    }

    const removableListeners: number[] = [];
    typeListeners.forEach((eeListener, idx) => {
      eeListener.fn.apply(null, eventArguments);
      if (eeListener.once) {
        removableListeners.unshift(idx);
      }
    });

    removableListeners.forEach(idx => {
      typeListeners.splice(idx, 1);
    });
  }

  /**
   * Emits event with specified type and params.
   * @param {string} type
   * @param eventArgs
   */
  emit(type: T, ...eventArgs: any[]) {
    if (this._emitDelay) {
      setTimeout(() => {
        this._applyEvents(type, eventArgs);
      }, this._emitDelay);
    } else {
      this._applyEvents(type, eventArgs);
    }
  }

  /**
   * Emits event with specified type and params synchronously.
   * @param {string} type
   * @param eventArgs
   */
  emitSync(type: T, ...eventArgs: any[]) {
    this._applyEvents(type, eventArgs);
  }

  /**
   * Destroys EventEmitter
   */
  destroy() {
    this._listeners = {};
    this.events = [];
  }
}
