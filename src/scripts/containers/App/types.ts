import { QuotesState } from 'modules/quotes';

export interface AppOwnProps {}
export interface AppSelectedState extends QuotesState {}
export interface AppState {}

export interface AppActions {
  start(): void;
  toggle(row: number, col: number): void;
  randomize(): void;
}

export interface AppProps extends
  AppOwnProps,
  AppSelectedState,
  AppActions {
}
