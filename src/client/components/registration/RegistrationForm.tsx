import * as React from "react";

interface Props {
  register: (formState: State) => void;
  loading: boolean;
}
interface State {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}
export default class RegistrationForm extends React.Component<Props, State> {
  public render() {
    const { loading } = this.props;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label htmlFor="username">
            Username
            <input
              type="text"
              id="username"
              name="username"
              onChange={this.handleChange}
              readOnly={loading}
            />
          </label>
        </div>

        <div>
          <label htmlFor="email">
            Email
            <input
              type="email"
              id="email"
              name="email"
              onChange={this.handleChange}
              readOnly={loading}
            />
          </label>
        </div>

        <div>
          <label htmlFor="password">
            Password
            <input
              type="password"
              id="password"
              name="password"
              onChange={this.handleChange}
              readOnly={loading}
            />
          </label>
        </div>

        <div>
          <label htmlFor="password">
            Repeat password
            <input
              type="password"
              id="repeatPassword"
              name="repeatPassword"
              onChange={this.handleChange}
              readOnly={loading}
            />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          Register
        </button>
      </form>
    );
  }
  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!this.props.loading) {
      this.props.register(this.state);
    }
  };

  private handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    this.setState(prev => ({
      ...prev,
      [name]: value,
    }));
  };
}
