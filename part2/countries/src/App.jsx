import { useState, useEffect } from "react";

import countryService from "./services/countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filterCountries, setFilterCountries] = useState("");

  useEffect(() => {
    countryService.getAll().then((response) => {
      setCountries(response);
    });
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filterCountries.toLowerCase()),
  );

  const detailCountry = filteredCountries[0];

  return (
    <>
      <form>
        <label for="countrySearch">Search for a country: </label>
        <input
          type="search"
          id="countrySearch"
          name="countrySearch"
          onChange={(e) => setFilterCountries(e.target.value)}
        />
      </form>
      <>
        {filteredCountries.length > 10 ? (
          <p>To many matches, specifiy another filter</p>
        ) : (
          ""
        )}
        {filteredCountries.length === 0 ? (
          <p>No matches found, specify another filter</p>
        ) : (
          ""
        )}
        {filteredCountries.length > 1 && filteredCountries.length < 11
          ? filteredCountries.map((country) => (
              <p key={country.name.common}>{country.name.common}</p>
            ))
          : ""}
        {filteredCountries.length === 1 ? (
          <div>
            <h1>{detailCountry.name.common}</h1>
            <p>Capital: {detailCountry.capital}</p>
            <p>Area: {detailCountry.area}</p>
            <h2>Languages</h2>
            <ul>
              {Object.entries(detailCountry.languages).map(([key, value]) => (
                <li key={key}>{value}</li>
              ))}
            </ul>
            <img src={detailCountry.flags.png} alt={detailCountry.flags.alt} />
          </div>
        ) : (
          ""
        )}
      </>
    </>
  );
};

export default App;
