/* @flow */
import { Store } from "redux";
import { ofType } from "redux-observable";
import { Observable, of } from "rxjs";
import { catchError, filter, flatMap, map, tap } from "rxjs/operators";
import { Action } from "../../actions";
import { GamesiteEpic } from "../root";
import {
  REGISTRATION_REQUEST,
  registrationFailure,
  registrationSuccess,
} from "./registrationActions";
import { RegistrationRequestAction } from "./registrationActions";

const registrationEpic: GamesiteEpic = (action$, store, { ajax, location }) => {
  return action$.pipe(
    ofType<Action, RegistrationRequestAction>(REGISTRATION_REQUEST),
    flatMap(action =>
      ajax({
        url: "/api/registration",
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(action.payload),
      }).pipe(
        tap(() => location.reload()),
        map(res =>
          registrationSuccess({
            username: (action as RegistrationRequestAction).payload.username,
            ...res.response,
          })
        ),
        catchError(() => of(registrationFailure()))
      )
    )
  );
};

export default registrationEpic;
