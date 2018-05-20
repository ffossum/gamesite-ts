export const FETCH_GAME_DATA_REQUEST = "data/fetch game request";
export const FETCH_GAME_DATA_SUCCESS = "data/fetch game success";
import { GameData } from "../../../../common/game";

export interface FetchGameDataRequestAction {
  type: typeof FETCH_GAME_DATA_REQUEST;
  payload: string;
}
export function fetchGameDataRequest(gameId: string): FetchGameDataRequestAction {
  return {
    type: FETCH_GAME_DATA_REQUEST,
    payload: gameId,
  };
}

export interface FetchGameDataSuccessAction {
  type: typeof FETCH_GAME_DATA_SUCCESS;
  payload: GameData;
}
export function fetchGameDataSuccess(game: GameData): FetchGameDataSuccessAction {
  return {
    type: FETCH_GAME_DATA_SUCCESS,
    payload: game,
  };
}

export type GameDataAction = FetchGameDataRequestAction | FetchGameDataSuccessAction;
