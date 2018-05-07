import { indexBy } from "ramda";
import { combineEpics, ofType } from "redux-observable";
import { empty, EMPTY, from, merge, of } from "rxjs";
import { catchError, filter, flatMap, takeUntil } from "rxjs/operators";
import { Action } from "../../actions";
import { GameDataState } from "../games/gamesReducer";
import { GamesiteEpic } from "../root";
import {
  CREATE_GAME_REQUEST,
  ENTER_LOBBY,
  EnterLobbyAction,
  EXIT_LOBBY,
  ExitLobbyAction,
  gameCreated,
  gameUpdated,
  refreshLobby,
} from "./lobbyActions";
import { CreateGameRequestAction } from "./lobbyActions";

export const enterLobbyEpic: GamesiteEpic = (action$, _, { deepstreamClient }) => {
  const enterLobbyAction$ = action$.pipe(ofType<Action, EnterLobbyAction>(ENTER_LOBBY));
  const exitLobbyAction$ = action$.pipe(ofType<Action, ExitLobbyAction>(EXIT_LOBBY));

  return enterLobbyAction$.pipe(
    flatMap(() =>
      merge(
        from(
          deepstreamClient.make("refresh-lobby").then((gamesArray: GameDataState[]) => {
            const lobby = indexBy(game => game.id, gamesArray);
            return refreshLobby(lobby);
          })
        ),
        deepstreamClient.subscribe("lobby").pipe(
          flatMap(data => {
            switch (data.t) {
              case "create-game":
                return of(gameCreated(data.p));
              case "game-updated":
                return of(gameUpdated(data.p));
              default:
                return empty();
            }
          }),
          takeUntil(exitLobbyAction$)
        )
      )
    )
  );
};

export const createGameEpic: GamesiteEpic = (action$, _, { deepstreamClient, history }) => {
  return action$.pipe(
    filter(action => action.type === CREATE_GAME_REQUEST),
    flatMap((action: Action) => {
      const uid = (action as CreateGameRequestAction).payload.userId;
      return from(
        deepstreamClient.make("create-game", { uid }).then((game: any) => {
          history.push(`/game/${game.id}`);
          return gameCreated(game);
        })
      ).pipe(catchError(() => EMPTY));
    })
  );
};

export default combineEpics(createGameEpic, enterLobbyEpic);
