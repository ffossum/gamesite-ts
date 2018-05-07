/* @flow */
import { GameDataState, GamesState } from "../games/gamesReducer";

export const CREATE_GAME_REQUEST = "lobby/create game request";
export const GAME_CREATED = "lobby/game created";
export const GAME_UPDATED = "lobby/game updated";
export const ENTER_LOBBY = "lobby/enter";
export const EXIT_LOBBY = "lobby/exit";
export const REFRESH_LOBBY = "lobby/refresh";

export interface EnterLobbyAction {
  type: typeof ENTER_LOBBY;
}
export function enterLobby(): EnterLobbyAction {
  return {
    type: ENTER_LOBBY,
  };
}

export interface ExitLobbyAction {
  type: typeof EXIT_LOBBY;
}
export function exitLobby(): ExitLobbyAction {
  return {
    type: EXIT_LOBBY,
  };
}

export interface RefreshLobbyAction {
  type: typeof REFRESH_LOBBY;
  payload: GamesState;
}
export function refreshLobby(lobby: GamesState): RefreshLobbyAction {
  return {
    type: REFRESH_LOBBY,
    payload: lobby,
  };
}

export interface CreateGameRequestAction {
  type: typeof CREATE_GAME_REQUEST;
  payload: {
    userId: string;
  };
}

export function createGameRequest(userId: string): CreateGameRequestAction {
  return {
    type: CREATE_GAME_REQUEST,
    payload: {
      userId,
    },
  };
}

export interface GameCreatedAction {
  type: typeof GAME_CREATED;
  payload: GameDataState;
}

export function gameCreated(gameData: GameDataState): GameCreatedAction {
  return {
    type: GAME_CREATED,
    payload: gameData,
  };
}

export interface GameUpdatedAction {
  type: typeof GAME_UPDATED;
  payload: Partial<GameDataState>;
}
export function gameUpdated(partialGameData: Partial<GameDataState>): GameUpdatedAction {
  return {
    type: GAME_UPDATED,
    payload: partialGameData,
  };
}

export type LobbyAction =
  | EnterLobbyAction
  | ExitLobbyAction
  | RefreshLobbyAction
  | GameUpdatedAction
  | CreateGameRequestAction
  | GameCreatedAction;
