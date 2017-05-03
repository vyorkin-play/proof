import { CellOwnProps } from './types';

export const getKey = ({ rowIndex, columnIndex }: CellOwnProps) => `${rowIndex}-${columnIndex}`;
