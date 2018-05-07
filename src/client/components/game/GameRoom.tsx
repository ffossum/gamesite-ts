import { find } from "lodash";
import * as React from "react";
import { PublicUserData } from "../../../common/user";
import GameChatContainer from "../../redux/modules/chat/GameChatContainer";
import { GameStatus } from "../../redux/modules/games/gamesReducer";
import SpectatorRoom from "./SpectatorRoom";

export interface Game {
  id: string;
  host: PublicUserData;
  players: PublicUserData[];
  status?: GameStatus;
}
export interface Props {
  enterRoom: (gameId: string) => any;
  exitRoom: (gameId: string) => any;
  enterSpectatorRoom: (gameId: string) => any;
  exitSpectatorRoom: (gameId: string) => any;
  joinGame: () => any;
  leaveGame: () => any;
  cancelGame: () => any;
  startGame: () => any;
  gameId: string;
  game?: Game;
  user?: PublicUserData;
}
export default class GameRoom extends React.Component<Props> {
  public componentDidMount() {
    this.props.enterRoom(this.props.gameId);
  }
  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.gameId !== this.props.gameId) {
      this.props.exitRoom(this.props.gameId);
      this.props.enterRoom(nextProps.gameId);
    }
  }
  public componentWillUnmount() {
    this.props.exitRoom(this.props.gameId);
  }

  public render() {
    const { gameId, game, user } = this.props;

    if (!game) {
      return <div>Game data unavailable</div>;
    }
    if (game.status === "canceled") {
      return <div>Game canceled</div>;
    }

    const isInGame = user && game && find(game.players, player => player.id === user.id);

    if (!isInGame) {
      return (
        <SpectatorRoom
          enterSpectatorRoom={this.props.enterSpectatorRoom}
          exitSpectatorRoom={this.props.exitSpectatorRoom}
          joinGame={this.props.joinGame}
          game={game}
          gameId={gameId}
          user={user}
        />
      );
    }

    const isHost = user && user.id === game.host.id;

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
            {isHost && [
              <button key="cancel" onClick={this.handleCancelClick}>
                Cancel game
              </button>,
              <button key="start" onClick={this.handleStartClick}>
                Start game
              </button>,
            ]}
            {!isHost && <button onClick={this.handleLeaveClick}>Leave game</button>}
            <GameChatContainer gameId={gameId} />
          </div>
        )}
      </div>
    );
  }

  private handleStartClick = (e: React.SyntheticEvent<{}>) => {
    e.preventDefault();
    this.props.startGame();
  };
  private handleCancelClick = (e: React.SyntheticEvent<{}>) => {
    e.preventDefault();
    this.props.cancelGame();
  };
  private handleLeaveClick = (e: React.SyntheticEvent<{}>) => {
    e.preventDefault();
    this.props.leaveGame();
  };
}
