import { HuffPostDatum } from './refiningInterfaces';

/**
 * make time unit by each month
 * @param innerHuffPostData
 */
export function makeMonthUnitsFromHuffPostData(innerHuffPostData: HuffPostDatum[]): string[] {
  const times: string[] = [];

  const initialDate: Date = new Date(innerHuffPostData[0].date);
  const lastDate: Date = new Date(innerHuffPostData[innerHuffPostData.length - 1].date);

  while (initialDate.getFullYear() + '-' + initialDate.getMonth() <=
    lastDate.getFullYear() + '-' + lastDate.getMonth()) {
    times.push(initialDate.getFullYear() + '-' +
      getStringMonthFromNumberMonth(initialDate.getMonth() + 1))
    initialDate.setMonth(initialDate.getMonth() + 2);
  }

  return times;
}

/**
 * Make "OOOO-OO-OO" to "OOOO-OO"
 * @param stringDate
 */
export function getYearMonthFromStringDate(stringDate: string) {
  const stringDateSplited: string[] = stringDate.split('-');
  return stringDateSplited[0] + '-' + stringDateSplited[1];
}

/**
 * number of month to string month that is 2 length
 * @param month
 */
export function getStringMonthFromNumberMonth(month: number): string {
  if (month < 10) {
    return '0' + month;
  } else {
    return String(month);
  }
}