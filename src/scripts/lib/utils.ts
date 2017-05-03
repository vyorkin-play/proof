export const random = (min: number = 1000, max: number = 3000) =>
  Math.floor(Math.random() * (max - min)) + min;
