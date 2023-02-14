export class Time {
  readonly hours: number
  readonly minutes: number
  
  constructor(h: number, m: number) {
    this.hours = h
    this.minutes = m
  }

  toMinutes() {
    return this.minutes + this.hours * 60
  }

  toString() {
    return this.hours + ':' + this.minutes.toString().padStart(2, '0')
  }

  static fromMinutes(m: number) {
    return new Time(Math.floor(m/60), m%60)
  }
}
