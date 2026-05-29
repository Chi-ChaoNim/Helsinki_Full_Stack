import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [score, setScore] = useState(0);

  const handleGood = () => {
    setGood(good + 1);
    setTotal(total + 1);
    setScore(score + 1);
  };
  const handleNeutral = () => {
    setNeutral(neutral + 1);
    setTotal(total + 1);
    setScore(score + 0);
  };
  const handleBad = () => {
    setBad(bad + 1);
    setTotal(total + 1);
    setScore(score - 1);
  };
  const resetAll = () => {
    setGood(0);
    setNeutral(0);
    setBad(0);
    setTotal(0);
    setScore(0);
  };

  const average = score / total;
  const positive = (good / total) * 100;
  const stats = {
    good: good,
    neutral: neutral,
    bad: bad,
    total: total,
    average: average,
    positive: positive,
  };

  return (
    <>
      <div>
        <h1>Give feedback</h1>
        <Button onClick={handleGood} text="Good" />
        <Button onClick={handleNeutral} text="Neutral" />
        <Button onClick={handleBad} text="Bad" />
        <Statistics stats={stats} />
        <Button onClick={resetAll} text="Reset" />
      </div>
    </>
  );
};

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};
const Statistics = ({ stats }) => {
  return (
    <div>
      <h1>Statistics</h1>
      {stats.total === 0 ? (
        "No feedback given "
      ) : (
        <table>
          <StatisticsLine text="Good" value={stats.good} />
          <StatisticsLine text="Neutral" value={stats.neutral} />
          <StatisticsLine text="Bad" value={stats.bad} />
          <StatisticsLine text="Total" value={stats.total} />
          <StatisticsLine text="Average" value={stats.average} />
          <StatisticsLine text="Positive" value={stats.positive} symbol="%" />
        </table>
      )}
    </div>
  );
};
const StatisticsLine = ({ text, value, symbol }) => {
  return (
    <tbody>
      <tr>
        <td>{text}</td>
        <td>
          {value} {symbol}
        </td>
      </tr>
    </tbody>
  );
};
export default App;
