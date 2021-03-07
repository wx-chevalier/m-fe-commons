import React from 'react';

export abstract class IntervalComponent<P, S> extends React.PureComponent<P, S> {
  intervalHandler: any;
  interval: number;

  componentDidMount() {
    if (this.onInterval) {
      this.onInterval();
    }

    this.intervalHandler = setInterval(() => {
      if (this.onInterval) {
        this.onInterval();
      }
    }, this.interval || 15 * 1000);
  }

  componentWillUnmount() {
    if (this.intervalHandler) {
      clearInterval(this.intervalHandler);
    }
  }

  onInterval: () => void;
}
