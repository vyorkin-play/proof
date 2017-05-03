import * as React from 'react';
import { AutoSizer, Dimensions, Grid, GridCellProps } from 'react-virtualized';

import { GridProps } from './types';
import Cell from './Cell';

export default ({ onClick, onSectionVisible, ...props }: GridProps) => (
  <AutoSizer>{(dimensions: Dimensions) => (
    <Grid
      {...props}
      {...dimensions}
      cellRenderer={(cellProps: GridCellProps) => (
        <Cell
          {...cellProps}
          onClick={onClick}
        />
      )}
      onSectionRendered={onSectionVisible}
    />
  )}</AutoSizer>
);
