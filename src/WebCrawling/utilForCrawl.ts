/**
 * function to make process sleep temporarily
 * @param ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  })
}

/**
 * 기준점으로부터 며칠이 지났는지를 파악하는 코드
 * e.g1.) dateDuration(2019-01-11 , 2019-01-11) -> 0
 * e.g2.) dateDuration(2019-01-11 , 2019-01-12) -> 1
 * @param s: 'XXXX-XX-XX' (Year-Month-Day) -> 기준점
 * @param e: 'XXXX-XX-XX' (Year-Month-Day) -> 알아보려고 하는 시간
 */
export const dateDuration = (s: string, e: string) => {

  const sSplit = s.split('-');
  const eSplit = e.split('-');

  const startDate = {
    year: +sSplit[0],
    month: +sSplit[1],
    day: +sSplit[2]
  };

  const endDate = {
    year: +eSplit[0],
    month: +eSplit[1],
    day: +eSplit[2]
  };


  let leap;
  let dayPassed = 0;
  const monthState = {
    1: 31,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
  };

  for (let yr = startDate.year; yr < endDate.year; yr++) {
    leap = (yr % 400 === 0 ? 1 : yr % 100 === 0 ? 0 : yr % 4 === 0 ? 1 : 0);
    monthState[2] = 28 + leap;
    dayPassed += 365 + leap;
  }
  for (let mt = 1; mt < startDate.month; mt++)
    dayPassed -= (mt !== 2 ? monthState[mt] : 28 + (startDate.year % 400 === 0 ? 1 : startDate.year % 100 === 0 ? 0 : startDate.year % 4 === 0 ? 1 : 0));
  for (let d = 1; d <= startDate.day; d++) dayPassed--;
  for (let mt = 1; mt < endDate.month; mt++)
    dayPassed += (mt !== 2 ? monthState[mt] : 28 + (endDate.year % 400 === 0 ? 1 : endDate.year % 100 === 0 ? 0 : endDate.year % 4 === 0 ? 1 : 0));
  for (let d = 1; d <= endDate.day; d++) dayPassed++;
  return dayPassed;

};