import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [score, setScore] =useState(0)

  const handleGood = () => {
    setGood(good + 1)
    setTotal(total + 1)
    setScore(score + 1)
  }
  const handleNeutral = () => {
    setNeutral(neutral + 1)
    setTotal(total + 1)
    setScore(score + 0)
  }
  const handleBad = () => {
    setBad(bad + 1)
    setTotal(total + 1)
    setScore(score - 1)
  }
  const average = (score / total)
  const positive = ((good / total)*100)

  return (
    <>
      <div>
        <h1>Give feedback</h1>
        <Button onClick={handleGood} text="Good"/>
        <Button onClick={handleNeutral} text="Neutral"/>
        <Button onClick={handleBad} text="Bad"/>
      </div>
      <div>
        <h1>Statistics</h1>
        <p>Good {good}</p>
        <p>Neutral {neutral}</p>
        <p>Bad {bad}</p>
        <p>Total {total}</p>
        <p>Average {total === 0? 0 : average}</p>
        <p>Positive {good=== 0? 0 : positive}%</p>
      </div>
    </>
    
  )
}

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

export default App