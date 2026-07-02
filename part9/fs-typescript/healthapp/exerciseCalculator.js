"use strict";
const parseExerciseArguments = (args) => {
    if (args.length < 4)
        throw new Error("Not enough arguments given");
    if (args.length > 4)
        throw new Error("Too many arguments given");
    //validates that the item in index 2 is an array and it's only numbers
    if (Array.isArray(args[2]) &&
        args[2].every((item) => typeof item === "number")) {
        if (args[2].length == 0) {
            throw new Error("Exercise array has no days in it.");
        }
        else {
            const goodArray = args[2];
            //validates that the item in index 3 is a number
            if (!isNaN(Number(args[3]))) {
                return {
                    daysArray: goodArray,
                    target: Number(args[3]),
                };
            }
            else {
                throw new Error("Provided values are invalid");
            }
        }
    }
    else {
        throw new Error("Invalid array");
    }
};
const ExerciseCalculator = (daysArray, target) => {
    const periodLength = daysArray.length;
    let trainingDays = 0;
    let success = false;
    let rating = 2;
    let ratingDescription = "Not too bad but could be better";
    let average = 0;
    average = daysArray.reduce((a, b) => a + b) / periodLength;
    trainingDays = daysArray.filter((d) => d > 0).length;
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
try {
    const { daysArray, target } = parseExerciseArguments(process.argv);
    ExerciseCalculator(daysArray, target);
}
catch (error) {
    let errorMessage = "Something went wrong. ";
    if (error instanceof Error) {
        errorMessage += "Error: " + error.message;
    }
}
