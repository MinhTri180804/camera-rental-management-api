export function secondToMs(second: number): number {
  return second * 1000;
}

export function msToSecondFloor(millisecond: number): number {
  return Math.floor(millisecond / 1000);
}

export function msToSecondCell(ms: number): number {
  return Math.ceil(ms / 1000);
}

export function msToSecond(ms: number): number {
  return Math.round(ms / 1000);
}
