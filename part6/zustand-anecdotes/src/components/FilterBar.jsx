import { useAnecdoteActions } from "../store";

const FilterBar = () => {
  const { setFilter } = useAnecdoteActions();

  return (
    <div>
      <label htmlFor="filter">Filter: </label>
      <input
        type="text"
        name="filter"
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
};

export default FilterBar;
