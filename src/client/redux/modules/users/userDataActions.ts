/* @flow */
export const FETCHED_USER_DATA = "data/fetched user(s)";
import { PublicUserData } from "../../../../common/user";

export interface FetchedUserDataAction {
  type: typeof FETCHED_USER_DATA;
  payload: PublicUserData[];
}
export function fetchedUserData(users: PublicUserData[]): FetchedUserDataAction {
  return {
    type: FETCHED_USER_DATA,
    payload: users,
  };
}

export type UserDataAction = FetchedUserDataAction;
