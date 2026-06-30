import React, { useState } from "react";

const App = () => {
  const [counter, setCounter] = useState(0);

  return (
    <div>
      <p>Count: {counter}</p>
      <button onClick={() => setCounter(counter + 1)}>Increment</button>
    </div>
  );
};

export default App;
