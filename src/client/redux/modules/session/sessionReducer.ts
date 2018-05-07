import { PrivateUserData } from "../../../../common/user";
import { Action } from "../../actions";
import { AUTHENTICATED_USER } from "./sessionActions";

export type SessionUser = PrivateUserData;

export interface SessionState {
  user: SessionUser | null;
}
const initialState: SessionState = {
  user: null,
};

export default function sessionReducer(state: SessionState = initialState, action: Action) {
  switch (action.type) {
    case AUTHENTICATED_USER:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
