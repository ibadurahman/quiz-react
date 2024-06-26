import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();
const QUIZ_URL = "https://api.jsonbin.io/v3/b";
const BIN_ID = "664b1bdbe41b4d34e4f69478";

const SECS_PER_QUESTION = 30;
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const curQues = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === curQues.correctOption
            ? state.points + curQues.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numOfQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch(`${QUIZ_URL}/${BIN_ID}/latest`)
      .then((res) => res.json())
      .then((data) =>
        dispatch({ type: "dataReceived", payload: data.record.questions })
      )
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        numOfQuestions,
        maxPossiblePoints,
        points,
        highscore,
        secondsRemaining,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const quizes = useContext(QuizContext);
  if (quizes === undefined)
    throw new Error("QuizContext was used outside the QuizProvider");
  return quizes;
}

export { QuizProvider, useQuiz };
