import { useState, useEffect } from "react";

import countryService from "./services/countries";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filterCountries, setFilterCountries] = useState("");
  const [weatherCondition, setWeatherCondition] = useState({});

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filterCountries.toLowerCase()),
  );

  const detailCountry = filteredCountries[0];
  const arrLength = filteredCountries.length === 1;

  useEffect(() => {
    countryService.getAllCountries().then((response) => {
      setCountries(response);
    });
  }, []);

  useEffect(() => {
    if (filteredCountries.length === 1) {
      const detailCountry = filteredCountries[0];
      countryService
        .getGeoLocal(detailCountry.capital, detailCountry.ccn3)
        .then((response) => {
          countryService
            .getWeather(response[0].lat, response[0].lon)
            .then((response) => {
              setWeatherCondition(response);
            });
        });
    }
  }, [arrLength]);

  return (
    <>
      <form>
        <label htmlFor="countrySearch">Search for a country: </label>
        <input
          type="search"
          id="countrySearch"
          name="countrySearch"
          onChange={(e) => setFilterCountries(e.target.value)}
        />
      </form>
      <>
        {filteredCountries.length > 10 ? (
          <p>Too many matches, specifiy another filter</p>
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
              <div key={country.name.common}>
                <p key={country.name.common}>{country.name.common}</p>{" "}
                <button onClick={() => setFilterCountries(country.name.common)}>
                  Show
                </button>
              </div>
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
            {Object.keys(weatherCondition).length > 0 ? (
              <div>
                <h2>{`Weather in ${detailCountry.capital}`}</h2>
                <p>{`Temperature: ${weatherCondition.main.temp} °C`}</p>
                <img
                  src={`https://openweathermap.org/payload/api/media/file/${weatherCondition.weather[0].icon}.png`}
                />
                <p>{`Wind speed: ${weatherCondition.wind.speed} m/s`}</p>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </>
    </>
  );
};

export default App;
