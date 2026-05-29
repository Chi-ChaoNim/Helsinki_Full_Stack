const Course = ({ courses }) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map((element) => (
        <div key={element.id}>
          <h2>{element.name}</h2>
          <Content course={element} />
          <Total course={element} />
        </div>
      ))}
    </div>
  );
};

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map((part) => (
        <p key={part.id}>
          {part.name} {part.exercises}
        </p>
      ))}
    </div>
  );
};

const summingFunc = (arr) => {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i].exercises;
  }
  return sum;
};

const Total = ({ course }) => {
  return <div>total of {summingFunc(course.parts)} exercises</div>;
};

export default Course;
