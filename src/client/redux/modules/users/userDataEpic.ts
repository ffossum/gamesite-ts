import { flatMap as lodashFlatMap, uniq, values } from "lodash";
import { stringify } from "query-string";
import { ofType } from "redux-observable";
import { merge } from "rxjs";
import { bufferTime, distinct, filter, flatMap, map } from "rxjs/operators";
import { Action } from "../../actions";
import { ReceiveMessageAction } from "../chat/chatActions";
import { RECEIVE_MESSAGE } from "../chat/chatActions";
import { FetchGameDataSuccessAction } from "../games/gameDataActions";
import { FETCH_GAME_DATA_SUCCESS } from "../games/gameDataActions";
import { PlayerJoinedAction } from "../games/gameRoomActions";
import { PLAYER_JOINED } from "../games/gameRoomActions";
import { GameCreatedAction, GameUpdatedAction, RefreshLobbyAction } from "../lobby/lobbyActions";
import { GAME_CREATED, GAME_UPDATED, REFRESH_LOBBY } from "../lobby/lobbyActions";
import { GamesiteEpic } from "../root";
import { fetchedUserData } from "./userDataActions";

const userDataEpic: GamesiteEpic = (action$, state$, { ajax }) => {
  return merge(
    action$.pipe(
      ofType<Action, PlayerJoinedAction>(PLAYER_JOINED),
      map(action => action.payload.userId)
    ),

    action$.pipe(
      ofType<Action, ReceiveMessageAction>(RECEIVE_MESSAGE),
      map(action => action.payload.msg.uid)
    ),

    action$.pipe(
      ofType<Action, GameCreatedAction>(GAME_CREATED),
      map(action => action.payload.host)
    ),

    action$.pipe(
      ofType<Action, GameUpdatedAction>(GAME_UPDATED),
      flatMap(action => {
        const game = action.payload;
        return game.players ? game.players : [];
      })
    ),

    action$.pipe(
      ofType<Action, FetchGameDataSuccessAction>(FETCH_GAME_DATA_SUCCESS),
      flatMap(action => {
        const game = action.payload;
        return [game.host, ...game.players];
      })
    ),
    action$.pipe(
      ofType<Action, RefreshLobbyAction>(REFRESH_LOBBY),
      flatMap(action => {
        const games = values(action.payload);
        const userIds = lodashFlatMap(games, game => [game.host, ...game.players]);
        return uniq(userIds);
      })
    )
  ).pipe(
    distinct(),

    filter(userId => !state$.value.users[userId]),
    bufferTime(100),
    filter(userIds => userIds.length > 0),
    flatMap(userIds => {
      const queryString = stringify({
        id: userIds,
      });
      return ajax.getJSON(`/api/users?${queryString}`);
    }),
    map(users => fetchedUserData(users))
  );
};

export default userDataEpic;
