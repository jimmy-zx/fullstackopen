const Header = ({course}) =>
  <h1>{course}</h1>

const Part = ({part}) =>
  <p>{part.name} {part.exercises}</p>

const Content = ({parts}) =>
  parts.map((part) => <Part key={part.id} part={part} />)

const Total = ({parts}) =>
  <p>Number of exercises {parts.reduce((psum, part) => psum + part.exercises, 0)}</p>

const Course = ({course}) =>
  <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </>


const App = () => {
  const course = {
      id: 1,
      name: 'Half Stack application development',
      parts: [
          {id: 1, name: 'Fundamentals of React', exercises: 10},
          {id: 2, name: 'Using props to pass data', exercises: 7},
          {id: 3, name: 'State of a component', exercises: 14},
      ],
  }

  return <Course course={course} />
}

export default App
