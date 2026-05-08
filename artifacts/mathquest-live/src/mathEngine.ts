export type MathProblem = {
  prompt: string;
  choices: string[];
  correctAnswer: string;
  difficulty: string;
  skillLabel?: string;
};

function shuffle(array: string[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateMathProblem(difficulty: string): MathProblem {
  let prompt = "";
  let correctAnswer = "";
  const wrongAnswers = new Set<string>();
  let skillLabel = "";

  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  switch (difficulty.toLowerCase()) {
    case "easy": {
      // addition/subtraction within 1000, basic multiplication 0-12
      const op = randInt(0, 2);
      if (op === 0) {
        const a = randInt(10, 500);
        const b = randInt(10, 499);
        prompt = `What is ${a} + ${b}?`;
        correctAnswer = (a + b).toString();
        while (wrongAnswers.size < 3) {
          wrongAnswers.add((a + b + randInt(-20, 20) || 1).toString());
        }
        skillLabel = "Addition";
      } else if (op === 1) {
        const a = randInt(100, 999);
        const b = randInt(10, a);
        prompt = `What is ${a} - ${b}?`;
        correctAnswer = (a - b).toString();
        while (wrongAnswers.size < 3) {
          wrongAnswers.add((a - b + randInt(-20, 20) || 1).toString());
        }
        skillLabel = "Subtraction";
      } else {
        const a = randInt(2, 12);
        const b = randInt(2, 12);
        prompt = `What is ${a} × ${b}?`;
        correctAnswer = (a * b).toString();
        while (wrongAnswers.size < 3) {
          wrongAnswers.add((a * randInt(2, 12)).toString());
        }
        skillLabel = "Basic Multiplication";
      }
      break;
    }
    case "medium": {
      // multi-digit x 1 digit, division with remainders, area
      const op = randInt(0, 2);
      if (op === 0) {
        const a = randInt(10, 99);
        const b = randInt(3, 9);
        prompt = `What is ${a} × ${b}?`;
        correctAnswer = (a * b).toString();
        while (wrongAnswers.size < 3) {
          wrongAnswers.add((a * b + randInt(-20, 20)).toString());
        }
        skillLabel = "Multiplication";
      } else if (op === 1) {
        const b = randInt(3, 9);
        const q = randInt(5, 20);
        const r = randInt(1, b - 1);
        const a = b * q + r;
        prompt = `What is ${a} ÷ ${b}?`;
        correctAnswer = `${q} R${r}`;
        while (wrongAnswers.size < 3) {
          wrongAnswers.add(`${q + randInt(-2, 2)} R${randInt(1, b - 1)}`);
        }
        skillLabel = "Division";
      } else {
        const l = randInt(5, 20);
        const w = randInt(5, 20);
        prompt = `What is the area of a rectangle with length ${l} and width ${w}?`;
        correctAnswer = (l * w).toString();
        while (wrongAnswers.size < 3) {
          wrongAnswers.add(((l + randInt(-2, 2)) * w).toString());
        }
        skillLabel = "Area";
      }
      break;
    }
    case "hard": {
      // larger multiplication, fraction comparison
      const op = randInt(0, 1);
      if (op === 0) {
        const a = randInt(20, 99);
        const b = randInt(11, 99);
        prompt = `What is ${a} × ${b}?`;
        correctAnswer = (a * b).toString();
        while (wrongAnswers.size < 3) {
          wrongAnswers.add((a * b + randInt(-100, 100)).toString());
        }
        skillLabel = "Double-digit Multiplication";
      } else {
        prompt = `Which fraction is larger: 3/4 or 5/8?`;
        correctAnswer = "3/4";
        wrongAnswers.add("5/8");
        wrongAnswers.add("They are equal");
        wrongAnswers.add("Cannot be determined");
        skillLabel = "Fractions";
      }
      break;
    }
    case "extreme": {
      // decimals
      const a = (randInt(100, 999) / 100).toFixed(2);
      const b = (randInt(10, 99) / 10).toFixed(1);
      prompt = `What is ${a} + ${b}?`;
      correctAnswer = (parseFloat(a) + parseFloat(b)).toFixed(2);
      while (wrongAnswers.size < 3) {
        wrongAnswers.add((parseFloat(correctAnswer) + randInt(-5, 5) / 10).toFixed(2));
      }
      skillLabel = "Decimals";
      break;
    }
    default: {
      prompt = "1 + 1?";
      correctAnswer = "2";
      wrongAnswers.add("3"); wrongAnswers.add("4"); wrongAnswers.add("5");
    }
  }

  wrongAnswers.delete(correctAnswer);
  const choices = shuffle([correctAnswer, ...Array.from(wrongAnswers).slice(0, 3)]);

  return { prompt, choices, correctAnswer, difficulty, skillLabel };
}

export function generateRecoveryProblem(difficulty: string): MathProblem {
  const diffMap: Record<string, string> = {
    extreme: "hard",
    hard: "medium",
    medium: "easy",
    easy: "easy"
  };
  return generateMathProblem(diffMap[difficulty.toLowerCase()] || "easy");
}
