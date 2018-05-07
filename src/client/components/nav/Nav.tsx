import * as React from "react";
import { Link } from "react-router-dom";

import { SessionUser } from "../../redux/modules/session/sessionReducer";

interface Props {
  user?: SessionUser;
}
export default function Nav(props: Props) {
  const { user } = props;
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/lobby">Lobby</Link>
        </li>

        {user
          ? [
              <li key="user">Logged in as: {user.username}</li>,
              <li key="settings">
                <Link to="/settings">Settings</Link>
              </li>,
              <li key="logout">
                <a href="/logout">Log out</a>
              </li>,
            ]
          : [
              <li key="registration">
                <Link to="/registration">Register</Link>
              </li>,
              <li key="login">
                <Link to="/login">Log in</Link>
              </li>,
            ]}
      </ul>
    </nav>
  );
}
