import * as React from "react";

export interface Props {
  createGame: () => void;
}
export default class CreateGameForm extends React.Component<Props> {
  public render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <button type="submit">Create</button>
      </form>
    );
  }
  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const { createGame } = this.props;
    e.preventDefault();
    createGame();
  };
}
