import axios from "axios";

const weatherAPIKey = import.meta.env.VITE_WEATHER_API_KEY;

const baseCountryURL = "https://studies.cs.helsinki.fi/restcountries/api";
const baseWeatherURL = "https://api.openweathermap.org/data/2.5/weather?";
const baseGeoLocalURL = "http://api.openweathermap.org/geo/1.0/direct?";

const getAllCountries = async () => {
  try {
    const request = axios.get(`${baseCountryURL}/all`);
    return request.then((response) => response.data);
  } catch (error) {
    console.error(error);
  }
};

const getWeather = async (lat, long) => {
  try {
    const request = axios.get(
      `${baseWeatherURL}&lat=${lat}&lon=${long}&appid=${weatherAPIKey}&units=metric`,
    );
    return request.then((response) => response.data);
  } catch (error) {
    console.error(error);
  }
};

const getGeoLocal = async (cityName, countryCode) => {
  try {
    const request = axios.get(
      `${baseGeoLocalURL}q=${cityName},${countryCode}&limit=1&appid=${weatherAPIKey}`,
    );
    return request.then((response) => response.data);
  } catch (error) {
    console.error(error);
  }
};

export default { getAllCountries, getWeather, getGeoLocal };
