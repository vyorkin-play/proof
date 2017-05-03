import * as React from 'react';
import * as classnames from 'classnames';
import { connect } from 'react-redux';
import { withHandlers, compose } from 'recompose';

import { CellOwnProps, CellProps } from './types';
import { cellSelector } from './selectors';
import { getKey } from './utils';
import * as styles from './styles.css';

const Cell = (props: CellProps) => (
  <div
    key={props.key}
    className={classnames(styles.cell, { [styles.enabled]: props.enabled })}
    style={props.style}
    onClick={props.handleClick}
  >
    {props.value}
  </div>
);

export default compose<CellProps, CellOwnProps>(
  connect(cellSelector),
  withHandlers({
    handleClick: (props: CellOwnProps) =>
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        props.onClick(props.rowIndex, props.columnIndex)
      },
  }),
)(Cell);
