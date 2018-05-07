/* @flow */
import { Store } from "redux";
import { Epic, ofType } from "redux-observable";
import { Observable, of } from "rxjs";
import { catchError, filter, flatMap, map, tap } from "rxjs/operators";
import { LOGIN_REQUEST, loginFailure, loginSuccess } from "./loginActions";
import { LoginFailureAction, LoginRequestAction, LoginSuccessAction } from "./loginActions";

import { Action } from "../../actions";
import { GamesiteEpic, State } from "../root";

const loginEpic: GamesiteEpic = (action$, store, { ajax, location }) =>
  action$.pipe(
    ofType<Action, LoginRequestAction>(LOGIN_REQUEST),
    flatMap(action =>
      ajax({
        url: "/api/login",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      }).pipe(
        tap(() => location.reload()), // cookie is set, reload page to reconnect deepstream etc
        map(res => loginSuccess(res.response)),
        catchError(() => of(loginFailure()))
      )
    )
  );

export default loginEpic;
