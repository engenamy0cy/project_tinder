export const API_BASE_URL = "http://159.194.210.64:8000";

export const GAMES = [
  { code: "dota2", label: "Dota 2" },
  { code: "cs2", label: "CS2" },
  { code: "majestic", label: "Majestic" },
  { code: "minecraft", label: "Minecraft" },
  { code: "roblox", label: "Roblox" },
  { code: "pubg", label: "PUBG" },
  { code: "brawl_stars", label: "Brawl Stars" },
  { code: "clash_royale", label: "Clash Royale" },
  { code: "palworld", label: "Palworld" },
] as const;

export const GENDERS = [
  { code: "Man", label: "Мужской" },
  { code: "Woman", label: "Женский" },
  { code: "dont_indicate", label: "Не указывать" },
] as const;

export const COUNTRIES = [
  { code: "RU", label: "Россия" },
  { code: "UA", label: "Украина" },
  { code: "KZ", label: "Казахстан" },
  { code: "BY", label: "Беларусь" },
  { code: "UZ", label: "Узбекистан" },
  { code: "US", label: "США" },
  { code: "GB", label: "Великобритания" },
  { code: "DE", label: "Германия" },
  { code: "FR", label: "Франция" },
  { code: "ES", label: "Испания" },
  { code: "IT", label: "Италия" },
  { code: "PL", label: "Польша" },
  { code: "CZ", label: "Чехия" },
  { code: "CN", label: "Китай" },
  { code: "JP", label: "Япония" },
  { code: "KR", label: "Южная Корея" },
  { code: "BR", label: "Бразилия" },
  { code: "TR", label: "Турция" },
  { code: "IN", label: "Индия" },
  { code: "AM", label: "Армения" },
  { code: "GE", label: "Грузия" },
  { code: "AZ", label: "Азербайджан" },
  { code: "KG", label: "Кыргызстан" },
  { code: "MD", label: "Молдова" },
  { code: "LV", label: "Латвия" },
  { code: "LT", label: "Литва" },
  { code: "EE", label: "Эстония" },
] as const;

export const ACCENT = "#FF4458";
export const ACCENT_DARK = "#E63950";

export const COUNTRY_LABELS: Record<string, string> = {};
for (const c of COUNTRIES) {
  COUNTRY_LABELS[c.code] = c.label;
}
