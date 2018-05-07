import * as React from "react";

export interface Props {
  sendMessage: (text: string) => void;
  disabled?: boolean;
  disabledPlaceholder?: string;
}
export interface State {
  text: string;
}
export default class ChatInput extends React.Component<Props, State> {
  public state = {
    text: "",
  };

  public render() {
    const { disabled, disabledPlaceholder } = this.props;

    const placeholder = disabled && disabledPlaceholder ? disabledPlaceholder : "Say something";

    return (
      <form onSubmit={this.handleSubmit}>
        <input
          placeholder={placeholder}
          value={this.state.text}
          onChange={this.handleChange}
          readOnly={disabled}
        />{" "}
        <button disabled={disabled} type="submit">
          Send
        </button>
      </form>
    );
  }

  private handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;
    this.setState(() => ({ text }));
  };

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.state.text.length) {
      this.props.sendMessage(this.state.text);
      this.setState(() => ({ text: "" }));
    }
  };
}
