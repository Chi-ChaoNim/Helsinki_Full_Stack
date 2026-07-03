interface Results {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  daysArray: number[];
  target: number;
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  const arrayToCheck: string[] = args.slice(2, args.length);
  const convertedArray: number[] = [];

  for (let i: number = 0; i < arrayToCheck.length; i++) {
    if (!isNaN(Number(arrayToCheck[i]))) {
      convertedArray.push(Number(arrayToCheck[i]));
    } else {
      throw new Error("Invalid arguments added to function");
    }
  }
  const targetNumber: number = convertedArray[0];
  const targetArray: number[] = convertedArray.slice(1, convertedArray.length);

  return {
    daysArray: targetArray,
    target: targetNumber,
  };
};
export const ExerciseCalculator = (
  daysArray: number[],
  target: number,
): Results => {
  const periodLength: number = daysArray.length;
  let success: boolean = false;
  const rating: number = 2;
  const ratingDescription: string = "Not too bad but could be better";

  const average =
    daysArray.reduce((a: number, b: number) => a + b) / periodLength;
  const trainingDays = daysArray.filter((d) => d > 0).length;
  if (average > target) {
    success = true;
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { daysArray, target } = parseExerciseArguments(process.argv);
    console.log(ExerciseCalculator(daysArray, target));
  } catch (error: unknown) {
    let errorMessage = "Something went wrong. ";
    if (error instanceof Error) {
      errorMessage += "Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
