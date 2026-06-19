import { useCounterControls } from "./store";

const Controls = () => {
  const { increment, decrease, setZero } = useCounterControls();

  return (
    <div>
      <button onClick={increment}>plus</button>
      <button onClick={decrease}>minus</button>
      <button onClick={setZero}>zero</button>
    </div>
  );
};

export default Controls;
