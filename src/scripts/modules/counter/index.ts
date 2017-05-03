import { createAction, createReducer } from 'redux-act';

export const COUNTER_INCREMENT_ASYNC = 'COUNTER_INCREMENT_ASYNC';
export const COUNTER_INCREMENT = 'COUNTER_INCREMENT';

export const incrementAsync = createAction(COUNTER_INCREMENT_ASYNC);

const reducer = createReducer({}, 0);
reducer.on(COUNTER_INCREMENT, c => c + 1);

export default reducer;
