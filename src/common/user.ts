export type Email = string;
export type UserId = string;
export type Username = string;

export interface PrivateUserData {
  email: Email;
  id: UserId;
  username: Username;
}

export interface PublicUserData {
  id: UserId;
  username: Username;
}
