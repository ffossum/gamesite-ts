/* @flow */
import { PublicUserData } from "../../../../common/user";
import { Action } from "../../actions";
import { AUTHENTICATED_USER } from "../session/sessionActions";
import { FETCHED_USER_DATA } from "./userDataActions";

export interface UsersState {
  [userId: string]: PublicUserData;
}

const initialState = {};

export default function usersReducer(state: UsersState = initialState, action: Action) {
  switch (action.type) {
    case FETCHED_USER_DATA: {
      const newUsers: UsersState = {};
      action.payload.forEach(user => {
        newUsers[user.id] = user;
      });

      return {
        ...state,
        ...newUsers,
      };
    }
    case AUTHENTICATED_USER: {
      const user = action.payload;
      return {
        ...state,
        [user.id]: user,
      };
    }
    default:
      return state;
  }
}
