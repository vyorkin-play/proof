import * as React from 'react';
import { connect } from 'react-redux';
import { prop } from 'ramda';
import { SectionRenderedParams } from 'react-virtualized';

import { ReceivePayload, start, toggle, receive, randomize } from 'modules/quotes';
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
  public componentDidMount() {
    this.props.start();
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
          rowCount={this.props.rows}
          columnCount={this.props.cols}
          onSectionVisible={this.handleSectionVisible}
          onClick={this.props.toggle}
        />
        <div className={styles.controls}>
          <button onClick={this.props.randomize}>randomize</button>
        </div>
      </div>
    );
  }
}

export { AppProps } from './types';
export default connect<
  AppSelectedState,
  AppActions,
  AppOwnProps
>(prop('quotes'), { start, toggle, randomize })(App);
