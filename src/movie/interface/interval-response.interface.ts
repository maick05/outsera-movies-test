export interface IntervalResponse {
  min: IntervalResult[];
  max: IntervalResult[];
}

export interface IntervalResult {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}