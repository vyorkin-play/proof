import { createSelector } from 'reselect';
import { AppState } from 'modules';
import { QuotesInputsMap, QuotesValuesMap, Position } from 'modules/quotes';

import { getKey } from './utils';
import { CellOwnProps } from './types';

const selectPosition = (_state: AppState, { rowIndex, columnIndex }: CellOwnProps) => ({
  row: rowIndex,
  col: columnIndex,
});

const selectQuotesValues = (state: AppState) => state.quotes.values;
const selectQuotesInputs = (state: AppState) => state.quotes.inputs;

export const cellSelector = createSelector(
  selectQuotesValues,
  selectQuotesInputs,
  selectPosition, (
    values: QuotesValuesMap,
    inputs: QuotesInputsMap,
    { row, col }: Position,
  ) => ({
    enabled: Boolean((inputs[row] || {})[col]),
    value: (values[row] || {})[col] || '*'
  }),
);
