import { useState } from 'react'

const StatisticsLine = ({text, value, unit}) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}{unit}</td>
        </tr>
    )
}

const Statistics = ({good, bad, neutral}) => {
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
            <table>
                <tbody>
                    <StatisticsLine text="good" value={good} />
                    <StatisticsLine text="neutral" value={neutral} />
                    <StatisticsLine text="bad" value={bad} />
                    <StatisticsLine text="all" value={all} />
                    <StatisticsLine text="average" value={average} />
                    <StatisticsLine text="positive" value={positive * 100} unit="%" />
                </tbody>
            </table>
        </>
    )
}

const Button = ({text, handleClick}) => {
    return <button onClick={handleClick}>{text}</button>
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <h1>give feedback</h1>
            <Button text="good" handleClick={() => setGood(good + 1)} />
            <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
            <Button text="bad" handleClick={() => setBad(bad + 1)} />
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App
