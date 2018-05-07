import { ChatAction } from "./modules/chat/chatActions";
import { GameDataAction } from "./modules/games/gameDataActions";
import { GameRoomAction } from "./modules/games/gameRoomActions";
import { LobbyAction } from "./modules/lobby/lobbyActions";
import { LoginAction } from "./modules/login/loginActions";
import { RegistrationAction } from "./modules/registration/registrationActions";
import { SessionAction } from "./modules/session/sessionActions";
import { UserDataAction } from "./modules/users/userDataActions";

export type Action =
  | ChatAction
  | GameDataAction
  | GameRoomAction
  | LobbyAction
  | LoginAction
  | RegistrationAction
  | SessionAction
  | UserDataAction;
