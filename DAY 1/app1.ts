import * as fs from "fs";
import * as readline from "readline";

const filePath = "./DAY 1/data.txt";
// const filePath = "./DAY 1/test1.txt";

let result = 0;

const readStream = readline.createInterface({
  input: fs.createReadStream(filePath),
  terminal: false,
});

readStream.on("line", (line: string) => {
  const matches = line.match(/\d/g);

  if (matches && matches.length > 0) {
    const firstNumber = matches[0];
    const lastNumber = matches[matches.length - 1];

    result += parseInt(`${firstNumber}${lastNumber}`);
  } else {
    console.log("No numbers found in the string");
  }
});

readStream.on("close", () => {
  console.log("RESULT : ", result);
});
