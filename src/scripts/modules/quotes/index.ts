import { assocPath } from 'ramda';
import { createAction, createReducer } from 'redux-act';

export const toggle = createAction(
  'quotes.toggle',
  (row: number, col: number) => ({ row, col }),
);

export const receive = createAction(
  'quotes.receive',
  (row: number, col: number, value: number) => ({ row, col, value }),
);

export interface Position {
  row: number;
  col: number;
}

export interface TogglePayload extends Position {}
export interface ReceivePayload extends Position { value: number; }

export type Matrix<T> = { [row: number]: { [col: number]: T } };

export type QuotesInputsMap = Matrix<boolean>;
export type QuotesValuesMap = Matrix<number>;

export interface QuotesState {
  inputs: QuotesInputsMap;
  values: QuotesValuesMap;
}

const defaultState: QuotesState = {
  inputs: {},
  values: {},
};

const handleToggle = (state: QuotesState, { row, col }: TogglePayload) =>
  assocPath(['inputs', row, col], !Boolean((state.values[row] || {})[col]), state);
const handleReceive = (state: QuotesState, { row, col, value }: ReceivePayload) =>
  assocPath(['values', row, col], value, state);

const reducer = createReducer({}, defaultState);
reducer.on(toggle, handleToggle);
reducer.on(receive, handleReceive);

export default reducer;
