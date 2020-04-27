// const date = new Date('2020-04-01');

// date.setDate(date.getDate() + 1);


// console.log(date.toLocaleTimeString());


const result = get8StringDate(new Date('2020-04-02'));
console.log('result', result);

/**
 * object Date to 'OOOO-OO-OO'
 * @param date
 */
function get8StringDate(date: Date): string {
  const dateString = date.toLocaleDateString();

  const dateStringPieces = dateString.split('-');

  const year = dateStringPieces[0];
  const month = dateStringPieces[1].length === 1 ? '0' + dateStringPieces[1] : dateStringPieces[1];
  const day = dateStringPieces[2].length === 1 ? '0' + dateStringPieces[2] : dateStringPieces[2];


  return `${year}-${month}-${day}`;
}