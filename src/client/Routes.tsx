import * as React from "react";

import FrontPage from "./components/Frontpage";
import Lobby from "./components/lobby/Lobby";
import Nav from "./components/Nav";

import { Route, Switch } from "react-router";

export default function Routes() {
  return (
    <React.Fragment>
      <Nav />
      <Switch>
        <Route exact path="/" component={FrontPage} />
        <Route path="/lobby" component={Lobby} />
      </Switch>
    </React.Fragment>
  );
}
