import * as React from "react";
import { PublicUserData } from "../../../common/user";

export interface Props {
  host: PublicUserData;
  players: PublicUserData[];
}

export default function PlayerList({ host, players }: Props) {
  return (
    <ul>
      <li>{host.username} (Host)</li>
      {players.map(player => <li id={player.id}>{player.username}</li>)}
    </ul>
  );
}
