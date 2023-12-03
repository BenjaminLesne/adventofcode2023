import * as fs from "fs";
import * as readline from "readline";

// This is a game = Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// This is a round =  3 blue, 4 red
// This is a set =  3 blue
// I know my definiton is set is wrong but w/e

const filePath = "./DAY 2/input.txt";
// const filePath = "./DAY 2/example1.txt";
// const filePath = "./DAY 2/test.txt";

type Color = "red" | "blue" | "green";

// type Set = `${number}${Color}`;
type Set = {
  amount: number;
  color: Color;
};

type Round = {
  id: string | number;
  sets: Set[];
};

type Game = {
  id: number;
  rounds: Round[];
};

const games: Game[] = [];

const readStream = readline.createInterface({
  input: fs.createReadStream(filePath),
  terminal: false,
});

readStream.on("line", (line: string) => {
  // Game 1: 4 red, 1 green, 15 blue; 6 green, 2 red, 10 blue; 7 blue, 6 green, 4 red; 12 blue, 10 green, 3 red
  const colonSplit = line.split(":");
  // ["Game 1" , "4 red, 1 green, 15 blue; 6 green, 2 red, 10 blue; 7 blue, 6 green, 4 red; 12 blue, 10 green, 3 red"]
  const gameId = colonSplit[0].replaceAll(" ", "").replace("Game", "");
  const roundsRaw = colonSplit[1].split(";");
  // [" 4 red, 1 green, 15 blue", " 6 green, 2 red, 10 blue", " 7 blue, 6 green, 4 red", "12 blue, 10 green, 3 red"]
  const rounds = roundsRaw.map((roundRaw, index) => {
    const sets = roundRaw.split(",").map((setRaw) => {
      const setRawSplitted = setRaw
        .split(" ")
        .filter((item) => item !== " " && item !== "");
      // [ '1', 'blue' ]

      return {
        amount: parseInt(setRawSplitted[0]),
        color: setRawSplitted[1] as Color,
      };
    });

    return {
      id: index,
      sets,
    };
  });

  const newGame = {
    id: parseInt(gameId),
    rounds,
  };

  games.push(newGame);
});

const amountOfCubes = {
  red: 12,
  green: 13,
  blue: 14,
};

const emptyAmountOfCubes = {
  red: 0,
  green: 0,
  blue: 0,
};

readStream.on("close", () => {
  const possibleGames = games.filter((game) => {
    const areRoundsPossible = game.rounds.every(
      (round) => {
        const areAllSetsPossible = round.sets.every(
          (set) => set.amount <= amountOfCubes[set.color]
        );

        return areAllSetsPossible;
      },
      {
        ...emptyAmountOfCubes,
      }
    );

    return areRoundsPossible;
  });

  const result1 = possibleGames.reduce(
    (totalSum, game) => totalSum + game.id,
    0
  );

  const result2 = games.reduce((sumTotal, game) => {
    const lowestRoundsCubes = game.rounds.reduce(
      (lowestCubesRounds, round) => {
        const lowestCubesSets = round.sets.reduce(
          (lowestCubes, set) => {
            if (set.amount > lowestCubes[set.color]) {
              const newLowestCubes = {
                ...lowestCubes,
                [set.color]: set.amount,
                modified: true,
              };

              return newLowestCubes;
            }
            return lowestCubes;
          },
          {
            red: 0,
            green: 0,
            blue: 0,
            modified: false,
          }
        );

        if (lowestCubesSets.modified === false) {
          throw Error("Sets lowestCubes was not modified");
        }

        return {
          red:
            lowestCubesSets.red > lowestCubesRounds.red
              ? lowestCubesSets.red
              : lowestCubesRounds.red,
          green:
            lowestCubesSets.green > lowestCubesRounds.green
              ? lowestCubesSets.green
              : lowestCubesRounds.green,
          blue:
            lowestCubesSets.blue > lowestCubesRounds.blue
              ? lowestCubesSets.blue
              : lowestCubesRounds.blue,
          modified: true,
        };
      },
      {
        red: 0,
        green: 0,
        blue: 0,
        modified: false,
      }
    );

    if (lowestRoundsCubes.modified === false) {
      throw Error("lowestRoundsCubes not modified");
    }

    const powerCubes =
      lowestRoundsCubes.blue * lowestRoundsCubes.red * lowestRoundsCubes.green;

    console.log("lowestRoundsCubes", lowestRoundsCubes);

    return sumTotal + powerCubes;
  }, 0);

  // console.log(possibleGames);
  // console.dir(possibleGames, { depth: null });
  console.log("RESULT 1 : ", result1);
  console.log("RESULT 2 : ", result2);
});
