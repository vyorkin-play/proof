import { assocPath, nthArg, pipe, times, clone } from 'ramda';
import { createAction, createReducer } from 'redux-act';
import * as io from 'socket.io-client';

import { random } from 'lib/utils';

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
  rows: number;
  cols: number;
  inputs: QuotesInputsMap;
  values: QuotesValuesMap;
}

const socket = io('http://localhost:3001');

export const toggleCell = createAction(
  'quotes.toggle',
  (row: number, col: number) => ({ row, col }),
);

export const receive = createAction(
  'quotes.receive',
  (row: number, col: number, value: number) => ({ row, col, value }),
);

const randomizeData = createAction('quotes.randomize');

export const start = () => (dispatch: any, getState: any) => {
  socket.on('tick', ({ row, col, value }: ReceivePayload) => dispatch(receive(row, col, value)));
};

export const toggle = (row: number, col: number) =>
  (dispatch: any, getState: any) => {
    const { quotes: { inputs } } = getState();

    if ((inputs[row] || {})[col]) {
      socket.emit('stop', { row, col });
    } else {
      const interval = random(4000, 5000)
      socket.emit('start', { row, col, interval });
    }
    dispatch(toggleCell(row, col));
  };

export const toggleAll = (inputs: QuotesInputsMap, dispatch: any) => {
  for (let row in Object.keys(inputs)) {
    for (let col in Object.keys(inputs[row])) {
      if (inputs[row][col]) {
        dispatch(toggle(row as any, col as any));
      }
    }
  }
};

export const randomize = () => (dispatch: any, getState: any) => {
  const { quotes: { rows, cols, inputs } } = getState();
  toggleAll(inputs, dispatch);
  const nextInputs = times(() => times(() => random() % 17 === 0, cols), rows);
  toggleAll(nextInputs, dispatch);
  dispatch(randomizeData(nextInputs));
};

export const defaultState: QuotesState = {
  rows: 50,
  cols: 50,
  inputs: {},
  values: {},
};

const handleToggle = (state: QuotesState, { row, col }: TogglePayload) =>
  assocPath(['inputs', row, col], !Boolean((state.values[row] || {})[col]), state);

const handleReceive = (state: QuotesState, { row, col, value }: ReceivePayload) =>
  assocPath(['values', row, col], value, state);

const handleRandomize = (state: QuotesState, inputs: QuotesInputsMap) => ({
  rows: state.rows,
  cols: state.cols,
  values: {},
  inputs,
});

const reducer = createReducer({}, defaultState);
reducer.on(toggleCell, handleToggle);
reducer.on(receive, handleReceive);
reducer.on(randomizeData, handleRandomize);

export default reducer;
