import { equals } from 'ramda';
import { createSelector, defaultMemoize, createSelectorCreator } from 'reselect';
import createCachedSelector from 're-reselect';
import { AppState } from 'modules';
import { QuotesInputsMap, QuotesValuesMap, Position } from 'modules/quotes';

import { getKey } from './utils';
import { CellOwnProps } from './types';

const selectPosition = (_state: AppState, { rowIndex, columnIndex }: CellOwnProps) => ({
  row: rowIndex,
  col: columnIndex,
});

export const cellSelector = createCachedSelector(
  ({ quotes }: AppState, { rowIndex, columnIndex}: CellOwnProps) => Boolean((quotes.inputs[rowIndex] || {})[columnIndex]),
  ({ quotes }: AppState, { rowIndex, columnIndex}: CellOwnProps) => (quotes.values[rowIndex] || {})[columnIndex] || '*',
  (enabled: boolean, value: string) => ({ enabled, value }),
)((_state: AppState, { rowIndex, columnIndex }: CellOwnProps) => `${rowIndex}-${columnIndex}`);
