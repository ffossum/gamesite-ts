import * as React from "react";
import { PublicUserData } from "../../../common/user";
import GameChatContainer from "../../redux/modules/chat/GameChatContainer";
import { Game } from "./GameRoom";

export interface Props {
  enterSpectatorRoom: (gameId: string) => void;
  exitSpectatorRoom: (gameId: string) => void;
  joinGame: () => void;
  gameId: string;
  game?: Game;
  user?: PublicUserData;
}
export default class SpectatorRoom extends React.Component<Props> {
  public handleJoinClick = (e: React.SyntheticEvent<{}>) => {
    e.preventDefault();
    this.props.joinGame();
  };

  public componentDidMount() {
    this.props.enterSpectatorRoom(this.props.gameId);
  }
  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.gameId !== this.props.gameId) {
      this.props.exitSpectatorRoom(this.props.gameId);
      this.props.enterSpectatorRoom(nextProps.gameId);
    }
  }
  public componentWillUnmount() {
    this.props.exitSpectatorRoom(this.props.gameId);
  }

  public render() {
    const { gameId, game, user } = this.props;
    return (
      <div>
        <h2>{gameId}</h2>
        {game && (
          <div>
            <div>
              <h3>Players:</h3>
              <ul>
                {game.players.map(player => (
                  <li key={player.id}>
                    {player.username}
                    {game.host.id === player.id && <span> (Host)</span>}
                  </li>
                ))}
              </ul>
            </div>
            <button disabled={!user} onClick={this.handleJoinClick}>
              Join game
            </button>
            <GameChatContainer gameId={gameId} />
          </div>
        )}
      </div>
    );
  }
}
