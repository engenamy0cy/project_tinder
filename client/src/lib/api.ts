import axios from "axios";

import { API_BASE_URL } from "@/lib/config";
import type {
  ChatMessage,
  MatchItem,
  ProfileCard,
  ProfileWritePayload,
  UserDto,
} from "@/types/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export async function login(username: string, password: string) {
  const { data } = await client.post<{
    user: UserDto;
    profile: ProfileCard | null;
  }>("/users/user/login/", { username, password });
  return data;
}

export async function register(payload: {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  game?: string;
  age?: number;
}) {
  const { data } = await client.post<{
    user: UserDto;
    profile: ProfileCard | null;
  }>("/users/user/register/", payload);
  return data;
}

export async function fetchFeed(
  userId: number,
  game?: string
): Promise<ProfileCard[]> {
  const { data } = await client.get<{ results: ProfileCard[]; count: number }>(
    "/tinder/search/",
    { params: { user_id: userId, game } }
  );
  return data.results;
}

export async function swipe(
  fromUserId: number,
  toUserId: number,
  action: "yes" | "no"
) {
  const { data } = await client.post("/tinder/search/", {
    from_user_id: fromUserId,
    to_user_id: toUserId,
    action,
  });
  return data as { ok: boolean; match?: boolean; detail?: string };
}

export async function sendMessage(
  fromUserId: number,
  toUserId: number,
  text: string
) {
  const { data } = await client.post("/tinder/messages/", {
    from_user_id: fromUserId,
    to_user_id: toUserId,
    text,
  });
  return data as { ok: boolean; detail?: string };
}

export async function fetchMatches(userId: number): Promise<MatchItem[]> {
  const { data } = await client.get<{ matches: MatchItem[] }>("/tinder/matches/", {
    params: { user_id: userId },
  });
  return data.matches;
}

export async function fetchMessages(
  matchId: number,
  userId: number
): Promise<ChatMessage[]> {
  const { data } = await client.get<{ messages: ChatMessage[] }>(
    "/tinder/messages/",
    { params: { match_id: matchId, user_id: userId } }
  );
  return data.messages;
}

export async function fetchMyProfile(userId: number): Promise<ProfileCard> {
  const { data } = await client.get<ProfileCard>("/profiles/profiles/me/", {
    params: { user_id: userId },
  });
  return data;
}

export async function saveProfile(
  userId: number,
  payload: ProfileWritePayload
): Promise<ProfileCard> {
  const { data } = await client.post<ProfileCard>(
    "/profiles/profiles/save/",
    { user_id: userId, ...payload }
  );
  return data;
}
