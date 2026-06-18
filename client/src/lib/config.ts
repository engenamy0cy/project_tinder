import { Platform } from "react-native";

/** Базовый URL Django API. Для Android-эмулятора — 10.0.2.2 вместо localhost. */
const host = Platform.select({
  android: "159.194.210.64",
  default: "159.194.210.64",
});

export const API_BASE_URL = `http://159.194.210.64`;

export const GAMES = [
  { code: "dota2", label: "Dota 2" },
  { code: "cs2", label: "CS2" },
  { code: "majestic", label: "Majestic" },
] as const;

export const GENDERS = [
  { code: "Man", label: "Мужской" },
  { code: "Woman", label: "Женский" },
  { code: "dont_indicate", label: "Не указывать" },
] as const;

export const ACCENT = "#FF4458";
export const ACCENT_DARK = "#E63950";
