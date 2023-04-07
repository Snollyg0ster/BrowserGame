export class Timer {
  progress = 0;

  constructor(
    public duration: number,
  ) {}

  increment(milliseconds: number) {
    this.progress += milliseconds

    const liveTime = this.duration * 1000
    if (this.progress > liveTime) {
      return 
    };

    const time
  }

  get increasingValue {

  }

  get decreasingValue {
    
  }
}