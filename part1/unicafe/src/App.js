import { useState } from 'react'

const Stats = ({good, bad, neutral}) => {
    const all = good + bad + neutral
    if (all === 0) {
        return (
            <>
                <h1>statistics</h1>
                No feedback given
            </>
        )
    }
    const score = good - bad
    const average = score / all
    const positive = good / all
    return (
        <>
            <h1>statistics</h1>
            <p>good {good}</p>
            <p>neutral {neutral}</p>
            <p>bad {bad}</p>
            <p>all {all}</p>
            <p>average {average}</p>
            <p>positive {positive * 100}%</p>
        </>
    )
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <h1>give feedback</h1>
            <button onClick={() => setGood(good + 1)}>good</button>
            <button onClick={() => setNeutral(neutral + 1)}>neutral</button>
            <button onClick={() => setBad(bad + 1)}>bad</button>
            <Stats good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App
