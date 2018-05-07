import { ofType } from "redux-observable";
import { flatMap, switchMap } from "rxjs/operators";
import { Action } from "../../actions";
import deepstreamEventToActions from "../../deepstreamEventToActions";
import { GamesiteEpic } from "../root";
import { AUTHENTICATED_USER } from "./sessionActions";
import { AuthenticatedUserAction } from "./sessionActions";

const sessionEpic: GamesiteEpic = (action$, _, { deepstreamClient }) => {
  return action$.pipe(
    ofType<Action, AuthenticatedUserAction>(AUTHENTICATED_USER),
    switchMap(action => {
      return flatMap(deepstreamEventToActions)(
        deepstreamClient.subscribe("user:" + action.payload.id)
      );
    })
  );
};

export default sessionEpic;
