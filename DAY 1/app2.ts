import * as fs from "fs";
import * as readline from "readline";

const filePath = "./DAY 1/data.txt";
// const filePath = "./DAY 1/test2.txt";

let result = 0;

const numbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const readStream = readline.createInterface({
  input: fs.createReadStream(filePath),
  terminal: false,
});

readStream.on("line", (line: string) => {
  const regex = /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g;

  const matches = Array.from(line.matchAll(regex), (x) => x[1]);

  if (matches && matches.length > 0) {
    const firstNumber = matches[0];
    const lastNumber = matches[matches.length - 1];

    const finalFirst = Number.isInteger(+firstNumber)
      ? firstNumber
      : numbers[firstNumber as keyof typeof numbers];

    const finalLast = Number.isInteger(+lastNumber)
      ? lastNumber
      : numbers[lastNumber as keyof typeof numbers];

    result += parseInt(`${finalFirst}${finalLast}`);
  } else {
    console.log("No numbers found in the string");
  }
});

readStream.on("close", () => {
  console.log("RESULT : ", result);
});
