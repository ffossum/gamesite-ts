import * as React from "react";
import { Route, Switch } from "react-router-dom";
import FrontPage from "./components/FrontPage";
import NotFound from "./components/NotFound";
import Settings from "./components/settings/Settings";
import GameRoomContainer from "./redux/modules/games/GameRoomContainer";
import LobbyContainer from "./redux/modules/lobby/LobbyContainer";
import LoginFormContainer from "./redux/modules/login/LoginFormContainer";
import NavContainer from "./redux/modules/nav/NavContainer";
import RegistrationFormContainer from "./redux/modules/registration/RegistrationFormContainer";

export default function Routes() {
  return (
    <div>
      <NavContainer />
      <Switch>
        <Route exact path="/" component={FrontPage} />
        <Route path="/lobby" component={LobbyContainer} />
        <Route path="/game/:gameId" component={GameRoomContainer} />
        <Route exact path="/registration" component={RegistrationFormContainer} />
        <Route exact path="/login" component={LoginFormContainer} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}
