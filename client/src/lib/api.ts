import axios from "axios";
import * as FileSystem from "expo-file-system";
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
  userId?: number,
  game?: string
): Promise<ProfileCard[]> {
  const params: any = { game };
  if (userId) params.user_id = userId;
  const { data } = await client.get<{ results: ProfileCard[]; count: number }>(
    "/profiles/profiles/feed/",
    { params }
  );
  return data.results;
}

export async function swipe(
  fromUserId: number,
  toUserId: number,
  action: "yes" | "no"
) {
  const { data } = await client.post("/teampick/search/", {
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
  const { data } = await client.post("/teampick/messages/", {
    from_user_id: fromUserId,
    to_user_id: toUserId,
    text,
  });
  return data as { ok: boolean; detail?: string };
}

export async function fetchMatches(userId: number): Promise<MatchItem[]> {
  const { data } = await client.get<{ matches: MatchItem[] }>("/teampick/matches/", {
    params: { user_id: userId },
  });
  return data.matches;
}

export async function fetchIncomingLikes(userId: number): Promise<MatchItem[]> {
  const { data } = await client.get<{ likes: MatchItem[] }>("/teampick/likes/received/", {
    params: { user_id: userId },
  });
  return data.likes;
}

export async function fetchLikes(userId: number): Promise<MatchItem[]> {
  const { data } = await client.get<{ likes: MatchItem[] }>("/teampick/likes/", {
    params: { user_id: userId },
  });
  return data.likes;
}

export async function fetchMessages(
  matchId: number,
  userId: number
): Promise<ChatMessage[]> {
  const { data } = await client.get<{ messages: ChatMessage[] }>(
    "/teampick/messages/",
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
  const body: Record<string, any> = { user_id: userId };

  for (const [key, value] of Object.entries(payload)) {
    if (value === null || value === undefined) continue;
    if (key === "avatar" && typeof value === "object" && (value as any).uri) {
      const uri = (value as any).uri;
      try {
        body.avatar_base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const ext = uri.split(".").pop()?.toLowerCase() || "png";
        body.avatar_base64 = `image/${ext};base64,${body.avatar_base64}`;
      } catch {
        body.avatar_base64 = null;
      }
    } else if (Array.isArray(value)) {
      body[key] = value;
    } else {
      body[key] = value;
    }
  }

  const { data } = await client.post<ProfileCard>(
    "/profiles/profiles/save/",
    body
  );
  return data;
}
