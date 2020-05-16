const date = new Date('2019-04-01');

for (let i = 0; i < 12; i++) {
  console.log('date', date);
  console.log('fullyear', date.getFullYear())
  date.setMonth(date.getMonth() + 2);
}

