import deepstream from "deepstream.io-client-js";
import { createBrowserHistory } from "history";
import * as React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { ajax } from "rxjs/ajax";
import configureStore from "./redux/configureStore";
import DeepstreamClient from "./redux/deepstreamClient";
import { joinChannel } from "./redux/modules/chat/chatActions";
import { authenticatedUser } from "./redux/modules/session/sessionActions";
import Routes from "./Routes";

const history = createBrowserHistory();
const user = window.__USER__;

const deepstreamClient = new DeepstreamClient(deepstream, "localhost:6020");

deepstreamClient.login().then(() => {
  const dependencies = {
    ajax,
    deepstreamClient,
    location: window.location,
    devToolsCompose: window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__,
    history,
  };

  const store = configureStore(undefined, dependencies);

  if (user) {
    store.dispatch(authenticatedUser(user));
  }

  store.dispatch(joinChannel("general"));

  const element = document.getElementById("root");
  element &&
    render(
      <Provider store={store}>
        <Router history={history}>
          <Routes />
        </Router>
      </Provider>,
      element
    );
});
