export type UserStatus = {
  is_verified: boolean;
  is_online: boolean;
  last_activity: string;
};

export type GameRef = {
  code: string;
  label: string;
};

export type ProfileCard = {
  user_id: number;
  username: string;
  display_name: string;
  first_name: string;
  last_name: string;
  bio: string;
  age: number | null;
  gender: string | null;
  gender_label: string | null;
  hours_in_game: number | null;
  city: string;
  country: string;
  game: string | null;
  game_label: string | null;
  games: GameRef[];
  avatar_url: string | null;
  status: UserStatus;
  actions?: { id: string; label: string }[];
};

export type UserDto = {
  id: number;
  username: string;
  email: string;
  is_verified_flag: boolean;
  is_online_flag: boolean;
  last_activity_at: string | null;
};

export type MatchItem = {
  match_id: number;
  user_id: number;
  username: string;
  display_name: string;
  game_label: string | null;
  avatar_url: string | null;
  created_at: string;
  last_message: string | null;
};

export type ChatMessage = {
  id: number;
  sender_id: number;
  text: string;
  created_at: string;
  mine: boolean;
};

export type ProfileWritePayload = {
  user_id?: number;
  first_name?: string;
  last_name?: string;
  bio?: string;
  age?: number | null;
  hours_in_game?: number | null;
  gender?: string;
  city?: string;
  country?: string;
  game?: string;
  games?: string[];
};
