import { useQuiz } from "../contexts/QuizContext";

function NextButton() {
  const { answer, dispatch, index, numOfQuestion } = useQuiz();
  if (answer === null) return null;
  if (index < numOfQuestion - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );
  if (index === numOfQuestion - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Next
      </button>
    );
}

export default NextButton;
