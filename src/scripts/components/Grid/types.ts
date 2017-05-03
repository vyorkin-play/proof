import * as React from 'react';
import {
  GridProps as VirtualGridProps,
  SectionRenderedParams,
  GridCellProps,
} from 'react-virtualized';

export interface GridOwnProps {
  onClick(row: number, col: number): void;
  onSectionVisible(params: SectionRenderedParams): void;
}

export interface GridSelectedState {
}

export interface GridActions {
}

export interface GridProps extends
  GridOwnProps,
  VirtualGridProps,
  GridSelectedState,
  GridActions {}

export interface CellOwnProps extends GridCellProps {
  onClick(row: number, col: number): void;
}

export interface CellProps extends CellOwnProps {
  enabled: boolean;
  value: string;
  handleClick: React.MouseEventHandler<HTMLDivElement>;
}
