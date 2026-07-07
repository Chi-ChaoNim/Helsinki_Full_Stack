import { useEffect, useState } from "react";

import {
  type NonSensitiveDiaryEntry,
  type NewDiaryEntry,
  Weather,
  Visibility,
} from "../../backend/src/types.ts";
import diaryService from "./services/diaryService.ts";

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [date, setDate] = useState<string>("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState<string>("");

  useEffect(() => {
    diaryService.getAll().then((initalDiaries) => {
      setDiaries(initalDiaries);
    });
  }, []);

  const handleCreate = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const newDiary: NewDiaryEntry = {
      date,
      visibility,
      weather,
      comment,
    };
    diaryService.create(newDiary).then((returned) => {
      setDiaries(diaries.concat(returned));
    });
    setComment("");
    setDate("");
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label htmlFor="date">Date: </label>
          <input
            type="date"
            id="date"
            onChange={(event) => setDate(event.target.value)}
          />{" "}
          <br />
        </div>
        <div>
          <label htmlFor="visibility">Visibility: </label>

          <label htmlFor="great">Great</label>
          <input
            type="radio"
            id="great"
            value="great"
            name="visibility"
            checked={visibility === Visibility.Great}
            onChange={() => setVisibility(Visibility.Great)}
          />

          <label htmlFor="good">Good</label>
          <input
            type="radio"
            id="good"
            name="visibility"
            value="good"
            onChange={() => setVisibility(Visibility.Good)}
          />

          <label htmlFor="ok">Ok</label>
          <input
            type="radio"
            id="ok"
            name="visibility"
            value="ok"
            onChange={() => setVisibility(Visibility.Ok)}
          />

          <label htmlFor="poor">Poor</label>
          <input
            type="radio"
            id="poor"
            name="visibility"
            value="poor"
            onChange={() => setVisibility(Visibility.Poor)}
          />
        </div>
        <div>
          <label htmlFor="weather">Weather: </label>

          <label htmlFor="sunny">Sunny</label>
          <input
            type="radio"
            id="sunny"
            value="sunny"
            name="weather"
            checked={weather === Weather.Sunny}
            onChange={() => setWeather(Weather.Sunny)}
          />

          <label htmlFor="rainy">Rainy</label>
          <input
            type="radio"
            id="rainy"
            name="weather"
            value="rainy"
            onChange={() => setWeather(Weather.Rainy)}
          />

          <label htmlFor="cloudy">Cloudy</label>
          <input
            type="radio"
            id="cloudy"
            name="weather"
            value="cloudy"
            onChange={() => setWeather(Weather.Cloudy)}
          />

          <label htmlFor="stormy">Stormy</label>
          <input
            type="radio"
            id="stormy"
            name="weather"
            value="stormy"
            onChange={() => setWeather(Weather.Stormy)}
          />

          <label htmlFor="windy">Windy</label>
          <input
            type="radio"
            id="windy"
            name="weather"
            value="windy"
            onChange={() => setWeather(Weather.Windy)}
          />
        </div>
        <div>
          <label htmlFor="comment">Comment: </label>
          <input
            type="text"
            name="comment"
            onChange={(event) => setComment(event.target.value)}
          ></input>
        </div>

        <button type="submit">Add</button>
      </form>
      <h2>Diary enteries</h2>
      <ul>
        {diaries.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.date}</strong> <br />
            Visibility: {entry.visibility} <br />
            Weather: {entry.weather}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
