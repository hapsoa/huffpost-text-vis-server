interface StringDict {
  a: string;
  b: string;
}

interface StringDicts extends Array<StringDict> {}

const stringDicts: StringDicts = [
  {
    a: "s",
    b: "d",
  },
];
