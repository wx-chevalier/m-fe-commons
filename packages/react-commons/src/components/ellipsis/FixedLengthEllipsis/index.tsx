import './index.css';

import { Tooltip } from 'antd';
import classNames from 'classnames';
import React, { Component } from 'react';

/* eslint no-param-reassign: 0 */

const isSupportLineClamp = document.body.style.webkitLineClamp !== undefined;

export interface IFixedLengthEllipsisProps {
  tooltip?: boolean;
  length?: number;
  lines?: number;
  style?: React.CSSProperties;
  className?: string;
  fullWidthRecognition?: boolean;
  children?: string;
}

const TooltipOverlayStyle: React.CSSProperties = {
  overflowWrap: 'break-word',
  wordWrap: 'break-word',
};

export const getStrFullLength = (str = '') =>
  str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      return pre + 1;
    }
    return pre + 2;
  }, 0);

export const cutStrByFullLength = (str = '', maxLength: number) => {
  let showLength = 0;
  return str.split('').reduce((pre, cur) => {
    const charCode = cur.charCodeAt(0);
    if (charCode >= 0 && charCode <= 128) {
      showLength += 1;
    } else {
      showLength += 2;
    }
    if (showLength <= maxLength) {
      return pre + cur;
    }
    return pre;
  }, '');
};

const EllipsisText = ({
  text,
  length,
  tooltip,
  fullWidthRecognition,
  ...other
}: IFixedLengthEllipsisProps & { text: string }) => {
  if (typeof text !== 'string') {
    throw new Error('Ellipsis children must be string.');
  }
  const textLength = fullWidthRecognition ? getStrFullLength(text) : text.length;
  if (textLength <= length || length < 0) {
    return <span {...other}>{text}</span>;
  }
  const tail = '...';
  let displayText;
  if (length - tail.length <= 0) {
    displayText = '';
  } else {
    displayText = fullWidthRecognition ? cutStrByFullLength(text, length) : text.slice(0, length);
  }

  if (tooltip) {
    return (
      <Tooltip overlayStyle={TooltipOverlayStyle} title={text}>
        <span>
          {displayText}
          {tail}
        </span>
      </Tooltip>
    );
  }

  return (
    <span {...other}>
      {displayText}
      {tail}
    </span>
  );
};

export class FixedLengthEllipsis extends Component<IFixedLengthEllipsisProps> {
  state = {
    text: '',
    targetCount: 0,
  };

  root: any;
  node: any;
  shadowChildren: any;
  content: any;
  shadow: any;

  componentDidMount() {
    if (this.node) {
      this.computeLine();
    }
  }

  componentDidUpdate(perProps: IFixedLengthEllipsisProps) {
    const { lines } = this.props;
    if (lines !== perProps.lines) {
      this.computeLine();
    }
  }

  computeLine = () => {
    const { lines } = this.props;
    if (lines && !isSupportLineClamp) {
      const text = this.shadowChildren.innerText;
      const lineHeight = parseInt(getComputedStyle(this.root).lineHeight, 10);
      const targetHeight = lines * lineHeight;
      this.content.style.height = `${targetHeight}px`;
      const totalHeight = this.shadowChildren.offsetHeight;
      const shadowNode = this.shadow.firstChild;

      if (totalHeight <= targetHeight) {
        this.setState({
          text,
          targetCount: text.length,
        });
        return;
      }

      // bisection
      const len = text.length;
      const mid = Math.ceil(len / 2);

      const count = this.bisection(targetHeight, mid, 0, len, text, shadowNode);

      this.setState({
        text,
        targetCount: count,
      });
    }
  };

  bisection = (
    th: number,
    m: number,
    b: number,
    e: any,
    text: string,
    shadowNode: { innerHTML: string; offsetHeight: any }
  ): any => {
    const suffix = '...';
    let mid = m;
    let end = e;
    let begin = b;
    shadowNode.innerHTML = text.substring(0, mid) + suffix;
    let sh = shadowNode.offsetHeight;

    if (sh <= th) {
      shadowNode.innerHTML = text.substring(0, mid + 1) + suffix;
      sh = shadowNode.offsetHeight;
      if (sh > th || mid === begin) {
        return mid;
      }
      begin = mid;
      if (end - begin === 1) {
        mid = 1 + begin;
      } else {
        mid = Math.floor((end - begin) / 2) + begin;
      }
      return this.bisection(th, mid, begin, end, text, shadowNode);
    }
    if (mid - 1 < 0) {
      return mid;
    }
    shadowNode.innerHTML = text.substring(0, mid - 1) + suffix;
    sh = shadowNode.offsetHeight;
    if (sh <= th) {
      return mid - 1;
    }
    end = mid;
    mid = Math.floor((end - begin) / 2) + begin;
    return this.bisection(th, mid, begin, end, text, shadowNode);
  };

  handleRoot = (n: any) => {
    this.root = n;
  };

  handleContent = (n: any) => {
    this.content = n;
  };

  handleNode = (n: any) => {
    this.node = n;
  };

  handleShadow = (n: any) => {
    this.shadow = n;
  };

  handleShadowChildren = (n: any) => {
    this.shadowChildren = n;
  };

  render() {
    const { text, targetCount } = this.state;
    const {
      children,
      lines,
      length,
      className,
      tooltip,
      fullWidthRecognition,
      ...restProps
    } = this.props;

    const cls = classNames('fixed-length-ellipsis', className, {
      ['fixed-length-ellipsis-lines']: lines && !isSupportLineClamp,
      ['fixed-length-ellipsis-line-clamp']: lines && isSupportLineClamp,
    });

    if (!lines && !length) {
      return (
        <span className={cls} {...restProps}>
          {children}
        </span>
      );
    }

    // length
    if (!lines) {
      return (
        <EllipsisText
          className={cls}
          length={length}
          text={children || ''}
          tooltip={tooltip}
          fullWidthRecognition={fullWidthRecognition}
          {...restProps}
        />
      );
    }

    const id = `antd-pro-ellipsis-${`${new Date().getTime()}${Math.floor(Math.random() * 100)}`}`;

    // support document.body.style.webkitLineClamp
    if (isSupportLineClamp) {
      const style = `#${id}{-webkit-line-clamp:${lines};-webkit-box-orient: vertical;}`;
      return (
        <div id={id} className={cls} {...restProps}>
          <style>{style}</style>
          {tooltip ? (
            <Tooltip overlayStyle={TooltipOverlayStyle} title={children}>
              {children}
            </Tooltip>
          ) : (
            children
          )}
        </div>
      );
    }

    const childNode = (
      <span ref={this.handleNode}>
        {targetCount > 0 && text.substring(0, targetCount)}
        {targetCount > 0 && targetCount < text.length && '...'}
      </span>
    );

    return (
      <div {...restProps} ref={this.handleRoot} className={cls}>
        <div ref={this.handleContent}>
          {tooltip ? (
            <Tooltip overlayStyle={TooltipOverlayStyle} title={text}>
              {childNode}
            </Tooltip>
          ) : (
            childNode
          )}
          <div className={'shadow'} ref={this.handleShadowChildren}>
            {children}
          </div>
          <div className={'shadow'} ref={this.handleShadow}>
            <span>{text}</span>
          </div>
        </div>
      </div>
    );
  }
}
