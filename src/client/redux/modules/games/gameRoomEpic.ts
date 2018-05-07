import { combineEpics, ofType } from "redux-observable";
import { EMPTY, merge, of } from "rxjs";
import {
  catchError,
  filter,
  flatMap,
  ignoreElements,
  map,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { Action } from "../../actions";
import deepstreamEventToActions from "../../deepstreamEventToActions";
import { clearChat } from "../chat/chatActions";
import { GamesiteEpic } from "../root";
import { FetchGameDataRequestAction } from "./gameDataActions";
import {
  FETCH_GAME_DATA_REQUEST,
  fetchGameDataRequest,
  fetchGameDataSuccess,
} from "./gameDataActions";
import {
  CANCEL_GAME,
  ENTER_ROOM,
  ENTER_SPECTATOR,
  EXIT_ROOM,
  EXIT_SPECTATOR,
  JOIN_GAME,
  JoinGameAction,
  LEAVE_GAME,
  LeaveGameAction,
  START_GAME,
} from "./gameRoomActions";
import {
  CancelGameAction,
  EnterRoomAction,
  EnterSpectatorRoomAction,
  ExitRoomAction,
  StartGameAction,
} from "./gameRoomActions";

const enterRoomEpic: GamesiteEpic = action$ => {
  return action$.pipe(
    ofType<Action, EnterRoomAction>(ENTER_ROOM),
    filter(action => action.payload.shouldFetchGameData),
    map(action => fetchGameDataRequest(action.payload.gameId))
  );
};

const fetchGameDataEpic: GamesiteEpic = (action$, _, { ajax }) => {
  return action$.pipe(
    ofType<Action, FetchGameDataRequestAction>(FETCH_GAME_DATA_REQUEST),
    switchMap(action => {
      const gameId = action.payload;

      return ajax.getJSON(`/api/game/${gameId}`).pipe(
        flatMap<any, Action>(game => {
          if (game) {
            return of(fetchGameDataSuccess(game));
          } else {
            return EMPTY;
          }
        }),
        catchError(() => EMPTY)
      );
    })
  );
};

const exitRoomEpic: GamesiteEpic = action$ => {
  return action$.pipe(
    ofType<Action, ExitRoomAction>(EXIT_ROOM),
    flatMap(action => {
      const { gameId, isInGame } = action.payload;
      if (!isInGame) {
        const channelName = `game:${gameId}`;
        return of(clearChat(channelName));
      } else {
        return EMPTY;
      }
    })
  );
};

const gameRoomEpic: GamesiteEpic = (action$, _, { deepstreamClient }) => {
  return merge(
    action$.pipe(
      ofType<Action, EnterSpectatorRoomAction>(ENTER_SPECTATOR),
      flatMap(action => {
        const gameId = action.payload;
        return deepstreamClient
          .subscribe("spectate:" + gameId)
          .pipe(
            flatMap(deepstreamEventToActions),
            takeUntil(action$.pipe(filter(a => a.type === EXIT_SPECTATOR && a.payload === gameId)))
          );
      })
    ),

    action$.pipe(
      ofType<Action, JoinGameAction>(JOIN_GAME),
      tap(action => {
        deepstreamClient.make("join-game", action.payload);
      }),
      ignoreElements()
    ),

    action$.pipe(
      ofType<Action, LeaveGameAction>(LEAVE_GAME),
      tap(action => {
        deepstreamClient.make("leave-game", action.payload);
      }),
      ignoreElements()
    ),

    action$.pipe(
      ofType<Action, CancelGameAction>(CANCEL_GAME),
      tap(action => {
        const gid = action.payload.gameId;
        const uid = action.payload.userId;
        deepstreamClient.make("cancel-game", { gid, uid });
      }),
      ignoreElements()
    ),

    action$.pipe(
      ofType<Action, StartGameAction>(START_GAME),
      tap(action => {
        const gid = action.payload.gameId;
        const uid = action.payload.userId;
        deepstreamClient.make("start-game", { gid, uid });
      }),
      ignoreElements()
    )
  );
};

export default combineEpics(enterRoomEpic, fetchGameDataEpic, exitRoomEpic, gameRoomEpic);
