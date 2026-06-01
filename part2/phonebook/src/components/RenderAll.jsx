const RenderAllPersons = ({ filteredPersons, deletePerson }) => {
  return (
    <div>
      {filteredPersons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number}{" "}
          <button onClick={(event) => deletePerson(event, person)}>
            Delete
          </button>
        </p>
      ))}
    </div>
  );
};

export default RenderAllPersons;
