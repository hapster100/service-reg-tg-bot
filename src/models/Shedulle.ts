export class Interval {
  from: number
  to: number
  constructor({
    from,
    to
  }) {
    this.from = from
    this.to = to
  }
}

export class ShedulleDay {
  free: boolean
  intervals: Interval[]
  constructor({
    free,
    intervals,
  }) {
    this.free = free
    this.intervals = intervals.map(raw => new Interval(raw))
  }
}

export class Shedulle {
  [key: number]: ShedulleDay
  constructor(raw) {
    for(const key in raw) {
      const n = +key
      if (Number.isInteger(n) && n > 0) {
        this[n] = new ShedulleDay(raw[key])
      }
    }
  }
}