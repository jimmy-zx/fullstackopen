const Header = (props) => {
    return (
        <>
            <h1>{props.course}</h1>
        </>
    )
}

const Part = (props) => {
    return (
        <>
            <p>{props.part.name} {props.part.count}</p>
        </>
    )
}

const Content = (props) => {
    return (
        <>
            <Part part={props.parts[0]} />
            <Part part={props.parts[1]} />
            <Part part={props.parts[2]} />
        </>
    )
}

const Total = (props) => {
    return (
        <>
            <p>Number of exercises {props.parts[0].count + props.parts[1].count + props.parts[2].count}</p>
        </>
    )
}


const App = () => {
    const course = 'Half Stack application development'
    const parts = [
        {name: 'Fundamentals of React', count: 10},
        {name: 'Using props to pass data', count: 7},
        {name: 'State of a component', count: 14},
    ]

    return (
        <div>
            <Header course={course} />
            <Content parts={parts} />
            <Total parts={parts} />
        </div>
    )
}

export default App
