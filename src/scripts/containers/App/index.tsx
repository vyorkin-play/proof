import * as React from 'react';
import { connect } from 'react-redux';
import { prop } from 'ramda';
import * as io from 'socket.io-client';
import { SectionRenderedParams } from 'react-virtualized';

import { ReceivePayload, toggle, receive } from 'modules/quotes';
import { random } from 'lib/utils';
import { Grid, getGridCellKey } from 'components';

import {
  AppOwnProps,
  AppActions,
  AppSelectedState,
  AppState,
  AppProps,
} from './types';
import * as styles from './styles.css';

class App extends React.PureComponent<AppProps, AppState> {
  private socket: any;

  public componentDidMount() {
    this.socket = io('http://localhost:3001');
    this.socket.on('tick', ({ row, col, value }: ReceivePayload) => this.props.receive(row, col, value));
  }

  private toggleStart = (row: number, col: number) => {
    if ((this.props.inputs[row] || {})[col]) {
      this.socket.emit('stop', { row, col });
    } else {
      const interval = random()
      this.socket.emit('start', { row, col, interval });
    }
    this.props.toggle(row, col);
  }

  private handleSectionVisible = (params: SectionRenderedParams) => {
    const { columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex } = params;
    // - unsubscribe from invisible
    // - subscribe to visible
  }

  public render() {
    return (
      <div className={styles.app}>
        <Grid
          onSectionVisible={this.handleSectionVisible}
          onClick={this.toggleStart}
        />
      </div>
    );
  }
}

export { AppProps } from './types';
export default connect<
  AppSelectedState,
  AppActions,
  AppOwnProps
>(prop('quotes'), { toggle, receive })(App);
