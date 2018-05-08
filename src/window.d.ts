import { PrivateUserData } from "./common/user";
import { compose } from "redux";

declare global {
  interface Window {
    __USER__?: PrivateUserData;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
