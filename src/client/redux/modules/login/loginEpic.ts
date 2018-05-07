import { ofType } from "redux-observable";
import { of } from "rxjs";
import { catchError, flatMap, map, tap } from "rxjs/operators";
import { Action } from "../../actions";
import { GamesiteEpic } from "../root";
import { LOGIN_REQUEST, loginFailure, loginSuccess } from "./loginActions";
import { LoginRequestAction } from "./loginActions";

const loginEpic: GamesiteEpic = (action$, _, { ajax, location }) =>
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
