// import { receiveMessage } from "./modules/chat/chatActions";
import { Action } from "./actions";
import {
  gameCanceled,
  gameStarted,
  playerJoined,
  playerLeft,
} from "./modules/games/gameRoomActions";

export interface PlayerJoinedEvent {
  t: "player-joined";
  p: {
    gid: string;
    uid: string;
  };
}

export interface PlayerLeftEvent {
  t: "player-left";
  p: {
    gid: string;
    uid: string;
  };
}

export interface GameCanceledEvent {
  t: "game-canceled";
  p: {
    gid: string;
  };
}

export interface GameStartedEvent {
  t: "game-started";
  p: {
    gid: string;
  };
}

export interface ChatMessageEvent {
  t: "chatmsg";
  uid: string;
  txt: string;
  ch: string;
}

export type DeepstreamEvent =
  | PlayerJoinedEvent
  | PlayerLeftEvent
  | ChatMessageEvent
  | GameCanceledEvent
  | GameStartedEvent;

export default function deepstreamEventToActions(event: DeepstreamEvent): Action[] {
  switch (event.t) {
    case "player-joined": {
      const gameId = event.p.gid;
      const userId = event.p.uid;
      return [playerJoined(userId, gameId)];
    }
    case "player-left": {
      const gameId = event.p.gid;
      const userId = event.p.uid;
      return [playerLeft(userId, gameId)];
    }
    case "game-canceled": {
      const gameId = event.p.gid;
      return [gameCanceled(gameId)];
    }
    case "game-started": {
      const gameId = event.p.gid;
      return [gameStarted(gameId)];
    }
    // case "chatmsg": {
    //   const time = new Date().toISOString();
    //   return [receiveMessage(event, time)];
    // }
    default:
      return [];
  }
}
