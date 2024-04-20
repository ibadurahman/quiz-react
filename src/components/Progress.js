import { useQuiz } from "../contexts/QuizContext";

function Progress() {
  const { index, points, answer, numOfQuestion, maxPossiblePoints } = useQuiz();
  return (
    <header className="progress">
      <progress max={numOfQuestion} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong> / {numOfQuestion}
      </p>

      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
