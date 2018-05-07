/* @flow */
import { Store } from "redux";
import { combineEpics, Epic, ofType } from "redux-observable";
import { Observable } from "rxjs";
import { filter, flatMap, ignoreElements, takeUntil, tap } from "rxjs/operators";
import { Action } from "../../actions";
import DeepstreamClient from "../../deepstreamClient";
import { Dependencies, GamesiteEpic, State } from "../root";
import {
  JOIN_CHANNEL,
  LEAVE_CHANNEL,
  receiveMessage,
  SEND_GAME_MESSAGE,
  SEND_MESSAGE,
} from "./chatActions";
import {
  JoinChannelAction,
  ReceiveMessageAction,
  SendGameMessageAction,
  SendMessageAction,
} from "./chatActions";

const sendMessageEpic: GamesiteEpic = (action$, store, { deepstreamClient }) => {
  return action$.pipe(
    ofType<Action, SendMessageAction>(SEND_MESSAGE),
    tap(action => {
      const payload = action.payload;
      deepstreamClient.emit(`chat:${payload.ch}`, {
        t: "chatmsg",
        ...payload,
      });
    }),
    ignoreElements()
  );
};

const sendGameMessageEpic: GamesiteEpic = (action$, store, { deepstreamClient }) => {
  return action$.pipe(
    ofType<Action, SendGameMessageAction>(SEND_GAME_MESSAGE),
    tap(action => {
      const { userId, gameId, players, text } = action.payload;
      const channelName = `game:${gameId}`;

      const data = {
        t: "chatmsg",
        ch: channelName,
        txt: text,
        uid: userId,
      };

      deepstreamClient.emit(`spectate:${gameId}`, data);
      players.forEach(playerId => {
        deepstreamClient.emit(`user:${playerId}`, data);
      });
    }),
    ignoreElements()
  );
};

const joinChannelEpic: GamesiteEpic = (action$, store, { deepstreamClient }) => {
  return action$.pipe(
    ofType<Action, JoinChannelAction>(JOIN_CHANNEL),
    flatMap(action => {
      const channelName = action.payload;
      return deepstreamClient
        .subscribe(`chat:${channelName}`)
        .pipe(
          takeUntil(
            action$.pipe(filter(a => a.type === LEAVE_CHANNEL && a.payload === channelName))
          )
        );
    }),
    flatMap(data => {
      switch (data.t) {
        case "chatmsg": {
          const time = new Date().toISOString();
          return [receiveMessage(data, time)];
        }

        default:
          return [];
      }
    })
  );
};

export default combineEpics(sendMessageEpic, sendGameMessageEpic, joinChannelEpic);
