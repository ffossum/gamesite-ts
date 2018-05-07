export const AUTHENTICATED_USER = "user/authenticated";
import { PrivateUserData } from "../../../../common/user";

export interface AuthenticatedUserAction {
  type: typeof AUTHENTICATED_USER;
  payload: PrivateUserData;
}
export function authenticatedUser(user: PrivateUserData): SessionAction {
  return {
    type: AUTHENTICATED_USER,
    payload: user,
  };
}

export type SessionAction = AuthenticatedUserAction;
