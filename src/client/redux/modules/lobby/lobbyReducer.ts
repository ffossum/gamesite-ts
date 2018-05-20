import { keys, union, without } from "lodash";
import { GameId } from "../../../../common/game";
import { Action } from "../../actions";
import { GAME_CREATED, GAME_UPDATED, REFRESH_LOBBY } from "./lobbyActions";

export interface LobbyState {
  games: GameId[];
}

const initialState = {
  games: [],
};

export default function lobbyReducer(state: LobbyState = initialState, action: Action) {
  switch (action.type) {
    case REFRESH_LOBBY: {
      const gameIds = keys(action.payload);
      return {
        ...state,
        games: gameIds,
      };
    }
    case GAME_CREATED: {
      const game = action.payload;

      return {
        ...state,
        games: union(state.games, [game.id]),
      };
    }
    case GAME_UPDATED: {
      const game = action.payload;
      if (game.status && game.status !== "not_started") {
        return {
          ...state,
          games: without(state.games, game.id), // [game.id], state.games),
        };
      }

      return state;
    }
    default:
      return state;
  }
}
