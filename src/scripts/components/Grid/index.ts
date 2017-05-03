import { compose, defaultProps } from 'recompose';

import { GridOwnProps, GridProps } from './types';
import Grid from './Grid';

export { getKey } from './utils';
export default compose<GridProps, GridOwnProps>(
  defaultProps({
    rowHeight: 80,
    columnWidth: 80,
    columnCount: 500,
    rowCount: 500,
    overscanColumnCount: 1,
    overscanRowCount: 1,
    fixedColumnCount: 1,
    fixedRowCount: 1,
  }),
)(Grid);
