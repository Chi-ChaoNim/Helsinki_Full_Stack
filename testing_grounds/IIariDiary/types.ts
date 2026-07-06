export const Weather = {
  Sunny: "sunny",
  Rainy: "rainy",
  Cloudy: "cloudy",
  Stormy: "stormy",
  Windy: "windy",
} as const;

export const Visibility = {
  Great: "great",
  Good: "good",
  Ok: "ok",
  Poor: "poor",
} as const;

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}

export type Visibility = (typeof Visibility)[keyof typeof Visibility];

export type Weather = (typeof Weather)[keyof typeof Weather];

export type NonSensitiveDiaryEntry = Omit<DiaryEntry, "comment">;

export type NewDiaryEntry = Omit<DiaryEntry, "id">;
