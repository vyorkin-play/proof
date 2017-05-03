import { QuotesState } from 'modules/quotes';

export interface AppOwnProps {}
export interface AppSelectedState extends QuotesState {}
export interface AppState {}

export interface AppActions {
  toggle(row: number, col: number): void;
  receive(row: number, col: number, value: number): void;
}

export interface AppProps extends
  AppOwnProps,
  AppSelectedState,
  AppActions {
}
