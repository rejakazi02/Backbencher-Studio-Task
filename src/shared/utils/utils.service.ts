import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment-timezone';
import { Model } from 'mongoose';
import * as crypto from 'crypto';


@Injectable()
export class UtilsService {
  constructor(

  ) {}

  /**
   * MOMENT DATE FUNCTIONS
   * getDateString
   */
  getDateString(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  getNextDateString(date: Date, day): string {
    return moment(date).add(day, 'days').format('YYYY-MM-DD');
  }

  getLocalDateTime(): Date {
    const newDate = moment().tz('Asia/Dhaka');
    return newDate.toDate();
  }

  getDateYear(date?: any): number {
    let d;
    if (date) {
      d = new Date(date);
    } else {
      d = new Date();
    }
    return d.getFullYear();
  }

  getCurrentTime(): string {
    return moment(new Date()).format('hh:mm a');
  }

  getDateMonth(date?: any, fromZero?: boolean): number {
    let d;
    if (date) {
      d = new Date(date);
    } else {
      d = new Date();
    }
    const month = d.getMonth();
    return fromZero ? month : month + 1;
  }

  getDateWithCurrentTime(date: Date): Date {
    const _ = moment().tz('Asia/Dhaka');
    // const newDate = moment(date).add({hours: _.hour(), minutes:_.minute() , seconds:_.second()});
    const newDate = moment(date).add({ hours: _.hour(), minutes: _.minute() });
    return newDate.toDate();
  }

  addMinuteInCurrentTime(time: number): Date {
    const newDate = moment().tz('Asia/Dhaka').add(time, 'minutes');
    return newDate.toDate();
  }

  getDateDifference(
    date1: Date | string,
    date2: Date | string,
    unit?: string,
  ): number {
    /**
     * If First Date is Current or Future Date
     * If Second Date is Expire or Old Date
     * Return Positive Value If Not Expired
     */
    const a = moment(date1).tz('Asia/Dhaka');
    const b = moment(date2).tz('Asia/Dhaka');

    switch (unit) {
      case 'seconds': {
        return b.diff(a, 'seconds');
      }
      case 'minutes': {
        return b.diff(a, 'minutes');
      }
      case 'hours': {
        return b.diff(a, 'hours');
      }
      case 'days': {
        return b.diff(a, 'days');
      }
      case 'weeks': {
        return b.diff(a, 'weeks');
      }
      default: {
        return b.diff(a, 'hours');
      }
    }
  }

  /**
   * STRING FUNCTIONS
   * transformToSlug
   */
  public transformToSlug(value: string, salt?: boolean): string {
    const slug = value
      .trim()
      .replace(/[^A-Z0-9]+/gi, '-')
      .toLowerCase();

    return salt ? `${slug}-${this.getRandomInt(1, 100)}` : slug;
  }

  /**
   * RANDOM FUNCTIONS
   * getRandomInt()
   * getRandomString()
   */
  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomString(count: number, lastValue: string | number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < count; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return `${result}${lastValue}`;
  }

  /**
   * PAD LEADING
   */
  padLeadingZeros(num): string {
    return String(num).padStart(4, '0');
  }

  /**
   * GENERATE OTP
   * getRandomOtpCode4()
   * getRandomOtpCode6()
   */
  getRandomOtpCode4(): string {
    return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  }

  getRandomOtpCode6(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  bytesToKb(bytes: number): number {
    const res = bytes * 0.001;
    return Number(res.toFixed(2));
  }


  roundNumber(num: number): number {
    const integer = Math.floor(num);
    const fractional = num - integer;

    //Converting the fractional to the integer
    const frac2int = (fractional * 100) / 5;
    const fracCeil = Math.ceil(frac2int);

    //transforming inter into fractional
    const FracOut = (fracCeil * 5) / 100;
    const ans = integer + FracOut;

    return Number((Math.round(ans * 100) / 100).toFixed(2));
  }

  /**
   * Hash Data
   * SHA256 hashing Format
   * hashDataSha256()
   * formatPhoneNumber()
   */
  hashDataSha256(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  formatPhoneNumber(phone: string): string {
    // Ensure phone is in E.164 format (e.g., +1234567890)
    return phone.replace(/\D/g, ''); // Remove non-numeric characters
  }
}
