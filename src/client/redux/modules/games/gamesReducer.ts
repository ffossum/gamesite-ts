import { union, without } from "ramda";
import { Action } from "../../actions";
import { GAME_CREATED, GAME_UPDATED, REFRESH_LOBBY } from "../lobby/lobbyActions";
import { FETCH_GAME_DATA_SUCCESS } from "./gameDataActions";
import {
  GAME_CANCELED,
  GAME_STARTED,
  PLAYER_JOINED,
  PLAYER_LEFT,
  PlayerLeftAction,
} from "./gameRoomActions";

export type GameStatus = "not_started" | "in_progress" | "canceled" | "started";
export interface GameDataState {
  id: string;
  host: string;
  createdTime: string;
  players: string[];
  status?: GameStatus;
}
export interface GamesState {
  [gameId: string]: GameDataState;
}

const initialState: GamesState = {};

export default function gamesReducer(state: GamesState = initialState, action: Action): GamesState {
  switch (action.type) {
    case REFRESH_LOBBY: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case FETCH_GAME_DATA_SUCCESS: {
      const game = action.payload;
      return {
        ...state,
        [game.id]: game,
      };
    }
    case GAME_CREATED: {
      const gameData = action.payload;
      return {
        ...state,
        [gameData.id]: gameData,
      };
    }
    case GAME_UPDATED: {
      const newGameData = action.payload;
      const gameId = newGameData.id;
      const previousGame = gameId && state[gameId];
      if (gameId && previousGame) {
        return {
          ...state,
          [gameId]: {
            ...previousGame,
            ...newGameData,
          },
        };
      } else {
        return state;
      }
    }
    case GAME_CANCELED: {
      const gameId = action.payload;
      const previousGame = state[gameId];
      return {
        ...state,
        [gameId]: {
          ...previousGame,
          status: "canceled",
        },
      };
    }
    case GAME_STARTED: {
      const gameId = action.payload;
      const previousGame = state[gameId];
      return {
        ...state,
        [gameId]: {
          ...previousGame,
          status: "started",
        },
      };
    }
    case PLAYER_JOINED: {
      const { gameId, userId } = action.payload;
      const game = state[gameId];
      if (game) {
        return {
          ...state,
          [gameId]: {
            ...game,
            players: union(game.players, [userId]),
          },
        };
      }

      return state;
    }
    case PLAYER_LEFT: {
      const { gameId, userId } = (action as PlayerLeftAction).payload;
      const game = state[gameId];
      if (game) {
        return {
          ...state,
          [gameId]: {
            ...game,
            players: without([userId], game.players),
          },
        };
      }

      return state;
    }
    default:
      return state;
  }
}
