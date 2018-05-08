import { History } from "history";
import { compose } from "redux";
import { Action } from "../actions";
import DeepstreamClient from "../deepstreamClient";

import { combineReducers } from "redux";
import { combineEpics, Epic } from "redux-observable";
import { ajax } from "rxjs/ajax";

import registrationEpic from "./registration/registrationEpic";
import registration from "./registration/registrationReducer";
import { RegistrationState } from "./registration/registrationReducer";

import sessionEpic from "./session/sessionEpic";
import session from "./session/sessionReducer";
import { SessionState } from "./session/sessionReducer";

import loginEpic from "./login/loginEpic";
import login from "./login/loginReducer";
import { LoginState } from "./login/loginReducer";

import chatEpic from "./chat/chatEpic";
import chat from "./chat/chatReducer";
import { ChatState } from "./chat/chatReducer";

import userDataEpic from "./users/userDataEpic";
import users from "./users/usersReducer";
import { UsersState } from "./users/usersReducer";

import lobbyEpic from "./lobby/lobbyEpic";
import lobby from "./lobby/lobbyReducer";
import { LobbyState } from "./lobby/lobbyReducer";

import gameRoomEpic from "./games/gameRoomEpic";
import games from "./games/gamesReducer";
import { GamesState } from "./games/gamesReducer";

export interface State {
  chat: ChatState;
  login: LoginState;
  registration: RegistrationState;
  session: SessionState;
  users: UsersState;
  lobby: LobbyState;
  games: GamesState;
}

export interface Dependencies {
  ajax: typeof ajax;
  deepstreamClient: DeepstreamClient;
  location: typeof window.location;
  history: History;
  devToolsCompose?: typeof compose;
}

export type GamesiteEpic = Epic<Action, State, Dependencies>;

export type RootReducer = (state: State, action: Action) => State;
export const rootReducer: RootReducer = combineReducers<State>({
  chat,
  login,
  registration,
  session,
  users,
  lobby,
  games,
});

export const rootEpic: GamesiteEpic = combineEpics(
  chatEpic,
  loginEpic,
  registrationEpic,
  sessionEpic,
  userDataEpic,
  lobbyEpic,
  gameRoomEpic
);
