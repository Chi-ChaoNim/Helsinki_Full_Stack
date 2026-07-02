interface BMIValues {
  height: number;
  weight: number;
}

//verify the incoming values
const parseBMIArguments = (args: string[]): BMIValues => {
  if (args.length < 4) throw new Error("Not enough arguments given");
  if (args.length > 4) throw new Error("Too many arguments given");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values are not valid numbers");
  }
};

export const BMICalculator = (height: number, weight: number) => {
  const BMI: number = weight / (height / 100) ** 2;
  if (BMI < 16) {
    return "Underweight (Severe thinness)";
  } else if (16 <= BMI && BMI < 17) {
    return "Underweight (Moderate thinness)";
  } else if (17 <= BMI && BMI < 18.5) {
    return "Underweight (Mild thinness)";
  } else if (18.5 <= BMI && BMI < 25) {
    return "Normal range";
  } else if (25 <= BMI && BMI < 30) {
    return "Overweight (Pre-obese)";
  } else if (30 <= BMI && BMI < 35) {
    return "Obese (Class 1)";
  } else if (35 <= BMI && BMI < 40) {
    return "Obese (Class 2)";
  } else if (BMI >= 40) {
    return "Obese (Class 3)";
  } else {
    throw new Error("Failed to calculate BMI, check input values");
  }
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { height, weight } = parseBMIArguments(process.argv);
    console.log(BMICalculator(height, weight));
  } catch (error: unknown) {
    let errorMessage = "Something went wrong. ";
    if (error instanceof Error) {
      errorMessage += "Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
