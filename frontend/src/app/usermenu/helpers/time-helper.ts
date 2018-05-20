import {QuietHourTime} from "../../common/types/quiet-hours";

export class TimeHelper {
  public hours: number;
  public minutes: number;

  constructor(time: QuietHourTime) {
    this.hours = time.hours;
    this.minutes = time.minutes;
  }

  get time(): string {
    return TimeHelper.padToDoubleDigits(this.hours) + ':' + TimeHelper.padToDoubleDigits(this.minutes);
  }

  set time(value: string) {
    let pieces = value.split(':');

    this.hours = Number(pieces[0]);
    this.minutes = Number(pieces[1]);
  }

  private static padToDoubleDigits(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }
}
