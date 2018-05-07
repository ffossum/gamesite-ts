import * as format from "date-fns/format";
import * as React from "react";
import { Link, Route } from "react-router-dom";
import { RouteComponentProps } from "react-router-dom";
import { PublicUserData } from "../../../common/user";
import ChatContainer from "../../redux/modules/chat/ChatContainer";
import { SessionUser } from "../../redux/modules/session/sessionReducer";
import CreateGameForm from "./CreateGameForm";

function CreateGameLink(props: RouteComponentProps<{}>) {
  const to = `${props.location.pathname}/create`;
  return <Link to={to}>Create game</Link>;
}

export interface Props {
  user?: SessionUser | undefined;
  games: Array<{
    id: string;
    host: PublicUserData;
    players: PublicUserData[];
    createdTime: string;
  }>;
  createGame: () => void;
  enterLobby: () => void;
  exitLobby: () => void;
}
export default class Lobby extends React.Component<Props> {
  public componentDidMount() {
    this.props.enterLobby();
  }
  public componentWillUnmount() {
    this.props.exitLobby();
  }
  public render() {
    const { createGame, games } = this.props;

    return (
      <main>
        <section>
          <h2>Lobby</h2>
          <Route exact path="/lobby" render={CreateGameLink} />
          <Route path="/lobby/create" render={() => <CreateGameForm createGame={createGame} />} />
          <ul>
            {games.map(game => (
              <li key={game.id}>
                <Link to={`/game/${game.id}`}>
                  Host: {game.host.username}, created:{" "}
                  {format(game.createdTime, "ddd, MMM Do HH:mm")}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <ChatContainer channelName="general" />
        </section>
      </main>
    );
  }
}
