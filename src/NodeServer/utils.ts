import { HuffPostDatum } from "./refiningInterfaces";

export function makeNerTo5w1h(ner: string): string {
  let fivew1h = "other";
  switch (ner) {
    case "PERSON":
      fivew1h = "who";
      break;
    case "ORG":
      fivew1h = "who";
      break;
    case "LOC":
      fivew1h = "where";
      break;
    case "DATE":
      fivew1h = "when";
      break;
    case "PRODUCT":
      fivew1h = "what";
      break;
    case "WORK_OF_ART":
      fivew1h = "how";
      break;
    default:
      fivew1h = "other";
      break;
  }
  return fivew1h;
}

/**
 * number of month to string month that is 2 length
 * @param month
 */
function getStringMonthFromNumberMonth(month: number): string {
  if (month < 10) {
    return "0" + month;
  } else {
    return String(month);
  }
}

/**
 * make time unit by each month
 * @param innerHuffPostData
 */
export function makeYearMonthsFromHuffPostData(
  innerHuffPostData: HuffPostDatum[]
): string[] {
  const times: string[] = [];

  const initialDate: Date = new Date(innerHuffPostData[0].date);
  const lastDate: Date = new Date(
    innerHuffPostData[innerHuffPostData.length - 1].date
  );

  while (
    initialDate.getFullYear() + "-" + initialDate.getMonth() <=
    lastDate.getFullYear() + "-" + lastDate.getMonth()
  ) {
    times.push(
      initialDate.getFullYear() +
        "-" +
        getStringMonthFromNumberMonth(initialDate.getMonth() + 1)
    );
    initialDate.setMonth(initialDate.getMonth() + 1);
  }

  return times;
}
