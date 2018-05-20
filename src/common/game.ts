import { UserId } from "./user";

export type GameStatus = "not_started" | "in_progress" | "canceled" | "started";
export type GameId = string;

export interface GameData {
  id: GameId;
  host: UserId;
  createdTime: string;
  players: UserId[];
  status?: GameStatus;
}
